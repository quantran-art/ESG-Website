// pages/api/updatePost.js
const STRAPI_BASE = "https://cms.erasightconsulting.com";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  "8607c9fc596d9057e9021dcb94ad18a17167b572a65c4f7a6658bb8c701050e9df549a21926092c103442603342053556cbf195b5d85c13381bb51aae5a683ef411f548567ab6c4cfa40d255579a20e48ec83914f95b69e9cd78718d758651d9e0ce2cdabf7db860a8eebbe0ce5b40b18734d3f19f26e60d46b1063745c74398";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, data } = req.body;
  if (!id || !data) {
    return res.status(400).json({ error: "Missing id or data" });
  }

  try {
    const response = await fetch(`${STRAPI_BASE}/api/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data }),
    });

    const result = await response.json();
    res.status(response.status).json(result);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
}
