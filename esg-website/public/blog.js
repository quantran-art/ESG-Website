

// public/blog.js
async function fetchPosts() {
  try {
    const res = await fetch("/api/posts");
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

    const data = await res.json();
    const posts = Array.isArray(data.data) ? data.data : [];

    if (!posts.length) {
      document.getElementById("blog-list").innerHTML =
        `<p class="text-red-500">Chưa có bài viết nào.</p>`;
      return;
    }

    renderPosts(posts);
  } catch (err) {
    console.error("Error loading posts:", err);
    document.getElementById("blog-list").innerHTML =
      `<p class="text-red-500">Không thể tải bài viết.</p>`;
  }
}

function renderPosts(posts) {
  const container = document.getElementById("blog-list");

  // Grid 3 cột: chỉ tạo 1 lần
  const grid = document.createElement("div");
  grid.className = "grid md:grid-cols-3 gap-6";

  posts.forEach((item) => {
    const a = item.attributes;
    const cover =
      a?.coverImage?.data?.attributes?.url || "/images/placeholder.jpg";
    const excerpt = a.content
      ? a.content.replace(/<[^>]+>/g, "").slice(0, 100) + "..."
      : "";
    const author = a.author?.data?.attributes?.name || "Unknown";
    const published = a.publishedAt
      ? new Date(a.publishedAt).toLocaleDateString("vi-VN")
      : "";

    // Mỗi card riêng biệt
    const card = document.createElement("article");
    card.className =
      "bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden";

    card.innerHTML = `
      <a href="/post.html?slug=${a.slug}" class="block">
        <img src="${cover}" alt="${a.title}" 
             class="w-full h-48 object-cover"/>
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-2 line-clamp-2">${a.title}</h2>
          <p class="text-gray-600 text-sm mb-3 line-clamp-3">${excerpt}</p>
          <div class="text-xs text-gray-500 flex items-center justify-between">
            <span>${author}</span>
            <span>${published}</span>
          </div>
        </div>
      </a>
    `;

    grid.appendChild(card);
  });

  // Clear cũ, append grid mới
  container.innerHTML = "";
  container.appendChild(grid);
}



document.addEventListener("DOMContentLoaded", fetchPosts);





