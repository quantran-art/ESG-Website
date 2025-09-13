// pages/api/post.js
const STRAPI_BASE = "https://cms.erasightconsulting.com";
const STRAPI_TOKEN =
  process.env.STRAPI_API_TOKEN ||
  "8607c9fc596d9057e9021dcb94ad18a17167b572a65c4f7a6658bb8c701050e9df549a21926092c103442603342053556cbf195b5d85c13381bb51aae5a683ef411f548567ab6c4cfa40d255579a20e48ec83914f95b69e9cd78718d758651d9e0ce2cdabf7db860a8eebbe0ce5b40b18734d3f19f26e60d46b1063745c74398";

function absUrl(u) {
  if (!u) return null;
  return u.startsWith("http") ? u : `${STRAPI_BASE}${u}`;
}

function flattenPost(item) {
  const a = item?.attributes || {};
  return {
    id: item?.id,
    title: a?.title || "",
    slug: a?.slug || "",
    content: a?.content || "",
    featured: a?.featured || false,
    readingTime: a?.readingTime || null,
    author: a?.author?.data ? a.author.data.attributes : null,
    category: a?.category?.data ? a.category.data.attributes : null,
    coverImage: a?.coverImage?.data
      ? {
          url: absUrl(a.coverImage.data.attributes.url),
          alt: a.coverImage.data.attributes.alternativeText,
        }
      : null,
    createdAt: a?.createdAt,
    updatedAt: a?.updatedAt,
    publishedAt: a?.publishedAt,
  };
}

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: "Missing slug" });

  try {
    const url = `${STRAPI_BASE}/api/posts?filters[slug][$eq]=${encodeURIComponent(
      slug
    )}&populate=deep`;
    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });
    if (!r.ok) return res.status(r.status).json({ error: "Failed to fetch" });

    const raw = await r.json();
    const item = Array.isArray(raw?.data) ? raw.data[0] : raw?.data;
    if (!item) return res.status(404).json({ error: "Not found" });

    const data = flattenPost(item);
    res.status(200).json({ data });
  } catch (e) {
    console.error("Proxy error:", e);
    res.status(500).json({ error: "Server error" });
  }
}
