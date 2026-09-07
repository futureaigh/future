import express from "express";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import pg from "pg";
import sharp from "sharp";
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// 301 www -> apex
app.use((req, res, next) => {
	const host = req.get("host") || "";
	if (host.startsWith("www.")) {
		return res.redirect(301, `https://${host.slice(4)}${req.originalUrl}`);
	}
	next();
});

const ADMIN_USER = process.env.ADMIN_USERNAME;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;
const COOKIE = "ttc_admin";
const COOKIE_TTL = 60 * 60 * 24 * 7; // 7 days

const sign = (data) =>
	crypto
		.createHmac("sha256", ADMIN_PASS || "dev")
		.update(data)
		.digest("hex");

// ------------------------------------------------------------
// Postgres
// ------------------------------------------------------------
const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
	ssl:
		process.env.DATABASE_URL &&
		process.env.DATABASE_URL.includes("railway.internal")
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
      source TEXT,
      message TEXT,
      created_date TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS source TEXT;
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;
    CREATE TABLE IF NOT EXISTS gallery_images (
      id BIGSERIAL PRIMARY KEY,
      s3_key TEXT UNIQUE NOT NULL,
      url TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      sort_order INT NOT NULL DEFAULT 0,
      visible BOOLEAN NOT NULL DEFAULT TRUE,
      width INT,
      height INT,
      bytes INT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS thumb_key TEXT;
    ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS thumb_url TEXT;
  `);
}

// ------------------------------------------------------------
// S3
// ------------------------------------------------------------
const s3 = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION || "auto",
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	},
});

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------
app.use(express.json());
app.use("/api", (req, res, next) => {
	res.setHeader("Cache-Control", "no-store");
	next();
});

function auth(req, res, next) {
	const raw = (req.headers.cookie || "")
		.split(";")
		.map((s) => s.trim())
		.find((c) => c.startsWith(COOKIE + "="));
	if (!raw) return res.status(401).json({ ok: false });
	const token = raw.slice(COOKIE.length + 1);
	const [user, exp, sig] = token.split(".");
	if (!user || !exp || !sig) return res.status(401).json({ ok: false });
	if (Date.now() > Number(exp)) return res.status(401).json({ ok: false });
	if (sign(`${user}.${exp}`) !== sig)
		return res.status(401).json({ ok: false });
	next();
}

// ------------------------------------------------------------
// Auth
// ------------------------------------------------------------
app.post("/api/login", (req, res) => {
	const { username, password } = req.body || {};
	if (username === ADMIN_USER && password === ADMIN_PASS) {
		const exp = Date.now() + COOKIE_TTL * 1000;
		const token = `${username}.${exp}.${sign(`${username}.${exp}`)}`;
		res.setHeader(
			"Set-Cookie",
			`${COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_TTL}; SameSite=Lax`,
		);
		return res.json({ ok: true });
	}
	return res.status(401).json({ ok: false, error: "Invalid credentials" });
});

app.post("/api/logout", (req, res) => {
	res.setHeader(
		"Set-Cookie",
		`${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
	);
	res.json({ ok: true });
});

// ------------------------------------------------------------
// Content
// ------------------------------------------------------------
app.get("/api/content", async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT id, section_key, content, updated_at FROM site_content ORDER BY section_key",
		);
		res.json(rows);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "db" });
	}
});

app.put("/api/content/:key", auth, async (req, res) => {
	const { key } = req.params;
	const { content } = req.body || {};
	if (content === undefined)
		return res.status(400).json({ error: "content required" });
	try {
		await pool.query(
			`INSERT INTO site_content (section_key, content, updated_at)
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content, updated_at = now()`,
			[key, JSON.stringify(content)],
		);
		res.json({ ok: true });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "db" });
	}
});

// ------------------------------------------------------------
// Submissions
// ------------------------------------------------------------
app.get("/api/submissions", auth, async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT id, name, email, phone, interest, source, message, is_read, archived, created_date FROM submissions ORDER BY created_date DESC",
		);
		res.json(rows);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "db" });
	}
});

app.patch("/api/submissions/:id", auth, async (req, res) => {
	const { is_read, archived } = req.body || {};
	const sets = [];
	const vals = [];
	if (typeof is_read === "boolean") {
		vals.push(is_read);
		sets.push(`is_read = $${vals.length}`);
	}
	if (typeof archived === "boolean") {
		vals.push(archived);
		sets.push(`archived = $${vals.length}`);
	}
	if (!sets.length) return res.status(400).json({ error: "nothing to update" });
	vals.push(req.params.id);
	try {
		const { rows } = await pool.query(
			`UPDATE submissions SET ${sets.join(", ")} WHERE id = $${vals.length} RETURNING id, name, email, phone, interest, source, message, is_read, archived, created_date`,
			vals,
		);
		if (!rows.length) return res.status(404).json({ error: "not found" });
		res.json(rows[0]);
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "db" });
	}
});

app.post("/api/submissions", async (req, res) => {
	const { name, email, phone, interest, source, message } = req.body || {};
	if (!name || !email)
		return res.status(400).json({ error: "name and email required" });
	try {
		await pool.query(
			`INSERT INTO submissions (name, email, phone, interest, source, message) VALUES ($1, $2, $3, $4, $5, $6)`,
			[name, email, phone || null, interest || null, source || null, message || null],
		);
		res.json({ ok: true });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "db" });
	}
});

// ------------------------------------------------------------
// Upload + media proxy
// ------------------------------------------------------------
app.post(
	"/api/upload",
	auth,
	express.raw({ type: () => true, limit: "15mb" }),
	async (req, res) => {
		const rawName = (req.query.name || "upload").toString();
		const safe = rawName.replace(/[^a-zA-Z0-9._-]/g, "_");
		const key = `site-content/${Date.now()}-${safe}`;
		const contentType =
			req.headers["content-type"] || "application/octet-stream";
		try {
			await s3.send(
				new PutObjectCommand({
					Bucket: process.env.S3_BUCKET,
					Key: key,
					Body: req.body,
					ContentType: contentType,
				}),
			);
			res.json({ url: `/media/${key}` });
		} catch (e) {
			console.error("S3 upload error", e);
			res.status(500).json({ error: "upload failed" });
		}
	},
);

app.get("/media/:key(*)", async (req, res) => {
	try {
		const obj = await s3.send(
			new GetObjectCommand({
				Bucket: process.env.S3_BUCKET,
				Key: req.params.key,
			}),
		);
		res.setHeader(
			"Content-Type",
			obj.ContentType || "application/octet-stream",
		);
		res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
		obj.Body.pipe(res);
	} catch (e) {
		res.status(404).end();
	}
});

// ------------------------------------------------------------
// Gallery (upload-only, S3-backed, optimized to WebP via sharp)
// ------------------------------------------------------------
const GALLERY_MAX_BYTES = 10 * 1024 * 1024;

function isSupportedImage(buf) {
	if (!buf || buf.length < 12) return false;
	// JPEG
	if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
	// PNG
	if (
		buf[0] === 0x89 &&
		buf[1] === 0x50 &&
		buf[2] === 0x4e &&
		buf[3] === 0x47
	)
		return true;
	// WebP (RIFF....WEBP)
	if (
		buf.toString("ascii", 0, 4) === "RIFF" &&
		buf.toString("ascii", 8, 12) === "WEBP"
	)
		return true;
	return false;
}

function galleryRow(r) {
	return {
		id: r.id,
		s3_key: r.s3_key,
		url: r.url,
		thumb_url: r.thumb_url || r.url,
		caption: r.caption,
		sort_order: r.sort_order,
		visible: r.visible,
		width: r.width,
		height: r.height,
		bytes: r.bytes,
		created_at: r.created_at,
	};
}

app.get("/api/gallery", async (req, res) => {
	try {
		const includeHidden = req.query.include_hidden === "1";
		if (includeHidden) {
			// Reuse cookie auth inline (public route otherwise)
			const raw = (req.headers.cookie || "")
				.split(";")
				.map((s) => s.trim())
				.find((c) => c.startsWith(COOKIE + "="));
			const token = raw ? raw.slice(COOKIE.length + 1) : "";
			const [user, exp, sig] = token.split(".");
			if (
				!user ||
				!exp ||
				!sig ||
				Date.now() > Number(exp) ||
				sign(`${user}.${exp}`) !== sig
			) {
				return res.status(401).json({ ok: false });
			}
		}
		const { rows } = await pool.query(
			includeHidden
				? "SELECT * FROM gallery_images ORDER BY sort_order ASC, created_at DESC"
				: "SELECT * FROM gallery_images WHERE visible = TRUE ORDER BY sort_order ASC, created_at DESC",
		);
		res.json(rows.map(galleryRow));
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "db" });
	}
});

app.post(
	"/api/gallery/upload",
	auth,
	express.raw({ type: () => true, limit: "15mb" }),
	async (req, res) => {
		const buf = req.body;
		if (!Buffer.isBuffer(buf) || buf.length === 0)
			return res.status(400).json({ error: "empty file" });
		if (buf.length > GALLERY_MAX_BYTES)
			return res.status(413).json({ error: "file too large (max 10MB)" });
		if (!isSupportedImage(buf))
			return res
				.status(400)
				.json({ error: "only JPEG, PNG or WebP uploads allowed" });
		try {
			// ponytail: AVIF full + WebP thumb only; add more widths when gallery page is slow
			const { data, info } = await sharp(buf, {
				limitInputPixels: 25_000_000,
			})
				.rotate()
				.resize({ width: 1920, withoutEnlargement: true })
				.avif({ quality: 65, effort: 4 })
				.toBuffer({ resolveWithObject: true });
			const thumb = await sharp(buf, { limitInputPixels: 25_000_000 })
				.rotate()
				.resize({ width: 400, withoutEnlargement: true })
				.webp({ quality: 70, effort: 4 })
				.toBuffer();
			const base = `${Date.now()}-${crypto.randomUUID()}`;
			const key = `gallery/${base}.avif`;
			const thumbKey = `gallery/${base}-thumb.webp`;
			await s3.send(
				new PutObjectCommand({
					Bucket: process.env.S3_BUCKET,
					Key: key,
					Body: data,
					ContentType: "image/avif",
				}),
			);
			await s3.send(
				new PutObjectCommand({
					Bucket: process.env.S3_BUCKET,
					Key: thumbKey,
					Body: thumb,
					ContentType: "image/webp",
				}),
			);
			const { rows } = await pool.query(
				`INSERT INTO gallery_images (s3_key, thumb_key, url, thumb_url, width, height, bytes)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
				[
					key,
					thumbKey,
					`/media/${key}`,
					`/media/${thumbKey}`,
					info.width,
					info.height,
					data.length,
				],
			);
			res.status(201).json(galleryRow(rows[0]));
		} catch (e) {
			console.error("Gallery upload error", e);
			res.status(400).json({ error: "invalid or corrupt image" });
		}
	},
);

app.put("/api/gallery/:id", auth, async (req, res) => {
	const { id } = req.params;
	const { caption, sort_order, visible } = req.body || {};
	const sets = [];
	const vals = [];
	if (typeof caption === "string") {
		vals.push(caption.slice(0, 300));
		sets.push(`caption = $${vals.length}`);
	}
	if (Number.isInteger(sort_order)) {
		vals.push(sort_order);
		sets.push(`sort_order = $${vals.length}`);
	}
	if (typeof visible === "boolean") {
		vals.push(visible);
		sets.push(`visible = $${vals.length}`);
	}
	if (!sets.length) return res.status(400).json({ error: "nothing to update" });
	vals.push(id);
	try {
		const { rows } = await pool.query(
			`UPDATE gallery_images SET ${sets.join(", ")} WHERE id = $${vals.length} RETURNING *`,
			vals,
		);
		if (!rows.length) return res.status(404).json({ error: "not found" });
		res.json(galleryRow(rows[0]));
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "db" });
	}
});

app.delete("/api/gallery/:id", auth, async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM gallery_images WHERE id = $1",
			[req.params.id],
		);
		if (!rows.length) return res.status(404).json({ error: "not found" });
		for (const k of [rows[0].s3_key, rows[0].thumb_key].filter(Boolean)) {
			try {
				await s3.send(
					new DeleteObjectCommand({
						Bucket: process.env.S3_BUCKET,
						Key: k,
					}),
				);
			} catch (e) {
				console.error("Gallery S3 delete error", e);
			}
		}
		await pool.query("DELETE FROM gallery_images WHERE id = $1", [
			req.params.id,
		]);
		res.json({ ok: true });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "db" });
	}
});

// ------------------------------------------------------------
// Static + SPA (cache strategy)
// ------------------------------------------------------------
app.use(
	"/assets",
	express.static(path.join(__dirname, "dist", "assets"), {
		immutable: true,
		maxAge: "1y",
	}),
);

app.use(
	express.static(path.join(__dirname, "dist"), {
		setHeaders: (res) => res.setHeader("Cache-Control", "no-cache"),
	}),
);

app.get("*", (req, res) => {
	res.setHeader("Cache-Control", "no-cache");
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ------------------------------------------------------------
// Start
// ------------------------------------------------------------
const port = process.env.PORT || 8080;
initDb()
	.then(() =>
		app.listen(port, () => console.log(`TTC server listening on ${port}`)),
	)
	.catch((e) => {
		console.error("DB init failed", e);
		process.exit(1);
	});
