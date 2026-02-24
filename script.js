// ── IndexedDB ──────────────────────────────────────────────
const DB_NAME = 'portfolioDB';
const STORE_NAME = 'posts';

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = e => {
            e.target.result.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = e => reject(e);
    });
}

async function getPosts() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const req = db.transaction(STORE_NAME, 'readonly')
                      .objectStore(STORE_NAME)
                      .getAll();
        req.onsuccess = () => resolve(req.result.reverse()); // más reciente primero
        req.onerror = reject;
    });
}

async function addPost(post) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const req = db.transaction(STORE_NAME, 'readwrite')
                      .objectStore(STORE_NAME)
                      .add(post);
        req.onsuccess = resolve;
        req.onerror = reject;
    });
}

async function updatePost(id, changes) {
    const db = await openDB();
    const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
        const getReq = store.get(id);
        getReq.onsuccess = () => {
            const updated = { ...getReq.result, ...changes };
            store.put(updated).onsuccess = resolve;
        };
        getReq.onerror = reject;
    });
}

async function deletePostById(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const req = db.transaction(STORE_NAME, 'readwrite')
                      .objectStore(STORE_NAME)
                      .delete(id);
        req.onsuccess = resolve;
        req.onerror = reject;
    });
}

// ── Render ─────────────────────────────────────────────────
async function renderPosts() {
    const posts = await getPosts();
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <div class="post-actions">
                <button class="edit"   onclick="editPost(${post.id})">Editar</button>
                <button class="delete" onclick="deletePost(${post.id})">Borrar</button>
            </div>
            <div class="post-title">${post.title}</div>
            <div class="post-description">${post.description}</div>
            <img src="${post.image}" alt="Imagen del trabajo">
        `;
        postsDiv.appendChild(postDiv);
    });
}

// ── Formulario ─────────────────────────────────────────────
async function handleFormSubmit(e) {
    e.preventDefault();
    const title       = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const file        = document.getElementById('image').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(evt) {
        await addPost({ title, description, image: evt.target.result });
        await renderPosts();
        document.getElementById('postForm').reset();
    };
    reader.readAsDataURL(file);
}

document.getElementById('postForm').addEventListener('submit', handleFormSubmit);

// ── Editar / Borrar ────────────────────────────────────────
async function editPost(id) {
    const posts = await getPosts();
    const post  = posts.find(p => p.id === id);
    if (!post) return;

    const title = prompt('Editar título:', post.title);
    if (title === null) return;
    const description = prompt('Editar descripción:', post.description);
    if (description === null) return;

    await updatePost(id, { title: title.trim(), description: description.trim() });
    await renderPosts();
}

async function deletePost(id) {
    if (!confirm('¿Seguro que quieres borrar este trabajo?')) return;
    await deletePostById(id);
    await renderPosts();
}

// ── Inicializar ────────────────────────────────────────────
renderPosts();