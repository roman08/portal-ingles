# Mi Pizarrón de Inglés

Plataforma personal para estudiar inglés con las clases de [Teacher Gaby Manzano](https://www.youtube.com/channel/UCdkMjTqjPcxqaUuYio7UIbw) en YouTube. Tiene una sesión diaria en modo enfoque, tarjetas con repaso inteligente, dictados, pronunciación, temas extra (películas, cómics, música, fe cristiana y trabajo) y seguimiento de progreso.

La guía completa para continuar el proyecto (cómo se crean las lecciones, formato del contenido y qué se ha enseñado) está en [CLAUDE.md](CLAUDE.md).

## Estructura

| Ruta | Qué es |
|---|---|
| `plataforma/lecciones.js` | Contenido de las lecciones y los temas. Es lo único que cambia cuando se agrega una clase. |
| `plataforma/index.html` | La aplicación, en formato de artifact de claude.ai (sin `<head>` propio). |
| `pwa/` | Piezas de la app instalable: cabecera HTML, manifest, service worker (modo sin internet), aviso de instalación e íconos. |
| `construir-netlify.sh` | Genera `netlify/` uniendo `plataforma/` y `pwa/`. Ejecútalo después de cada cambio: `bash construir-netlify.sh`. |
| `netlify/` | Resultado generado, listo para publicar. No se edita a mano. |
| `netlify.toml` | Le indica a Netlify que publique la carpeta `netlify/`. |

## App en el teléfono

La versión de Netlify es una app web instalable (PWA). En Android, Chrome ofrece **Instalar**; en iPhone, en Safari: **Compartir → Agregar a inicio**. Después de abrirla una vez con internet, funciona sin conexión, y con conexión descarga las lecciones nuevas.

## Diferencias entre versiones

En claude.ai el progreso se sincroniza en la cuenta y la tarea se corrige con Claude. En Netlify el progreso se guarda en cada navegador y la tarea se copia para revisarla en el chat.
