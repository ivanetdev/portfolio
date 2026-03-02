// ── Carga y renderiza posts desde posts.json ──────────────
async function loadPosts() {
    const postsDiv = document.getElementById('posts');

    try {
        const res = await fetch('posts.json?_=' + Date.now());
        if (!res.ok) throw new Error('No se pudo cargar posts.json');
        const posts = await res.json();

        postsDiv.innerHTML = '';

        if (posts.length === 0) {
            postsDiv.innerHTML = '<p class="empty-state">Aún no hay trabajos publicados.</p>';
            return;
        }

        posts.forEach((post, i) => {
            const card = document.createElement('div');
            card.className = 'post-card';
            card.style.animationDelay = `${i * 0.08}s`;

            const tagsHTML = post.tags
                ? post.tags.map(t => `<span class="tag">${t}</span>`).join('')
                : '';

            const linkHTML = post.link
                ? `<a href="${post.link}" target="_blank" class="btn-link">Ver proyecto →</a>`
                : '';

            const imgHTML = post.image
                ? `<div class="post-img"><img src="${post.image}" alt="${post.title}"></div>`
                : '';

            card.innerHTML = `
                ${imgHTML}
                <div class="post-body">
                    <div class="post-header">
                        <h3 class="post-title">${post.title}</h3>
                        <span class="post-date">${post.date || ''}</span>
                    </div>
                    <p class="post-description">${post.description}</p>
                    <div class="post-footer">
                        <div class="tags">${tagsHTML}</div>
                        ${linkHTML}
                    </div>
                </div>
            `;
            postsDiv.appendChild(card);
        });

    } catch (err) {
        postsDiv.innerHTML = `<p class="empty-state">⚠️ ${err.message}</p>`;
        console.error(err);
    }
}

loadPosts();