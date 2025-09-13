

// pages/api/posts.js
const STRAPI_BASE = "https://cms.erasightconsulting.com";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  "8607c9fc596d9057e9021dcb94ad18a17167b572a65c4f7a6658bb8c701050e9df549a21926092c103442603342053556cbf195b5d85c13381bb51aae5a683ef411f548567ab6c4cfa40d255579a20e48ec83914f95b69e9cd78718d758651d9e0ce2cdabf7db860a8eebbe0ce5b40b18734d3f19f26e60d46b1063745c74398";

function absUrl(u) {
  if (!u) return null;
  return u.startsWith("http") ? u : `${STRAPI_BASE}${u}`;
}

export default async function handler(req, res) {
  try {
    const response = await fetch(`${STRAPI_BASE}/api/posts?populate=deep`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });
    const raw = await response.json();

    const data = {
      ...raw,
      data: raw.data?.map((item) => {
        const a = item.attributes;
        if (a?.coverImage?.data) {
          a.coverImage.data.attributes.url = absUrl(
            a.coverImage.data.attributes.url
          );
        }
        return item;
      }),
    };

    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch posts from Strapi" });
  }
}
