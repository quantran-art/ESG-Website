// public/blog.js

const API_CONFIG = {
  ENDPOINTS: {
    POSTS: "/api/posts", // proxy đã tạo
  },
};

async function fetchPosts() {
  try {
    const res = await fetch(API_CONFIG.ENDPOINTS.POSTS);
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    renderPosts(data.data);
  } catch (err) {
    console.error("Error loading posts:", err);
    document.getElementById("blog-list").innerHTML =
      "<p class='text-red-500'>Không thể tải bài viết.</p>";
  }
}
