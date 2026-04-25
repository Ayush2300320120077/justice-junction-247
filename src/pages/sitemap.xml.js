import connectDB from '../../middleware/db'
import Lawyer from '../../models/Lawyer'

const BASE_URL = 'https://justice-junction-app.vercel.app'
const TODAY = new Date().toISOString().split('T')[0]

const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/search', priority: '0.9', changefreq: 'daily' },
  { url: '/knowledge-hub', priority: '0.8', changefreq: 'weekly' },
  { url: '/rights', priority: '0.8', changefreq: 'weekly' },
  { url: '/document-generator', priority: '0.7', changefreq: 'monthly' },
  { url: '/faq', priority: '0.7', changefreq: 'monthly' },
  { url: '/join-as-lawyer', priority: '0.8', changefreq: 'monthly' },
  { url: '/about', priority: '0.6', changefreq: 'monthly' },
  { url: '/contact', priority: '0.6', changefreq: 'monthly' },
  { url: '/disclaimer', priority: '0.5', changefreq: 'yearly' },
  { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { url: '/terms', priority: '0.5', changefreq: 'yearly' },
  { url: '/register', priority: '0.6', changefreq: 'monthly' },
  { url: '/login', priority: '0.5', changefreq: 'monthly' },
]

const ARTICLE_SLUGS = ['consumer-complaint','rights-if-arrested','legal-notice','tenant-rights','rti-guide','divorce-laws','cyber-crime','labour-rights']

function generateSiteMap(lawyers) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
${ARTICLE_SLUGS.map(slug => `  <url>
    <loc>${BASE_URL}/knowledge/${slug}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${lawyers.map(({ _id }) => `  <url>
    <loc>${BASE_URL}/lawyer/${_id}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  try {
    await connectDB()
    const lawyers = await Lawyer.find({ isVerified: true, isBlocked: { $ne: true } }, '_id').lean()
    const sitemap = generateSiteMap(lawyers)
    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
    res.write(sitemap)
    res.end()
    return { props: {} }
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.end()
    return { props: {} }
  }
}

export default SiteMap
