// pages/api/posts.js
const STRAPI_BASE = process.env.STRAPI_URL_BASE || "http://18.138.253.167";

const absUrl = (u) => (!u ? null : (u.startsWith("http") ? u : `${STRAPI_BASE}${u}`));

function flattenPost(item) {
  const a = item?.attributes || item || {};
  const id = item?.id || a?.id;
  const authorData = a?.author?.data || a?.author;
  const categoryData = a?.category?.data || a?.category;
  const tagsData = (a?.tags?.data || a?.tags) || [];
  const thumbData = a?.thumbnail?.data || a?.thumbnail;

  return {
    id,
    documentId: a?.documentId || null,
    title: a?.title || "",
    slug: a?.slug || "",
    excerpt: a?.excerpt || (a?.content ? String(a.content).replace(/<[^>]+>/g, "").slice(0, 180) : ""),
    content: a?.content ?? null,
    featured: Boolean(a?.featured),
    readingTime: a?.readingTime ?? null,
    author: authorData
      ? {
          id: authorData?.id ?? null,
          name: authorData?.attributes?.name || authorData?.name || null,
          title: authorData?.attributes?.title || authorData?.title || null,
          bio: authorData?.attributes?.bio || authorData?.bio || null,
        }
      : null,
    category: categoryData
      ? {
          id: categoryData?.id ?? null,
          name: categoryData?.attributes?.name || categoryData?.name || null,
          slug: categoryData?.attributes?.slug || categoryData?.slug || null,
          description: categoryData?.attributes?.description || categoryData?.description || null,
        }
      : null,
    tags: Array.isArray(tagsData)
      ? tagsData.map((t) => ({
          id: t?.id ?? null,
          name: t?.attributes?.name || t?.name || null,
          slug: t?.attributes?.slug || t?.slug || null,
        }))
      : [],
    thumbnail: thumbData
      ? {
          url: absUrl(thumbData?.attributes?.url || thumbData?.url),
          width: thumbData?.attributes?.width || thumbData?.width || null,
          height: thumbData?.attributes?.height || thumbData?.height || null,
          alt: thumbData?.attributes?.alternativeText || thumbData?.alternativeText || (a?.title || ""),
        }
      : null,
    createdAt: a?.createdAt || null,
    updatedAt: a?.updatedAt || null,
    publishedAt: a?.publishedAt || null,
  };
}

export default async function handler(req, res) {
  try {
    const url = `${STRAPI_BASE}/api/posts?populate=deep`;
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).json({ error: "Failed to fetch from Strapi" });
    const raw = await r.json();
    const arr = Array.isArray(raw?.data) ? raw.data : [];
    const data = arr.map(flattenPost).filter((p) => p && p.title && p.slug);
    return res.status(200).json({ data });
  } catch (e) {
    console.error("Proxy error:", e);
    return res.status(500).json({ error: "Server error" });
  }
}
