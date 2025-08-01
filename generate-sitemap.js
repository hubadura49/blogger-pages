const fs = require("fs");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const BLOG_URL = "https://pibodi-games.blogspot.com"; // заміни на свій блог
const SITEMAP_FILE = "sitemap.xml";

(async () => {
  try {
    const res = await fetch(`${BLOG_URL}/sitemap.xml`);
    if (!res.ok) throw new Error("Can't fetch Blogger sitemap");
    const xml = await res.text();

    const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(match => {
  let url = match[1];
  // Якщо URL не закінчується на '?m=0' і не має параметрів - додаємо '?m=0'
  if (!url.endsWith('?m=0')) {
    if (url.includes('?')) {
      // Якщо є інші параметри, додаємо '&m=0'
      url += '&m=0';
    } else {
      url += '?m=0';
    }
  }
  return url;
});

    const sitemapXml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls
        .map(
          url => `  <url>\n    <loc>${url}</loc>\n  </url>`
        )
        .join("\n") +
      `\n</urlset>`;

    fs.writeFileSync(SITEMAP_FILE, sitemapXml, "utf8");
    console.log("✅ Sitemap generated.");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(254);
  }
})();
