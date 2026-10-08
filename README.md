# JL Aberturas

Demo comercial estática con Astro, TypeScript, Tailwind CSS 4 y Lucide. El hero usa una corrediza de dos hojas, ligada al scroll nativo. No hay frontend framework hidratado, backend, formularios ni trackers propios. Fotografías, fuente e iconos se sirven localmente; el mapa de Google se carga de forma diferida al acercarse a Ubicación.

## Ejecutar

Requiere Node 24.12 o posterior y pnpm 11.7.

```sh
pnpm install
pnpm dev
```

Build y vista previa:

```sh
pnpm check
pnpm build
pnpm preview
```

La salida desplegable está en `dist/`. `pnpm build` crea una **demo con `noindex,follow`**, sin sitemap. La demo está publicada en **https://jl-aberturas.vercel.app/** en el proyecto `jl-aberturas` de la cuenta de Ramiro.

## Editar

- `src/config/site.ts`: nombre, WhatsApp, teléfono visible, mensaje, dirección, cobertura, redes y metadatos. El número lleva país, sin `+`, espacios ni guiones. Todos los CTA comparten el mismo helper. La dirección genera los enlaces del mapa.
- `src/config/content.ts`: navegación, títulos, textos, categorías, imágenes, alt y pasos.
- `src/config/gallery.ts`: imágenes, captions, alt, proporciones y estado ilustrativo de la galería. Importar fotografías autorizadas desde `src/assets`, reemplazar las referencias y desactivar `illustrative` únicamente cuando toda la galería represente contenido real.
- `src/styles/global.css`: paleta, tipografía, geometría y breakpoints. La fuente es local; su archivo latino se precarga una sola vez.
- `public/og-source.svg`: composición social. Regenerar el PNG con `pnpm og` (requiere Chromium de Playwright; usa la misma fuente local del sitio).
- [ASSETS.md](ASSETS.md): fuentes, licencias y reemplazo de fotografías.

El skill `frontend-design` de Vercel está instalado en `.agents/skills/frontend-design`. Se utilizó el repositorio `vercel-labs/open-agents`, donde se verificó su ubicación.

## Hero y fallbacks

- Desktop: sección de 170svh; tablet: 150svh; mobile: 135svh. La escena sticky mide 100svh.
- La hoja se desliza del 10 al 75% del recorrido; texto y CTA aparecen del 45 al 85%.
- Solo se actualizan transforms/opacidad mediante variables CSS. El listener es pasivo y el rAF se solicita a demanda. No se interceptan wheel, touch ni teclas.
- Ancho menor a 360px, altura menor a 640px y reduced motion: composición final sin sticky ni recorrido extra.
- Sin JavaScript: la composición abierta usa altura natural mediante CSS en `noscript`.
- Si JavaScript es bloqueado o falla la inicialización, los textos y enlaces quedan visibles. No se habilitan clases que los oculten antes de inicializar.
- El foco sobre el contenido del hero lo revela inmediatamente. “Ver productos” permite saltar la escena.
- Los enlaces internos usan `scroll-behavior: smooth` nativo, sin agregar JavaScript de scroll. Reduced motion conserva desplazamiento inmediato.
- Menú mobile basado en `details`/`summary`, utilizable sin JS. Con JS, cierra al elegir un enlace o presionar Escape.

## Publicación en Vercel

El directorio quedó vinculado al proyecto `jl-aberturas` en el espacio `ramiroariel-carp-hotmailcoms-projects`. `.vercel/` y los archivos de entorno están ignorados; no compartir sus credenciales. La configuración desplegable está en `vercel.json`, y `.vercelignore` excluye auditorías e instrucciones locales del upload.

En Vercel están configuradas para Production y Preview:

- `ENABLE_EXPERIMENTAL_COREPACK=1`: utiliza `pnpm@11.7.0`, fijado por `packageManager`.
- `PUBLIC_SITE_URL=https://jl-aberturas.vercel.app`: canonical y metadatos sociales absolutos de esta demo.

Para actualizar la demo, con la cuenta conectada:

```sh
pnpm check
pnpm build
npx vercel deploy --prod --yes --scope ramiroariel-carp-hotmailcoms-projects
```

El target Production de Vercel conserva **modo demo** porque ejecuta `pnpm build`. Para publicar como sitio oficial, confirmar el dominio y los datos del negocio, actualizar `PUBLIC_SITE_URL` y cambiar el `buildCommand` de `vercel.json` a `pnpm build:production`.

## Pasar a sitio oficial

Copiar `.env.example` a `.env` y completar `PUBLIC_SITE_URL` con el origen HTTPS real (sin ruta). En una demo pública esa variable también habilita canonical y URLs sociales absolutas.

```sh
pnpm build:production
```

El build oficial requiere la URL, retira `noindex` y la identificación de demo, y genera sitemap y su referencia en robots.txt. La leyenda de **imágenes ilustrativas se mantiene** mientras se utilicen fotografías referenciales.

Pendientes de confirmar antes de publicación oficial:

- Dominio final, identidad/logo y fotografías reales autorizadas.
- Provincia/código postal si se quieren completar, horarios y correo.
- Marcas, garantías, plazos de fabricación y cualquier condición adicional que se quiera comunicar.
- Copy de proceso y contacto aprobado por el negocio.

El JSON-LD incluye nombre, actividad, teléfono, dirección confirmada, cobertura y ambas redes; también URL cuando existe. Dirección: Pastoriza 1765, Rafael Calzada. No se agregan coordenadas, código postal ni horarios sin confirmación. El mapa utiliza la dirección, sin una clave API ni coordenadas inventadas.

La galería usa columnas CSS como base y `display: grid-lanes` como mejora donde esté disponible. Las proporciones están reservadas y las imágenes son responsive y lazy. No necesita JavaScript, carrusel ni librería masonry.

## Auditorías

Con `pnpm preview` abierto en otro terminal:

```sh
pnpm exec playwright install
pnpm qa
pnpm audit:lighthouse
node qa/production.mjs
node qa/metrics.mjs
node qa/deployment.mjs
```

`pnpm qa` recorre Chromium, Firefox y WebKit, seis viewports, teclado, touch emulado, anclas, WhatsApp, datos estructurados, fallbacks y axe WCAG AA. `QA_URL` permite cambiar la URL local. `QA_BROWSERS=chromium` limita motores y `QA_CHROME_CHANNEL=chrome` usa Chrome instalado.

`pnpm audit:lighthouse` ejecuta Lighthouse tres veces por perfil mobile/desktop y guarda reportes y medianas en `qa/artifacts/` (ignorado). Requiere Chrome instalado. Las fotografías se cargan bajo demanda; los bytes iniciales y totales dependen del viewport elegido.

`qa/production.mjs` verifica el guard de dominio y genera una salida aislada con el dominio reservado `qa.invalid`, únicamente como fixture de prueba. No modifica la demo en `dist/`. No publicar ese fixture. `qa/metrics.mjs` registra tamaños comprimidos y solicitudes del sitio local.

`qa/deployment.mjs` comprueba el sitio público de Vercel sin una sesión del propietario: acceso, assets, canonical, Open Graph, márgenes del hero y crédito del footer en mobile/desktop.

Ver [QA.md](QA.md) para el resultado de esta entrega. `noindex` hace fallar deliberadamente el chequeo de indexación de Lighthouse; el canonical absoluto queda pendiente mientras no exista URL real. Las pruebas móviles son emuladas, no realizadas en teléfonos físicos.
