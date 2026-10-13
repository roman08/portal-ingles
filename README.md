# Mi Pizarrón de Inglés

Plataforma personal para estudiar inglés con las clases de [Teacher Gaby Manzano](https://www.youtube.com/channel/UCdkMjTqjPcxqaUuYio7UIbw) en YouTube. Tiene una sesión diaria en modo enfoque, tarjetas con repaso inteligente, dictados, pronunciación, temas extra (películas, cómics, música, fe cristiana y trabajo) y seguimiento de progreso.

## Estructura

| Ruta | Qué es |
|---|---|
| `plataforma/lecciones.js` | Contenido de las lecciones y los temas. Es lo único que cambia cuando se agrega una clase. |
| `plataforma/index.html` | La aplicación, en formato de artifact de claude.ai (sin `<head>` propio). |
| `netlify/` | Versión lista para publicar: `index.html` completo (con meta viewport) y una copia de `lecciones.js`. |
| `netlify.toml` | Le indica a Netlify que publique la carpeta `netlify/`. |

## Diferencias entre versiones

En claude.ai el progreso se sincroniza en la cuenta y la tarea se corrige con Claude. En Netlify el progreso se guarda en cada navegador y la tarea se copia para revisarla en el chat.
