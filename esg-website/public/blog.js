// public/blog.js

const API_CONFIG = {
  ENDPOINTS: {
    POSTS: "/api/posts", // proxy trong Next.js
  },
};

// Fetch tất cả bài viết
async function fetchPosts() {
  try {
    const res = await fetch(API_CONFIG.ENDPOINTS.POSTS);
    if (!res.ok) throw new Error("Failed to fetch posts");

    const data = await res.json();
    renderPosts(data.data); // Strapi trả về data.data
  } catch (err) {
    console.error("Error loading posts:", err);
    document.getElementById("blog-list").innerHTML =
      `<p class="text-red-500">Không thể tải bài viết.</p>`;
  }
}

// Render card danh sách post
function renderPosts(posts) {
  const container = document.getElementById("blog-list");
  container.innerHTML = "";

  if (!posts || posts.length === 0) {
    container.innerHTML = `<p class="text-gray-500">Chưa có bài viết nào.</p>`;
    return;
  }

  posts.forEach((post) => {
    const attrs = post.attributes;
    const title = attrs.title || "Không có tiêu đề";
    const slug = attrs.slug || "#";
    const excerpt = attrs.content
      ? attrs.content.substring(0, 150) + "..."
      : "Không có nội dung.";
    const imageUrl =
      attrs.image?.data?.attributes?.url ||
      "https://via.placeholder.com/400x200";

    const card = `
      <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
        <img src="${imageUrl}" alt="${title}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2">${title}</h2>
          <p class="text-gray-600 mb-4">${excerpt}</p>
          <a href="/post.html?slug=${slug}" 
             class="text-blue-600 hover:underline font-medium">
             Đọc thêm →
          </a>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// Khi load trang
document.addEventListener("DOMContentLoaded", fetchPosts);
