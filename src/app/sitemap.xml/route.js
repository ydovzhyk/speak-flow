export async function GET() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const base = 'https://speakflow.art';

  const urls = [
    { loc: `${base}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${base}/how-it-works`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${base}/privacy`, priority: '0.6', changefreq: 'yearly' },
    { loc: `${base}/terms`, priority: '0.6', changefreq: 'yearly' },
  ];

  const body = urls
    .map(
      u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=0, s-maxage=600, stale-while-revalidate=86400',
    },
  });
}
