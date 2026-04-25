import connectDB from '../../middleware/db'
import Lawyer from '../../models/Lawyer'

const BASE_URL = 'https://justice-junction-app.vercel.app'

function generateSiteMap(lawyers) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${BASE_URL}</loc>
     </url>
     <url>
       <loc>${BASE_URL}/search</loc>
     </url>
     <url>
       <loc>${BASE_URL}/about</loc>
     </url>
     <url>
       <loc>${BASE_URL}/pricing</loc>
     </url>
     <url>
       <loc>${BASE_URL}/lawyer-plans</loc>
     </url>
     <url>
       <loc>${BASE_URL}/disclaimer</loc>
     </url>
     <url>
       <loc>${BASE_URL}/privacy-policy</loc>
     </url>
     <url>
       <loc>${BASE_URL}/register</loc>
     </url>
     <url>
       <loc>${BASE_URL}/login</loc>
     </url>
     ${lawyers
       .map(({ _id }) => {
         return `
       <url>
           <loc>${`${BASE_URL}/lawyer/${_id}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  try {
    await connectDB()
    const lawyers = await Lawyer.find({}, '_id').lean()

    // We generate the XML sitemap with the lawyers data
    const sitemap = generateSiteMap(lawyers)

    res.setHeader('Content-Type', 'text/xml')
    // we send the XML to the browser
    res.write(sitemap)
    res.end()

    return {
      props: {},
    }
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.end()
    return { props: {} }
  }
}

export default SiteMap
