// public/blog.js
(function () {
  const API = { POSTS: "/api/posts" };

  function ensureStyles() {
    if (document.getElementById("blog-cards-css")) return;
    const css = `
    .blog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px}
    .blog-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);transition:transform .2s ease,box-shadow .2s ease}
    .blog-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.12)}
    .blog-card__link{display:block;text-decoration:none;color:inherit}
    .blog-card__media{position:relative}
    .blog-card__media img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;display:block}
    .blog-card__cta{position:absolute;right:16px;bottom:16px;background:#2e7d32;color:#fff;padding:8px 12px;border-radius:999px;font-weight:700;font-size:13px;letter-spacing:.3px}
    .blog-card__body{padding:16px}
    .blog-card__tag{display:inline-block;background:#e8f5e9;color:#2e7d32;padding:4px 10px;border-radius:999px;font-weight:600;font-size:12px;margin-bottom:8px}
    .blog-card__title{font-size:18px;line-height:1.35;margin:6px 0 0}
    .blog-card__excerpt{font-size:14px;color:#4b5563;margin-top:8px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
    `;
    const s = document.createElement("style");
    s.id = "blog-cards-css";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[s]));
  }

  function normalize(p) {
    if (!p) return null;
    const a = p.attributes || p;
    const thumb = (a.thumbnail && (a.thumbnail.data || a.thumbnail)) || null;
    const thumbUrl = thumb ? (thumb.attributes ? thumb.attributes.url : thumb.url) : null;
    const category = (a.category && (a.category.data || a.category)) || null;
    const catName = category ? (category.attributes ? category.attributes.name : category.name) : null;
    const tags = (a.tags && (a.tags.data || a.tags)) || [];
    const firstTag = Array.isArray(tags) && tags.length ? (tags[0].attributes ? tags[0].attributes.name : tags[0].name) : null;

    return {
      id: p.id || a.id,
      title: a.title || "",
      slug: a.slug || "",
      excerpt: a.excerpt || (a.content ? String(a.content).replace(/<[^>]+>/g, "").slice(0, 140) : ""),
      image: thumbUrl,
      category: catName,
      tag: firstTag,
    };
  }

  function toArray(payload) {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    return [];
    }

  function renderPosts(payload) {
    ensureStyles();
    const mount = document.getElementById("blog-list");
    if (!mount) return;

    const posts = toArray(payload);
    if (posts.length === 0) {
      mount.innerHTML = "<p>Không có bài viết.</p>";
      return;
    }

    const cards = posts
      .map((raw) => {
        const p = normalize(raw);
        if (!p || !p.title || !p.slug) return "";
        const img = p.image ? p.image : "/images/placeholder.jpg";
        const tagOrCat = p.category || p.tag || "";
        return `
        <article class="blog-card">
          <a class="blog-card__link" href="/post.html?slug=${encodeURIComponent(p.slug)}">
            <div class="blog-card__media">
              <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy" />
              <span class="blog-card__cta">MORE INFO →</span>
            </div>
            <div class="blog-card__body">
              ${tagOrCat ? `<span class="blog-card__tag">${escapeHtml(tagOrCat)}</span>` : ""}
              <h3 class="blog-card__title">${escapeHtml(p.title)}</h3>
              ${p.excerpt ? `<p class="blog-card__excerpt">${escapeHtml(p.excerpt)}</p>` : ""}
            </div>
          </a>
        </article>`;
      })
      .join("");

    mount.innerHTML = `<div class="blog-grid">${cards}</div>`;
  }

  async function init() {
    try {
      const res = await fetch(API.POSTS);
      if (!res.ok) throw new Error("Network error " + res.status);
      const payload = await res.json();
      renderPosts(payload);
    } catch (err) {
      console.error("Error loading posts:", err);
      const el = document.getElementById("blog-list");
      if (el) el.innerHTML = "<p class='text-red-500'>Không thể tải bài viết.</p>";
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();

