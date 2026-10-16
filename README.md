# JL Aberturas

Landing estática con Astro, TypeScript, Tailwind CSS 4 y Lucide, preparada para **https://jlaberturas.com.ar en Hostinger**. Vercel se usa exclusivamente como demo con `noindex`. El hero usa una corrediza ligada al scroll nativo. No hay framework hidratado, backend, formularios ni etiquetas de medición activas. Fotografías, fuente e iconos se sirven localmente; Google Maps se carga al acercarse a Ubicación.

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

- `src/config/site.ts`: nombre, WhatsApp, teléfono visible, mensaje, dirección, cobertura, redes, perfil de Google y metadatos. El número lleva país, sin `+`, espacios ni guiones. Todos los CTA comparten el mismo helper. La dirección genera los enlaces del mapa.
- `src/config/origins.mjs`: origen oficial y origen demo. El build oficial usa siempre el dominio aprobado, aunque el entorno de Vercel tenga otra URL. `PUBLIC_SITE_URL` solo modifica la URL de la demo.
- `src/config/measurement.ts`: IDs públicos de GA4 y Ads, y activación. Mantener `enabled: false` hasta configurar cuentas, conversiones y revisar privacidad/consentimiento. Los CTA identifican `header`, `menu`, `hero`, `products`, `options`, `contact` y `footer`.
- `src/config/content.ts`: navegación, títulos, textos, categorías, vistas de producto, alt y pasos. Cuatro categorías principales y un bloque independiente de techos. Ventanas admite dos vistas (de abrir/ventiluz), con selector manual y ambas fotografías disponibles sin JavaScript. Cada vidrio tiene nombre, descripción, detalle y una clave para su esquema SVG.
- `src/config/gallery.ts`: tres ambientes generados con IA a partir de referencias del cliente: estar con corrediza, acceso con puerta y baño con mampara. Imágenes, captions, alt, proporciones y estado ilustrativo. Mantener la leyenda de IA; desactivar `illustrative` únicamente cuando toda la galería represente fotografías reales autorizadas.
- `src/styles/global.css`: paleta, tipografía, geometría y breakpoints. La fuente es local; su archivo latino se precarga una sola vez.
- `scripts/og-source.svg`: composición social con logo oficial. `pnpm og` optimiza favicons/logo y regenera `public/og.png` con la fuente local (requiere Chromium de Playwright). Estos assets ya están versionados.
- [ASSETS.md](ASSETS.md): fuentes, licencias y reemplazo de fotografías.

El skill `frontend-design` de Vercel está instalado en `.agents/skills/frontend-design`. Se utilizó el repositorio `vercel-labs/open-agents`, donde se verificó su ubicación.

## Hero y fallbacks

- Desktop: sección de 170svh; tablet: 150svh; mobile: 135svh. La escena sticky mide 100svh cuando hay espacio suficiente.
- La hoja se desliza del 10 al 75% del recorrido. En desktop, texto y CTA aparecen del 45 al 85%. En mobile/tablet la descripción y “Pedir presupuesto” están antes de la ventana, visibles desde el primer render. La apertura revela “JL Aberturas” dentro del vano libre.
- Solo se actualizan transforms/opacidad mediante variables CSS. El listener es pasivo y el rAF se solicita a demanda. No se interceptan wheel, touch ni teclas.
- Ancho menor a 360px, altura menor a 640px, o mobile/tablet con altura menor a 740px: composición final sin sticky ni recorrido extra. Reduced motion también usa altura natural.
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

El target Production de Vercel conserva **modo demo** porque ejecuta `pnpm build`. No convertir este proyecto de Vercel en el alojamiento comercial del cliente. `release/`, auditorías, fuentes de configuración de Hostinger y secretos quedan excluidos del upload.

## Pasar a sitio oficial

El dominio oficial está definido en `src/config/origins.mjs`. La inscripción está en trámite; publicar únicamente cuando el dominio, DNS y SSL estén operativos.

```sh
pnpm check
pnpm build:hostinger
```

La salida oficial se genera en `release/hostinger/` y el paquete en **`release/jl-aberturas-hostinger.zip`**. `dist/` sigue siendo la demo. La salida retira `noindex` y la identificación de demo, genera canonical/metadatos para `https://jlaberturas.com.ar`, sitemap y robots. La leyenda de **imágenes ilustrativas se mantiene** mientras se utilicen fotografías referenciales.

El ZIP contiene archivos directamente en su raíz, incluidos `.htaccess` y `_astro/.htaccess`. En Windows se comprime con .NET/PowerShell; Linux/macOS requieren `zip`. No se suben fuentes, `node_modules`, archivos `.env` ni herramientas de desarrollo. `pnpm build:production` es una alternativa sin ZIP que genera `release/production/`, también aislada.

### Publicar en Hostinger

1. Usar un sitio vacío en Hostinger Web/Cloud con acceso a `public_html`. Astro no requiere Node en el servidor.
2. Configurar el dominio y `www` con los valores de DNS provistos por el plan de Hostinger, sin inventar IPs ni nameservers. Verificar SSL para ambos nombres.
3. Respaldar el contenido existente de `public_html`, si lo hay, y subir/extraer el ZIP allí. `index.html`, `.htaccess` y `_astro/` deben quedar directamente dentro de `public_html`.
4. Las reglas generadas redirigen HTTP y `www` hacia `https://jlaberturas.com.ar`, conservan rutas, comprimen texto, revalidan HTML y dan un año de caché a assets con hash. No hay reescritura SPA: rutas inexistentes responden 404 con `/404.html`.
5. Revisar en el alojamiento real redirecciones, certificado, cabeceras, 404, recursos y WhatsApp. El servidor local de QA no ejecuta `.htaccess`.
6. Verificar propiedad en Search Console, enviar `/sitemap-index.xml`, inspeccionar la URL e informar la web en el perfil de Google existente. Revisar inclusión en las funciones generativas y, cuando haya datos, informes de búsqueda. Bing Webmaster Tools puede complementar el seguimiento.

Referencia: [File Manager de Hostinger](https://www.hostinger.com/support/4548688-basic-actions-in-the-file-manager-in-hostinger/).

Pendientes de confirmar antes de publicación oficial:

- Aprobación del dominio, DNS/SSL y acceso al alojamiento. El dominio y el logo ya están definidos.
- Fotografías reales autorizadas; actualizar productos y galería sin presentar referencias como trabajos propios.
- Provincia/código postal si se quieren completar, horarios y correo.
- Marcas, garantías, plazos de fabricación y cualquier condición adicional que se quiera comunicar.
- Copy de proceso y contacto aprobado por el negocio.

El JSON-LD incluye entidad, nombre, actividad, teléfono, dirección confirmada, cobertura, logo, URL, ambas redes y el perfil de Google que el cliente identificó como propio (actualmente llamado “Aberturas”). No se agregan coordenadas, código postal, horarios ni reseñas sin confirmación. El mapa conserva Pastoriza 1765, Rafael Calzada. La administración del perfil es un servicio separado.

El contenido comercial y las respuestas útiles están en HTML estático, con headings descriptivos y una identidad empresarial consistente. Esta preparación sigue las [recomendaciones de Google para funciones generativas](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): contenido útil, acceso al rastreo y una base técnica clara. No se necesita un archivo especial para IA; la indexación y la aparición en respuestas se revisarán después de publicar, sin garantizar posiciones.

### Medición preparada, desactivada

`whatsapp_click` representa el clic y registra únicamente `cta_location`; no recoge mensajes, teléfonos de visitantes ni datos personales. La navegación nativa sigue inmediata. El adaptador permite GA4 y/o una conversión de Google Ads al disponer de IDs y etiquetas válidos. No marcar ese evento como venta ni asumir que confirma una conversación. Validar la medición, consentimiento y privacidad antes de activar. Las consultas efectivas y ventas requieren seguimiento comercial posterior.

La configuración actual no descarga Google tag ni envía eventos. No se han creado cuentas ni campañas de Ads. Google Maps sigue siendo el servicio externo del mapa, independiente de esa configuración.

#### Activación y conversiones sin duplicados

1. Obtener los IDs públicos reales y revisar la información de privacidad y el consentimiento antes de habilitar la configuración. No poner tokens o credenciales en el sitio.
2. Si se completa el ID y la etiqueta de Ads, el adaptador envía una conversión directa de Ads por clic. El evento de GA4 puede usarse para analizar las ubicaciones de los botones. **No importar también ese mismo clic de GA4 como una segunda conversión principal de Ads.**
3. Si se elige importar el evento desde GA4, dejar vacíos el ID y la etiqueta de conversión directa de Ads. Definir una única ruta principal de conversión en las cuentas.
4. Validar con Tag Assistant, DebugView y los diagnósticos de Ads: clics sobre texto/icono, todas las ubicaciones, red lenta y salida a WhatsApp. Un clic es intención; el registro de consultas recibidas y ventas se lleva por separado.

`initMeasurement(config)` admite una configuración tipada para pruebas y solo se inicializa una vez por documento. Sin IDs válidos no descarga la etiqueta. La navegación a WhatsApp conserva su comportamiento nativo e inmediato, incluso si la etiqueta tarda o se bloquea. Por eso un clic temprano puede quedar en la cola y perderse al abandonar la página antes de que cargue la etiqueta; las pruebas simuladas no garantizan recepción en Google ni sustituyen la validación con cuentas reales.

`pnpm qa:measurement` compila el módulo real y ejecuta 12 escenarios aislados. La etiqueta y el destino de WhatsApp son simulados: no se envían datos a Google ni mensajes. Los casos comprueban desactivación, validación de IDs, GA4, Ads, ambos adaptadores, icono SVG, inicialización repetida, carga lenta, etiqueta bloqueada y enlaces sin una ubicación admitida.

Los textos orientativos de líneas y vidrios se basan en [Aluar](https://soluciones-arquitectura.aluar.com.ar/nuestros-productos/aberturas) y [VASA](https://www.vasa.com.ar/asesoramiento/informacion-tecnica/). Float, DVH, laminado y templado tienen esquemas SVG propios y textos HTML; un DVH puede incorporar laminado o templado. No implican que JL sea distribuidor certificado ni que utilice una marca de vidrio determinada; no se publican espesores, prestaciones o garantías sin confirmación.

Los originales del cliente y los prompts de imagegen están separados en `references/`; no se sirven públicamente. Los derivados activos están en `src/assets/catalog/` y `src/assets/gallery/`. La procedencia y autorización de las referencias de Google siguen pendientes de acreditar; ver `ASSETS.md`.

La galería usa columnas CSS como base y `display: grid-lanes` como mejora donde esté disponible. Las proporciones están reservadas y las imágenes son responsive y lazy. No necesita JavaScript, carrusel ni librería masonry.

## Auditorías

Con `pnpm preview` abierto en otro terminal:

```sh
pnpm exec playwright install
pnpm qa
pnpm qa:images
pnpm qa:measurement
pnpm audit:lighthouse
node qa/production.mjs
node qa/metrics.mjs
node qa/deployment.mjs
```

`pnpm qa` recorre Chromium, Firefox y WebKit, seis viewports, teclado, touch emulado, anclas, WhatsApp, datos estructurados, fallbacks y axe WCAG AA. `QA_URL` permite cambiar la URL local. `QA_BROWSERS=chromium` limita motores y `QA_CHROME_CHANNEL=chrome` usa Chrome instalado.

`pnpm qa:images` comprueba la carga de las fotografías y la estabilidad del selector, que la tarjeta de corredizas cabe bajo el header, y guarda capturas de catálogo, vidrios, techos y galería a 390, 1366 y 1920 px. Las capturas de viewport incluyen el header real; las capturas por sección ocultan solo los overlays fijos para facilitar la revisión visual.

`pnpm audit:lighthouse` ejecuta Lighthouse tres veces por perfil mobile/desktop y guarda reportes y medianas en `qa/artifacts/` (ignorado). Requiere Chrome instalado. Las fotografías se cargan bajo demanda; los bytes iniciales y totales dependen del viewport elegido.

`qa/production.mjs` verifica el paquete de Hostinger ya generado: dominio oficial, separación de demo, entidad, logos, sitemap, robots, 404 y contenido del ZIP. `qa/metrics.mjs` registra tamaños comprimidos y solicitudes del sitio local.

Para probar los builds separados, ejecutar en terminales distintas:

```sh
node qa/serve.mjs dist 4331
node qa/serve.mjs release/hostinger 4332
```

Configurar `QA_URL=http://127.0.0.1:4332/` y `QA_MODE=production` para el oficial, o `QA_URL=http://127.0.0.1:4331/` y `QA_MODE=demo` para la demo. Los reportes Lighthouse se guardan separados en `qa/artifacts/official/` y `qa/artifacts/demo/`. Las pruebas incluyen CTA visible desde el inicio, marca en el vano, preguntas accesibles y etiquetas desactivadas.

`qa/deployment.mjs` comprueba el sitio público de Vercel sin una sesión del propietario: acceso, assets, canonical, Open Graph, márgenes del hero, CTA de productos/líneas, teléfono clicable, cinco preguntas, tres referencias y crédito del footer en mobile/desktop.

Ver [QA.md](QA.md) para los resultados. `noindex` hace fallar deliberadamente el chequeo SEO de la demo; el oficial tiene canonical absoluto y permite indexación. Las pruebas móviles son emuladas, no realizadas en teléfonos físicos.

## Repositorio y respaldo

El código y su historial se conservan en [ramiro-gp/jl-aberturas](https://github.com/ramiro-gp/jl-aberturas), en la rama `main`. `origin` usa `https://github.com/ramiro-gp/jl-aberturas.git`. Para trabajar desde otra computadora, clonar el repositorio e instalar con `pnpm install --frozen-lockfile`.

Git excluye `.env`/`.env.local`, `.vercel`, dependencias, builds, ZIP y reportes de QA. `.env.example` contiene únicamente configuración pública de ejemplo. Guardar las credenciales de despliegue por separado y generar de nuevo el ZIP con `pnpm build:hostinger`. La demo se actualiza en el proyecto Vercel existente; no se asume un despliegue automático por cada push a GitHub.
