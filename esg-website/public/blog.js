const API_CONFIG = {
  BASE_URL: "", // để trống vì sẽ gọi relative path
  ENDPOINTS: {
    POSTS: "/api/posts", // gọi API route proxy
  },
};

async function fetchPosts() {
  try {
    const url = `${API_CONFIG.ENDPOINTS.POSTS}`;
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


