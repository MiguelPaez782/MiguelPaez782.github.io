# 🎨 Portafolio Personal - Modo Nocturno

Portafolio web estático profesional diseñado para ser alojado en GitHub Pages.

## ✨ Características

- 🌙 Modo nocturno elegante
- 🎨 Color principal: Morado grisáceo (#C996D9)
- 📱 Diseño responsive (mobile-first)
- 🎭 Animaciones suaves de scroll
- 🧩 Componentes modulares reutilizables
- ⚡ HTML, CSS y JavaScript puros
- 🎯 TailwindCSS via CDN
- 🚀 Listo para GitHub Pages

## 📁 Estructura de Archivos

```
portafolio/
├── assets/
|   └── code_icon.png # Icono del sitio web
├── index.html      # Estructura principal del sitio
├── styles.css      # Estilos personalizados y animaciones
├── app.js          # Componentes y funcionalidades
└── README.md       # Este archivo
```

## 🚀 Instalación y Uso

### 1. Descargar los archivos

Descarga los tres archivos principales:
- `index.html`
- `styles.css`
- `app.js`

### 2. Subir a GitHub Pages

1. Crea un nuevo repositorio en GitHub
2. Sube los archivos a la rama `main`
3. Ve a Settings → Pages
4. Selecciona la rama `main` como fuente
5. ¡Tu portafolio estará en línea!

### 3. Visualización local

Simplemente abre `index.html` en tu navegador o usa un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

## 🎨 Personalización

### Cambiar Información Personal

Edita el archivo `index.html`:

1. **Nombre y título**: Busca la sección Hero y actualiza:
```html
<h2 class="text-6xl md:text-8xl font-bold mb-6 gradient-text">
    Hola, soy<br>Tu Nombre
</h2>
```

2. **Sobre mí**: Actualiza la sección con id `sobre-mi`

3. **Enlaces de contacto**: Busca la sección de contacto y actualiza:
```html
<a href="mailto:tu-email@ejemplo.com" class="contact-link">
<a href="https://github.com/tu-usuario" target="_blank" class="contact-link">
```

### 📦 Agregar Nuevos Proyectos

**Método 1: Editar el archivo app.js**

Abre `app.js` y agrega tu proyecto al array `proyectos`:

```javascript
const proyectos = [
    // ... proyectos existentes
    {
        name: "Nombre del Proyecto",
        description: "Descripción detallada del proyecto y sus características principales.",
        image: "URL_de_la_imagen_del_proyecto",
        link: "https://github.com/tu-usuario/proyecto",
        tags: ["React", "Node.js", "MongoDB"]
    }
];
```

**Método 2: Agregar proyectos dinámicamente**

Desde la consola del navegador o al final de `app.js`:

```javascript
addProject({
    name: "Mi Nuevo Proyecto",
    description: "Descripción del proyecto",
    image: "https://ejemplo.com/imagen.jpg",
    link: "https://github.com/usuario/repo",
    tags: ["JavaScript", "CSS", "HTML"]
});
```

### 🎨 Cambiar Colores

Edita las variables CSS en `styles.css`:

```css
:root {
    --color-dark: #0a0a0f;        /* Fondo principal */
    --color-darker: #050508;       /* Fondo más oscuro */
    --color-purple: #C996D9;       /* Color principal */
    --color-purple-dark: #a077b5;  /* Morado oscuro */
    --color-purple-light: #ddb8e9; /* Morado claro */
    --color-light: #f0f0f5;        /* Texto principal */
    --color-gray: #8a8a95;         /* Texto secundario */
}
```

### 🖼️ Imágenes de Proyectos

Puedes usar:

1. **URLs externas** (Unsplash, Imgur, etc.)
2. **Imágenes locales**: Crea una carpeta `images/` y usa rutas relativas:
   ```javascript
   image: "./images/proyecto1.jpg"
   ```

### ✏️ Cambiar Fuentes

Las fuentes actuales son **Outfit** y **Space Mono** desde Google Fonts.

Para cambiar, edita en `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=TuFuente:wght@300;400;600;700&display=swap" rel="stylesheet">
```

Y en `styles.css`:

```css
body {
    font-family: 'TuFuente', sans-serif;
}
```

## 🎭 Animaciones Incluidas

- ✨ Fade in al cargar
- 🔄 Scroll reveal
- 🎪 Hover effects
- 📜 Parallax en hero
- 💫 Floating elements
- 🎯 Smooth scroll
- 🌊 Gradient cursor effect

## 📱 Secciones Incluidas

1. **Navegación** - Navbar fija con menú móvil
2. **Hero** - Presentación principal
3. **Sobre Mí** - Información personal y habilidades
4. **Proyectos** - Grid de proyectos con componentes reutilizables
5. **Contacto** - Enlaces a redes sociales
6. **Footer** - Información de copyright

## 🛠️ Tecnologías Utilizadas

- HTML5
- CSS3 (Variables, Flexbox, Grid, Animations)
- JavaScript ES6+ (Clases, Modules, Observers)
- TailwindCSS (via CDN)
- Google Fonts

## 📋 Checklist de Personalización

- [ ] Cambiar nombre y título en Hero
- [ ] Actualizar sección "Sobre Mí"
- [ ] Agregar tus propios proyectos
- [ ] Actualizar enlaces de contacto (email, GitHub, LinkedIn)
- [ ] Cambiar imágenes de proyectos
- [ ] Personalizar skills/tecnologías
- [ ] Actualizar estadísticas en "Sobre Mí"
- [ ] Cambiar año en footer
- [ ] (Opcional) Personalizar colores
- [ ] (Opcional) Cambiar fuentes

## 🌟 Consejos

1. **Imágenes**: Usa imágenes de alta calidad pero optimizadas (WebP, max 500KB)
2. **Descripciones**: Sé específico en las descripciones de proyectos
3. **Links**: Asegúrate de que todos los enlaces funcionen
4. **Testing**: Prueba en diferentes dispositivos y navegadores
5. **SEO**: Actualiza el `<title>` y `<meta description>` en `index.html`

## 📸 Obtener Imágenes

Recursos gratuitos de imágenes:
- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- [Pixabay](https://pixabay.com)

## 🐛 Solución de Problemas

**Las animaciones no funcionan:**
- Verifica que `app.js` esté cargando correctamente
- Revisa la consola del navegador por errores

**Los estilos no se aplican:**
- Asegúrate de que `styles.css` esté en la misma carpeta
- Verifica que Tailwind CDN esté cargando

**El menú móvil no funciona:**
- Verifica que `app.js` esté cargando
- Revisa el elemento con id `menu-toggle`

## 📄 Licencia

Este proyecto es de uso libre. Puedes modificarlo y usarlo como desees.

## 🤝 Contribuciones

Si encuentras algún bug o tienes sugerencias, siéntete libre de:
1. Hacer un fork del proyecto
2. Crear una rama para tu feature
3. Hacer commit de tus cambios
4. Push a la rama
5. Abrir un Pull Request

---

**¡Buena suerte con tu portafolio!** 🚀

Si tienes preguntas, no dudes en contactarme.