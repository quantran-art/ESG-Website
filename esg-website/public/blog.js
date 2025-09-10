const API_CONFIG = {
  BASE_URL: '', // nếu deploy có domain thì để trống là được
  ENDPOINTS: {
    POSTS: '/api/posts',
  },
};

async function fetchPosts() {
  try {
    const url = `${API_CONFIG.ENDPOINTS.POSTS}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

    const data = await res.json();
    console.log("API response:", data);

    // Nếu API trả về { data: [...] } thì lấy data.data
    // Nếu API trả về [...] thì lấy trực tiếp data
    const posts = Array.isArray(data) ? data : data.data;

    if (!posts || posts.length === 0) {
      document.getElementById("blog-list").innerHTML =
        `<p class="text-red-500">Không có bài viết.</p>`;
      return;
    }

    renderPosts(posts);
  } catch (err) {
    console.error("Error loading posts:", err);
    document.getElementById("blog-list").innerHTML =
      `<p class="text-red-500">Không thể tải bài viết.</p>`;
  }
}






