// Seed site_content from content.json. Pass section keys to limit, e.g. `node seed.cjs contact`.
const fs = require("fs");
const pg = require("pg");

(async () => {
	if (!process.env.DATABASE_URL) {
		console.error("DATABASE_URL not set");
		process.exit(1);
	}
	const pool = new pg.Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: { rejectUnauthorized: false },
	});
	const filter = new Set(process.argv.slice(2));
	let records;
	try {
		records = JSON.parse(fs.readFileSync("content.json", "utf8"));
	} catch (e) {
		console.error("Invalid content.json:", e.message);
		process.exit(1);
	}
	for (const r of records) {
		if (filter.size && !filter.has(r.section_key)) continue;
		await pool.query(
			`INSERT INTO site_content (section_key, content, updated_at)
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content, updated_at = now()`,
			[r.section_key, JSON.stringify(r.content)],
		);
		console.log("upserted", r.section_key);
	}
	await pool.end();
})().catch((e) => {
	console.error("ERR", e.message);
	process.exit(1);
});
