// public/post.js
async function fetchPost() {
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  if (!slug) return;

  try {
    const res = await fetch(`/api/post?slug=${encodeURIComponent(slug)}`);
    const json = await res.json();
    const data = json?.data;
    if (!data) return;

    renderPost(data);
  } catch (e) {
    console.error(e);
  }
}

function renderPost(post) {
  document.getElementById("post-title").textContent = post.title;
  if (post.coverImage) {
    const img = document.getElementById("post-cover");
    img.src = post.coverImage.url;
    img.alt = post.title;
  }
  if (post.author) {
    document.getElementById("post-author").textContent = post.author.name;
  }
  document.getElementById("post-content").innerHTML = post.content;
}

document.addEventListener("DOMContentLoaded", fetchPost);
