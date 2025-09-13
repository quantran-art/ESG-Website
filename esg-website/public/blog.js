

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
  container.innerHTML = `
    <div class="grid md:grid-cols-3 gap-6">
      ${posts
        .map((item) => {
          const a = item.attributes;
          const cover = a?.coverImage?.data?.attributes?.url || "/images/default.jpg";
          return `
            <article class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <a href="/post.html?slug=${a.slug}">
                <img src="${cover}" alt="${a.title}" class="w-full h-48 object-cover"/>
                <div class="p-4">
                  <h2 class="text-lg font-semibold mb-2">${a.title}</h2>
                  <p class="text-sm text-gray-600 mb-3">${a.content?.slice(0,120)}...</p>
                  <div class="text-xs text-gray-500">
                    ${a.author?.data?.attributes?.name || "Unknown"}
                  </div>
                </div>
              </a>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", fetchPosts);





