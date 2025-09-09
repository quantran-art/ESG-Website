// public/post.js
(function () {
  const API = { POST: (slug) => `/api/post?slug=${encodeURIComponent(slug)}` };

  function $(sel) { return document.querySelector(sel); }
  function escapeHtml(str) { return String(str || "").replace(/[&<>"']/g, (s) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[s])); }

  function normalize(item) {
    if (!item) return null;
    const p = item.attributes || item;
    const thumb = (p.thumbnail && (p.thumbnail.data || p.thumbnail)) || null;
    const img = thumb ? (thumb.attributes ? thumb.attributes.url : thumb.url) : null;
    const author = p.author?.data || p.author;
    return {
      id: item.id || p.id,
      title: p.title || "",
      slug: p.slug || "",
      content: p.content || "",
      image: img,
      author: author ? (author.attributes ? author.attributes.name : author.name) : null,
      publishedAt: p.publishedAt || null,
    };
  }

  function renderPost(data) {
    const post = normalize(data);
    if (!post) return;
    if ($("#post-title")) $("#post-title").textContent = post.title;
    if ($("#post-cover") && post.image) {
      const img = $("#post-cover");
      img.src = post.image.startsWith("http") ? post.image : post.image;
      img.alt = post.title;
    }
    if ($("#post-author") && post.author) $("#post-author").textContent = post.author;
    if ($("#post-content")) $("#post-content").innerHTML = post.content;
  }

  async function init() {
    const params = new URLSearchParams(location.search);
    const slug = params.get("slug");
    if (!slug) return;
    try {
      const res = await fetch(API.POST(slug));
      const json = await res.json();
      const data = json?.data || json;
      renderPost(data);
    } catch (e) {
      console.error(e);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
