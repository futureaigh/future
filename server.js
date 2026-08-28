import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const ADMIN_USER = process.env.ADMIN_USERNAME;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;
const COOKIE = 'ttc_admin';
const COOKIE_TTL = 60 * 60 * 24 * 7; // 7 days

const sign = (data) =>
  crypto.createHmac('sha256', ADMIN_PASS || 'dev').update(data).digest('hex');

// ------------------------------------------------------------
// Postgres
// ------------------------------------------------------------
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway.internal')
    ? { rejectUnauthorized: false }
    : false,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id BIGSERIAL PRIMARY KEY,
      section_key TEXT UNIQUE NOT NULL,
      content JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS submissions (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      interest TEXT,
      message TEXT,
      created_date TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

// ------------------------------------------------------------
// S3
// ------------------------------------------------------------
const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------
app.use(express.json());
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

function auth(req, res, next) {
  const raw = (req.headers.cookie || '')
    .split(';')
    .map((s) => s.trim())
    .find((c) => c.startsWith(COOKIE + '='));
  if (!raw) return res.status(401).json({ ok: false });
  const token = raw.slice(COOKIE.length + 1);
  const [user, exp, sig] = token.split('.');
  if (!user || !exp || !sig) return res.status(401).json({ ok: false });
  if (Date.now() > Number(exp)) return res.status(401).json({ ok: false });
  if (sign(`${user}.${exp}`) !== sig) return res.status(401).json({ ok: false });
  next();
}

// ------------------------------------------------------------
// Auth
// ------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const exp = Date.now() + COOKIE_TTL * 1000;
    const token = `${username}.${exp}.${sign(`${username}.${exp}`)}`;
    res.setHeader('Set-Cookie', `${COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_TTL}; SameSite=Lax`);
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Invalid credentials' });
});

app.post('/api/logout', (req, res) => {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
  res.json({ ok: true });
});

// ------------------------------------------------------------
// Content
// ------------------------------------------------------------
app.get('/api/content', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, section_key, content, updated_at FROM site_content ORDER BY section_key'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db' });
  }
});

app.put('/api/content/:key', auth, async (req, res) => {
  const { key } = req.params;
  const { content } = req.body || {};
  if (content === undefined) return res.status(400).json({ error: 'content required' });
  try {
    await pool.query(
      `INSERT INTO site_content (section_key, content, updated_at)
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content, updated_at = now()`,
      [key, JSON.stringify(content)]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db' });
  }
});

// ------------------------------------------------------------
// Submissions
// ------------------------------------------------------------
app.get('/api/submissions', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, phone, interest, message, created_date FROM submissions ORDER BY created_date DESC'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db' });
  }
});

app.post('/api/submissions', async (req, res) => {
  const { name, email, phone, interest, message } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  try {
    await pool.query(
      `INSERT INTO submissions (name, email, phone, interest, message) VALUES ($1, $2, $3, $4, $5)`,
      [name, email, phone || null, interest || null, message || null]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db' });
  }
});

// ------------------------------------------------------------
// Upload + media proxy
// ------------------------------------------------------------
app.post('/api/upload', auth, express.raw({ type: () => true, limit: '15mb' }), async (req, res) => {
  const rawName = (req.query.name || 'upload').toString();
  const safe = rawName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `site-content/${Date.now()}-${safe}`;
  const contentType = req.headers['content-type'] || 'application/octet-stream';
  try {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: req.body,
      ContentType: contentType,
    }));
    res.json({ url: `/media/${key}` });
  } catch (e) {
    console.error('S3 upload error', e);
    res.status(500).json({ error: 'upload failed' });
  }
});

app.get('/media/:key(*)', async (req, res) => {
  try {
    const obj = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: req.params.key,
    }));
    res.setHeader('Content-Type', obj.ContentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    obj.Body.pipe(res);
  } catch (e) {
    res.status(404).end();
  }
});

// ------------------------------------------------------------
// Static + SPA (cache strategy)
// ------------------------------------------------------------
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), {
  immutable: true,
  maxAge: '1y',
}));

app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res) => res.setHeader('Cache-Control', 'no-cache'),
}));

app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ------------------------------------------------------------
// Start
// ------------------------------------------------------------
const port = process.env.PORT || 8080;
initDb()
  .then(() => app.listen(port, () => console.log(`TTC server listening on ${port}`)))
  .catch((e) => {
    console.error('DB init failed', e);
    process.exit(1);
  });
