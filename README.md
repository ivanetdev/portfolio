# Works 2026 · Portfolio

Portfolio personal de proyectos de desarrollo, con panel de administración y publicación automática via GitHub Pages.

---

## 📁 Estructura del proyecto

```
portfolio/
├── index.html     → Portfolio público (lo que ve todo el mundo)
├── script.js      → Carga y renderiza los proyectos desde posts.json
├── admin.js       → Lógica del panel admin
├── style.css      → Estilos globales
└── posts.json     → Base de datos de proyectos (se sube a GitHub)
```

---

## 🚀 Cómo publicar en GitHub Pages

### Primera vez

1. Crea un repositorio en [github.com](https://github.com) (público)
2. Sube todos los archivos
3. Ve a **Settings → Pages**
4. En **Branch** selecciona `main` → **Save**
5. En 1-2 minutos tendrás tu portfolio en:
   ```
   https://TU_USUARIO.github.io/NOMBRE_REPO
   ```

---

## ✏️ Cómo añadir un nuevo proyecto

1. Abre `admin.html` en tu navegador (en local o en GitHub Pages)
2. Rellena el formulario:
   - **Título** del proyecto
   - **Descripción** y tecnologías usadas
   - **Tags** separados por comas (ej: `React, Node.js, MySQL`)
   - **URL** de la demo o repositorio
   - **Imagen** del proyecto (se comprime automáticamente)
3. Click en **"Añadir trabajo"**
4. Click en **"⬇️ Descargar posts.json"**
5. Reemplaza el `posts.json` del repositorio por el descargado
6. Haz commit y push → los cambios se publican automáticamente ✅

---

## 🔄 Flujo de actualización

```
Admin → Añadir/Editar proyecto
      → Exportar posts.json
      → Subir a GitHub
      → GitHub Pages actualiza el portfolio
```

---

## ⚠️ Notas importantes

- El panel `admin.html` guarda los datos en el **localStorage** de tu navegador. Úsalo siempre desde el mismo navegador para no perder los datos.
- Las imágenes se comprimen automáticamente a 800px / 70% calidad antes de guardarse.
- El `posts.json` es la **única fuente de verdad** para el portfolio público. Sin subirlo a GitHub, los visitantes no verán los cambios.
- El repo debe ser **público** para que GitHub Pages funcione de forma gratuita.

---

## 🛠️ Tecnologías

- HTML5 · CSS3 · JavaScript vanilla
- LocalStorage (admin)
- GitHub Pages (hosting)

---

## 👤 Autor

Desarrollado por ivanetdev
