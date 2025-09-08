// pages/api/post.js
export default async function handler(req, res) {
  const { slug } = req.query;
  const STRAPI_URL = `http://18.138.253.167/api/posts?filters[slug][$eq]=${slug}&populate=*`;

  try {
    const response = await fetch(STRAPI_URL);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from Strapi" });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
