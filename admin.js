// ── Estado ─────────────────────────────────────────────────
const STORAGE_KEY = 'portfolio_posts';

function getPosts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function today() {
    return new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Render ─────────────────────────────────────────────────
function renderPosts() {
    const posts = getPosts();
    const postsDiv = document.getElementById('posts');
    document.getElementById('postCount').textContent = posts.length;

    postsDiv.innerHTML = '';

    if (posts.length === 0) {
        postsDiv.innerHTML = '<p class="empty-state">Aún no has añadido ningún trabajo.</p>';
        return;
    }

    posts.forEach((post, i) => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.style.animationDelay = `${i * 0.06}s`;

        const tagsHTML = (post.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
        const imgHTML = post.image ? `<div class="post-img"><img src="${post.image}" alt="${post.title}"></div>` : '';

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
                    <div class="post-actions">
                        <button class="btn-edit" onclick="editPost('${post.id}')">✏️ Editar</button>
                        <button class="btn-delete" onclick="deletePost('${post.id}')">🗑️ Borrar</button>
                    </div>
                </div>
            </div>
        `;
        postsDiv.appendChild(card);
    });
}

// ── Formulario ─────────────────────────────────────────────
document.getElementById('image').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
});

document.getElementById('postForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id      = document.getElementById('editId').value;
    const title   = document.getElementById('title').value.trim();
    const desc    = document.getElementById('description').value.trim();
    const tagsRaw = document.getElementById('tags').value.trim();
    const link    = document.getElementById('link').value.trim();
    const file    = document.getElementById('image').files[0];
    const tags    = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

    const posts = getPosts();

    const processImage = (callback) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX = 800;
                    let w = img.width, h = img.height;
                    if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
                    if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    callback(canvas.toDataURL('image/jpeg', 0.7)); // comprime al 70%
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            callback(null);
        }
    };

    processImage((imageData) => {
        if (id) {
            // Editar existente
            const idx = posts.findIndex(p => p.id === id);
            if (idx !== -1) {
                posts[idx] = {
                    ...posts[idx],
                    title, description: desc, tags, link,
                    ...(imageData ? { image: imageData } : {})
                };
            }
        } else {
            // Nuevo post
            const newPost = { id: generateId(), title, description: desc, tags, link, date: today() };
            if (imageData) newPost.image = imageData;
            posts.unshift(newPost);
        }

        savePosts(posts);
        renderPosts();
        resetForm();
        showToast(id ? '✅ Trabajo actualizado' : '✅ Trabajo añadido — Recuerda exportar el JSON!');
    });
});

// ── Editar / Borrar ────────────────────────────────────────
function editPost(id) {
    const post = getPosts().find(p => p.id === id);
    if (!post) return;

    document.getElementById('editId').value       = post.id;
    document.getElementById('title').value        = post.title;
    document.getElementById('description').value  = post.description;
    document.getElementById('tags').value         = (post.tags || []).join(', ');
    document.getElementById('link').value         = post.link || '';

    if (post.image) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = `<img src="${post.image}" alt="Preview actual">`;
        preview.classList.remove('hidden');
    }

    document.getElementById('form-title').textContent = '✏️ Editar trabajo';
    document.getElementById('submitBtn').textContent  = 'Guardar cambios';
    document.getElementById('cancelBtn').classList.remove('hidden');
    document.querySelector('.admin-card').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    resetForm();
}

function deletePost(id) {
    if (!confirm('¿Seguro que quieres borrar este trabajo?')) return;
    const posts = getPosts().filter(p => p.id !== id);
    savePosts(posts);
    renderPosts();
    showToast('🗑️ Trabajo eliminado — Recuerda exportar el JSON!');
}

// ── Export JSON ────────────────────────────────────────────
function exportJSON() {
    const posts = getPosts();

    // Limpiamos los campos vacíos para el JSON final
    const clean = posts.map(p => {
        const obj = { id: p.id, title: p.title, description: p.description, date: p.date };
        if (p.tags && p.tags.length) obj.tags = p.tags;
        if (p.link) obj.link = p.link;
        if (p.image) obj.image = p.image;
        return obj;
    });

    const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'posts.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📦 posts.json descargado — Súbelo a GitHub para publicar!');
}

// ── Utils ──────────────────────────────────────────────────
function resetForm() {
    document.getElementById('postForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('form-title').textContent = '➕ Añadir trabajo';
    document.getElementById('submitBtn').textContent  = 'Añadir trabajo';
    document.getElementById('cancelBtn').classList.add('hidden');
}

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

// ── Inicializar ────────────────────────────────────────────
renderPosts();