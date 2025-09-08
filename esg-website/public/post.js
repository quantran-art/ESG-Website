// post.js

const API_CONFIG = {
  BASE_URL: "http://18.138.253.167", // đổi sang domain hoặc https nếu có
  ENDPOINTS: {
    POSTS: "/api/posts",
  },
};

async function fetchPostBySlug(slug) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POSTS}?filters[slug][$eq]=${slug}&populate=*`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch post");
  const data = await res.json();
  return data.data[0];
}

async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    document.getElementById("post-container").innerHTML =
      "<p class='text-red-500'>Không tìm thấy bài viết.</p>";
    return;
  }

  try {
    const post = await fetchPostBySlug(slug);
    if (!post) {
      document.getElementById("post-container").innerHTML =
        "<p class='text-gray-600'>Bài viết không tồn tại hoặc đã bị xóa.</p>";
      return;
    }
    renderPost(post.attributes);
  } catch (err) {
    console.error("Error loading post:", err);
    document.getElementById("post-container").innerHTML =
      "<p class='text-red-500'>Lỗi khi tải bài viết.</p>";
  }
}

function renderPost(attr) {
  let cover = "";
  if (attr.cover?.data?.attributes?.url) {
    cover = attr.cover.data.attributes.url.startsWith("http")
      ? attr.cover.data.attributes.url
      : `${API_CONFIG.BASE_URL}${attr.cover.data.attributes.url}`;
  }

  const container = document.getElementById("post-container");
  container.innerHTML = `
    <article>
      <h1 class="text-4xl font-bold mb-6">${attr.title}</h1>
      ${cover ? `<img src="${cover}" alt="${attr.title}" class="w-full h-96 object-cover rounded-xl mb-6">` : ""}
      <div class="text-gray-700 leading-relaxed">
        ${attr.content}
      </div>
      <p class="mt-8 text-sm text-gray-500">Danh mục: ${attr.category?.data?.attributes?.name || "Không có"}</p>
      <p class="text-sm text-gray-500">Tags: ${
        attr.tags?.data?.map((t) => t.attributes.name).join(", ") || "Không có"
      }</p>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", loadPost);
