// pages/api/posts.js

export default async function handler(req, res) {
  try {
    const response = await fetch("http://18.138.253.167/api/posts?populate=*");
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch posts from Strapi" });
  }
}
