// public/post.js

async function fetchPost(slug) {
  try {
    const res = await fetch(`/api/post?slug=${slug}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    const data = await res.json();
    return data.data[0];
  } catch (err) {
    console.error("Error loading post:", err);
    return null;
  }
}

async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    document.getElementById("post-container").innerHTML =
      "<p class='text-red-500'>Không tìm thấy bài viết.</p>";
    return;
  }

  const post = await fetchPost(slug);
  if (!post) {
    document.getElementById("post-container").innerHTML =
      "<p class='text-gray-600'>Bài viết không tồn tại hoặc đã bị xóa.</p>";
    return;
  }

  const attr = post.attributes;
  document.getElementById("post-container").innerHTML = `
    <article>
      <h1 class="text-4xl font-bold mb-6">${attr.title}</h1>
      <div class="text-gray-700 leading-relaxed">${attr.content}</div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", loadPost);
