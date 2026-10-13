# Mi Pizarrón de Inglés: guía del proyecto para Claude

Plataforma personal para que el usuario (Roman, hispanohablante, principiante) estudie inglés con las clases de **Teacher Gaby Manzano** en YouTube. Es una app web instalable (PWA) publicada en **Netlify** que usa en su teléfono, casi siempre **sin conexión**. Habla con el usuario en español.

## Cómo trabaja el usuario

- Ve un video y **pega la transcripción automática de YouTube** en el chat («video N: …»). Tú la conviertes en una lección nueva.
- **No descargues ni proceses videos** (se probó y consume demasiados recursos). **No pidas ni incluyas el link del video**: la app se usa sin internet.
- La transcripción viene llena de errores («ay» = *I*, «juez» = *where*). Reconstruye el contenido por contexto. Si falta algo (lo que estaba escrito en el pizarrón), **complétalo con contenido parecido y avisa qué partes reconstruiste**; el usuario aprobó ese método. Solo si es indispensable, pide una captura del pizarrón.
- La tarea la copia desde la app y la pega en el chat: corrígela oración por oración, en español, con la corrección y una explicación sencilla con ejemplo.

### Perfil de aprendizaje (diseña todo para esto)

Principiante; quiere inglés para trabajo, series/música y superación personal. Le cuesta **memorizar vocabulario, pronunciar y entender cuando le hablan**. Estudia 15–20 min al día en ratos libres. Aprende **viendo** (tablas, colores). Quiere **explicaciones detalladas con muchos ejemplos**, una pista antes de la respuesta, ejercicio después de cada tema y gamificación. **Se distrae fácilmente**: todo debe ser claro y enfocado. Temas de interés: películas, cómics, música, **fe cristiana** y trabajo.

## Estructura

```
plataforma/index.html   App (HTML+CSS+JS sin dependencias). Sin <head>: el script de build lo agrega.
plataforma/lecciones.js CONTENIDO: window.LECCIONES y window.TEMAS. Es lo que se edita con cada clase.
pwa/                    cabecera.html, manifest.webmanifest, sw.js (offline), pwa.js (aviso instalar), icons/
construir-netlify.sh    Genera netlify/ = cabecera + index.html + pwa.js; copia lecciones.js, manifest e íconos;
                        pone una versión nueva (fecha) en sw.js para que el teléfono descargue la actualización.
netlify/                GENERADA. Nunca editar a mano.
netlify.toml            Netlify publica netlify/ (sin build).
```

Si renombras un archivo, actualiza todas sus referencias: `lecciones.js` aparece en `plataforma/index.html`, `pwa/sw.js` (lista `BASE`), `construir-netlify.sh` y `netlify.toml`.

## Flujo para agregar una lección

1. Lee la transcripción completa e identifica: repaso, reglas, vocabulario, ejemplos del pizarrón, anécdotas/trucos de la maestra y la tarea.
2. Revisa en este archivo («Lo que ya se enseñó») qué gramática conoce el estudiante. **Los ejemplos y ejercicios solo usan gramática ya vista**; una palabra nueva suelta está bien si se traduce.
3. En `plataforma/lecciones.js`, agrega el objeto de la lección **al final de `window.LECCIONES`** (antes de `];`).
4. En `window.TEMAS`, agrega a **cada uno de los 5 temas** una parte nueva en `mas` con `desdeLeccion: N` (4 frases + 2 ejercicios, opcional `nota`, `vocabulario` o `dialogo`).
5. Si la lección usa un `tag` nuevo, agrégalo al objeto `TAGS` de `plataforma/index.html`. Si aparecen contracciones nuevas que el usuario podría escribir, amplía la función `norm()`.
6. Verifica que no haya ids de ejercicio repetidos:
   `grep -oE 'tipo: "[a-z]+", id: "[^"]+"' plataforma/lecciones.js | sed 's/.*id: //' | sort | uniq -d` (debe salir vacío).
7. Ejecuta `bash construir-netlify.sh`, luego haz commit y push a `main` (abajo). Netlify se actualiza solo.
8. Actualiza la sección «Lo que ya se enseñó» de este archivo.
9. Responde al usuario: tabla con los pasos, qué hay de nuevo en tarea y temas, y una lista de **lo que completaste tú**.

## Esquema de una lección

```js
{
  id: "l5", numero: 5, titulo: "…", maestra: "Teacher Gaby Manzano",
  resumen: "Una oración con todo lo que se ve.",
  pasos: [                                   // 4 o 5 pasos; cada uno = teoría + 4 a 7 ejercicios
    { id: "l5p1", titulo: "…", emoji: "🔑",
      teoria: [ /* bloques, ver abajo */ ],
      ejercicios: [ /* ver abajo */ ] },
  ],
  vocabulario: [                             // todas las palabras nuevas de la clase
    { id: "last-name", en: "last name", es: "apellido", pron: "last néim", emoji: "👪",
      ej: "My last name {v|is} García.", ejEs: "Mi apellido es García." },
  ],
  escuchar: {
    dictado:    [{ en: "How old are you?", es: "¿Cuántos años tienes?" }],                 // ~9, sin números en cifra
    pronunciar: [{ en: "{w|How} old {v|are} {p|you}?", pron: "jau ould ar iu", es: "…" }], // ~6-8
    dialogo: { titulo: "…", lineas: [{ quien: "Ana", en: "…", es: "…" }],
               nuevas: [{ en: "May", es: "mayo" }],                     // palabras del diálogo no vistas
               preguntas: [ /* ejercicios tipo opcion, tag "escucha", ids l5d1, l5d2 */ ] },
  },
  tarea: {
    instrucciones: "La tarea de la maestra: …",   // markdown simple
    criterios: "Qué revisar al corregirla.",
    ejemplo: ["Línea 1", "Línea 2"],
    filas: ["Renglón 1", "…"],                    // un renglón por oración o pregunta
    columnas: [{ k: "af", nombre: "Afirmativa", ph: "placeholder" }],   // 1 o 2 columnas
  },
}
```

### Bloques de teoría

| `t` | Uso | Campos |
|---|---|---|
| `p` | Párrafo | `x` |
| `regla` | Regla en recuadro (fórmula) | `x` |
| `tabla` | Tabla | `cab: [...]`, `filas: [[...], ...]` |
| `ejemplos` | Oraciones con audio | `items: [{ en, es }]` |
| `tip` | Consejo (💡) | `x` |
| `extra` | Contenido que **no** dio la maestra y agregaste tú | `x` |

### Tipos de ejercicio (todos llevan `id`, `tag`, `pregunta`, `pista`, `explicacion`)

| `tipo` | Campos propios | Nota |
|---|---|---|
| `opcion` | `opciones: [...]`, `correcta: índice` | |
| `escribir` | `respuestas: ["en minúsculas sin puntuación", …]`, `mostrar: "Forma bonita."` | La comparación ignora mayúsculas, acentos y puntuación y expande contracciones (`norm()`), así que basta una variante por forma. Pon `mostrar` siempre que la respuesta tenga varias palabras o nombres propios. |
| `ordenar` | `palabras: ["He", "is", "a", "baker"]` en el orden correcto | Se pueden agrupar palabras: `"My brother"`, `"teacher?"`. |

`pista` se muestra tras el primer error; `explicacion`, tras acertar o tras el segundo error. Ambas en español, cortas y con el ejemplo correcto.

### Marcado de texto (colores del pizarrón)

`{p|She}` pronombre (azul) · `{v|is}` verbo to be (verde) · `{n|not}` negación (rojo) · `{w|nurse}` palabra nueva/clave (resaltador) · `**negritas**` · `*cursiva*`. Úsalo en teoría, ejemplos, vocabulario (`ej`), pronunciación, diálogos y frases de temas. Con contracciones: `{p|I}'{v|m}`, `{v|is}{n|n't}`, `{w|What}'{v|s}`. Las palabras Wh- van con `{w|…}`.

## Nomenclatura y progreso (no romper)

| Qué | Formato | Ejemplo |
|---|---|---|
| Lección / paso | `l<N>` / `l<N>p<M>` | `l4`, `l4p2` |
| Ejercicio de lección | `l<N>e<NN>`, consecutivo en toda la lección | `l4e05` |
| Pregunta de diálogo | `l<N>d<K>` | `l4d1` |
| Vocabulario | palabra en inglés, minúsculas, guiones | `police-officer` |
| Temas | `peliculas`, `comics`, `musica`, `fe`, `trabajo` | |
| Ejercicio de tema | `t` + `pe`/`co`/`mu`/`fe`/`tr` + número consecutivo del tema | `tpe9`, `tfe10` |
| Tags | `pronombres`, `to-be`, `afirmativas`, `negativas`, `a-an`, `preguntas`, `adjetivos`, `wh`, `vocabulario`, `escucha` | |

El progreso vive en `localStorage` (`pizarron-ingles-v1`) con claves derivadas de los ids: `v:l1:cat`, `v:t:fe:faithful`, `e:l4e05`, ids de paso, `peliculas:4` (tema con 4 partes abiertas) y respuestas de tarea `fila-columna` (`0-af`). **Nunca cambies ni reutilices un id existente**: el usuario perdería ese progreso. Los textos sí se pueden cambiar.

## Reglas de contenido

- Explicaciones en español mexicano, sencillas, con muchos ejemplos. Conserva las anécdotas y trucos de la maestra (son lo que hace memorable la clase) y atribúyelos («la maestra dijo…»).
- Pronunciación aproximada con ortografía española y acento marcado: `féimos`, `juat`, `tícher`.
- Lo que agregues por tu cuenta va en bloques `extra` o se menciona como complemento.
- Temas: solo gramática ya vista. **Fe cristiana**: versículos reales con su cita (libro capítulo:versículo) y traducción respetuosa. Personajes de ficción, sí; **no atribuyas rasgos de personalidad a personas reales** (decir que alguien es famoso o cantante está bien).
- Sin letras de canciones (derechos de autor): solo títulos o frases propias.
- Sin links a videos.

## Publicar

```bash
bash construir-netlify.sh
git add -A
git commit -m "Lección N: …"     # cuerpo con viñetas; termina con la línea Co-Authored-By de Claude
git push origin main
```

- Repositorio: https://github.com/roman08/portal-ingles (rama `main`). Netlify está conectado y publica en cada push.
- Los commits van con el correo personal **rmcentinela@gmail.com** (en este repo: `git config user.email "rmcentinela@gmail.com"`; nunca el correo del trabajo). Nombre: Roman Madrigal.
- Si `git push` abre la ventana de inicio de sesión de GitHub y falla, pídele al usuario que inicie sesión con la cuenta **roman08**.
- Ya **no** existe versión en claude.ai (se borró a petición del usuario): no publiques artifacts de la plataforma.
- No hay forma de probar en un navegador desde la terminal: revisa con cuidado la sintaxis de `lecciones.js` (comillas, comas, llaves) antes de publicar.

## Lo que ya se enseñó

| # | Título | Gramática | Vocabulario principal | Tarea |
|---|---|---|---|---|
| 1 | Pronombres personales y el verbo To Be | Sujeto + verbo + complemento; I, you, he, she, it, we, you, they; am/is/are (ser y estar); afirmativas; negativas con **not** después del verbo | class, school, student, brother, father, friend, my, park, nurse, doctor, hospital, cat, black, white, architect, house, office | Afirmativa + negativa por pronombre |
| 2 | A / An, profesiones y preguntas con To Be | Cognados; **a** (consonante) / **an** (vocal), sin artículo en plural; preguntas con el verbo al principio y ? solo al final; respuestas cortas (Yes, he is / No, he is not); con *you* se contesta *I am* o *we are* | bank, octopus, umbrella, 24 profesiones (accountant … waiter/waitress, writer), artist, yes, no | Convertir 8 oraciones en pregunta + respuesta corta |
| 3 | Repaso y palabras para describir personas | Contracciones (I'm, he's, we're, isn't, aren't); **sin contracción en el «sí» corto**; *Are you students? → Yes, we are*; adjetivos invariables (sin género ni plural); **very** + adjetivo; cognados verdaderos y falsos (confident ≠ confidente); -oso → -ous; his/her | loyal, fun, popular, social, considerate, famous, shy, introverted, extroverted, confident, very, mother, his, her | Párrafo de 8 renglones sobre un actor o actriz |
| 4 | Preguntas Wh- | Yes/no questions vs. Wh- questions; what, when, where, who, how (how + verbo = cómo; how + adjetivo = qué tan); what's/when's/who's; respuestas cortas vs. largas; first/middle/last name; direcciones (número + calle + Street); edad con *years old*; *It's on* + mes + ordinal (1st, 2nd, 3rd, 26th); Mr./Mrs./Miss | what, when, where, who, how, name, first/middle/last name, address, street, birthday, fine, old, years, big, your, February, Mr., Mrs., Miss (más los 12 meses como extra) | Responder las 7 preguntas tú y un familiar |

Todavía **no** se han visto: números cardinales como tema, verbos distintos de *to be*, presente simple (do/does), posesivos con 's, plurales irregulares, preposiciones más allá de in/on/to.
