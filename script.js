// Utiliza localStorage para guardar los posts
function getPosts() {
    return JSON.parse(localStorage.getItem('portfolioPosts') || '[]');
}

function savePosts(posts) {
    localStorage.setItem('portfolioPosts', JSON.stringify(posts));
}

function renderPosts() {
    const posts = getPosts();
    const postsDiv = document.getElementById('posts');
    postsDiv.innerHTML = '';
    posts.forEach((post, idx) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <div class="post-actions">
                <button class="edit" onclick="editPost(${idx})">Editar</button>
                <button class="delete" onclick="deletePost(${idx})">Borrar</button>
            </div>
            <div class="post-title">${post.title}</div>
            <div class="post-description">${post.description}</div>
            <img src="${post.image}" alt="Imagen del trabajo">
        `;
        postsDiv.appendChild(postDiv);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const imageInput = document.getElementById('image');
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        const posts = getPosts();
        posts.unshift({
            title,
            description,
            image: evt.target.result
        });
        savePosts(posts);
        renderPosts();
        document.getElementById('postForm').reset();
    };
    reader.readAsDataURL(file);
}

document.getElementById('postForm').addEventListener('submit', handleFormSubmit);

function editPost(idx) {
    const posts = getPosts();
    const post = posts[idx];
    const title = prompt('Editar título:', post.title);
    if (title === null) return;
    const description = prompt('Editar descripción:', post.description);
    if (description === null) return;
    // Imagen no editable por simplicidad
    posts[idx].title = title.trim();
    posts[idx].description = description.trim();
    savePosts(posts);
    renderPosts();
}

function deletePost(idx) {
    if (!confirm('¿Seguro que quieres borrar este trabajo?')) return;
    const posts = getPosts();
    posts.splice(idx, 1);
    savePosts(posts);
    renderPosts();
}

// Inicializar
renderPosts();
