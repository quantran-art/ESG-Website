// blog.js

const API_CONFIG = {
  BASE_URL: "http://18.138.253.167", // đổi sang domain hoặc https nếu có
  ENDPOINTS: {
    POSTS: "/api/posts",
  },
};

async function fetchPosts() {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POSTS}?populate=*`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    renderPosts(data.data);
  } catch (err) {
    console.error("Error loading posts:", err);
    document.getElementById("blog-list").innerHTML =
      "<p class='text-red-500'>Không thể tải bài viết.</p>";
  }
}

function renderPosts(posts) {
  const container = document.getElementById("blog-list");
  container.innerHTML = "";

  posts.forEach((post) => {
    const attr = post.attributes;

    let cover = "";
    if (attr.cover?.data?.attributes?.url) {
      cover = attr.cover.data.attributes.url.startsWith("http")
        ? attr.cover.data.attributes.url
        : `${API_CONFIG.BASE_URL}${attr.cover.data.attributes.url}`;
    }

    const item = `
      <div class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
        ${cover ? `<img src="${cover}" alt="${attr.title}" class="w-full h-56 object-cover">` : ""}
        <div class="p-6 flex flex-col">
          <h2 class="text-2xl font-bold text-gray-800 mb-3">${attr.title}</h2>
          <p class="text-gray-600 mb-4">
            ${attr.excerpt ? attr.excerpt : (attr.content?.substring(0, 120) || "") + "..."}
          </p>
          <a href="post.html?slug=${attr.slug}" 
             class="mt-auto inline-block text-indigo-600 font-semibold hover:underline">
            Đọc thêm →
          </a>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", item);
  });
}

document.addEventListener("DOMContentLoaded", fetchPosts);
