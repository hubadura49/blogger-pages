// generate-sitemap.js

const fs = require("fs");
const https = require("https");

const BLOG_FEED = "https://pibodi-games.blogspot.com/feeds/posts/default?alt=json&max-results=500";
const SITEMAP_FILE = "sitemap.xml";

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    return {'<':'&lt;', '>':'&gt;', '&':'&amp;', '\'':'&apos;', '"':'&quot;'}[c];
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

https.get(BLOG_FEED, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    const json = JSON.parse(data);
    const entries = json.feed.entry || [];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const entry of entries) {
      const link = entry.link.find(l => l.rel === "alternate").href + "?m=0";
      const updated = formatDate(entry.updated.$t);
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(link)}</loc>\n`;
      xml += `    <lastmod>${updated}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>\n`;

    fs.writeFileSync(SITEMAP_FILE, xml);
    console.log("✅ sitemap.xml створено!");
  });
}).on("error", (err) => {
  console.error("Помилка запиту:", err.message);
});
