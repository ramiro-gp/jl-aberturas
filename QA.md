# Validación de la entrega

Actualización: 8 de octubre de 2026. Mediciones sobre el build estático local, con Lighthouse 13.5.0. No son mediciones de usuarios reales ni garantías para cualquier hosting.

## Build y navegación

- `pnpm check` y `pnpm build`: sin errores.
- 30 escenarios automatizados aprobados: seis tamaños y cuatro fallbacks en cada uno de Chromium 151.0.7922.34, Firefox 153.0 y WebKit 26.5.
- Viewports: 320 × 568, 360 × 640, 390 × 844, 768 × 1024, 1366 × 768 y 1920 × 1080.
- Scroll nativo, movimiento inverso, estado intermedio, teclado, foco, anclas suaves con posiciones intermedias, menú, touch emulado, enlaces WhatsApp y JSON-LD comprobados.
- Márgenes simétricos del hero comprobados en los seis viewports. Firma del footer con corazón y enlace a `https://ramita.dev`, inspeccionada en mobile y desktop.
- Catálogo de líneas/vidrios/opcionales, galería, redes, mapa lazy y datos estructurados locales comprobados. Mosquiteros encabeza los opcionales. Se omiten horarios, coordenadas y reseñas.
- Sin JavaScript, scripts bloqueados, fallo de inicialización y reduced motion: contenido y contacto accesibles. Reduced motion y JavaScript desactivado eliminan el tramo sticky adicional.
- Sin overflow horizontal. Verificado también un viewport equivalente al espacio disponible al hacer zoom al 200%.
- Axe WCAG 2/2.1 A/AA: cero infracciones en los escenarios revisados. Las capturas y la composición de las secciones también se inspeccionaron visualmente.
- Pruebas móviles emuladas; no se probó en teléfonos físicos. Las automatizaciones no sustituyen una revisión en dispositivos reales.

Resultados y capturas: [browser-results.json](qa/artifacts/browser-results.json), en `qa/artifacts/`.

## Lighthouse

Mediana de tres mediciones por perfil:

| Métrica | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 100 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO de la demo | 66 | 66 |
| LCP | 1,05 s | 0,32 s |
| CLS | 0 | 0 |
| TBT | 0 ms | 0 ms |

El único chequeo puntuado de SEO que falla es la indexación: el `noindex,follow` de la demo es intencional. Robots permite rastrear para que los buscadores puedan leer esa directiva. El build local se midió sin URL configurada; la publicación usa su URL real de Vercel para canonical y metadatos absolutos.

Una salida de producción aislada, con `qa.invalid` como dominio reservado de prueba, obtuvo **SEO 100**. Se verificaron canonical, metadatos absolutos, sitemap, robots, retiro de la identificación de demo y rechazo del build oficial cuando falta el dominio. Esta salida no se publica; `dist/` conserva el modo demo.

Lighthouse conserva una observación sin impacto en la puntuación sobre la cadena HTML → CSS; no identifica ahorro de LCP ni conexiones externas para precargar. No quedan advertencias de reflow forzado en la medición final.

Reportes: [medianas y ejecuciones](qa/artifacts/lighthouse-summary.json), reportes HTML por ejecución y [SEO de producción](qa/artifacts/production-seo.json).

## Peso

| Recurso | Tamaño |
| --- | ---: |
| HTML comprimido, incluyendo JS inline | 7,42 KB |
| JavaScript propio | 2,30 KB / 0,95 KB gzip |
| CSS | 28,77 KB / 7,19 KB gzip |
| Fuente variable latina WOFF2 | 29,29 KB |
| Assets propios en la carga inicial desktop | 128,40 KB, seis solicitudes |
| Assets propios en el recorrido completo desktop | 157,94 KB, siete solicitudes |

El recorrido se midió a 1366 × 768 con DPR 1. Los números corresponden a recursos del sitio, incluyendo fotos de productos y galería. No se solicitan recursos de Google Maps en la carga inicial; al recorrer Ubicación se registraron 36 solicitudes externas del mapa, cuyo peso queda fuera de la cifra de assets propios. Los tamaños dependen de viewport, DPR, caché y compresión del servidor. No incluye cabeceras HTTP ni la imagen social, que no se descarga al visitar la landing.

Detalle: [size-report.json](qa/artifacts/size-report.json). Los archivos de `qa/artifacts/` se generan localmente y no forman parte del sitio desplegable.

## Publicación

Demo publicada en [jl-aberturas.vercel.app](https://jl-aberturas.vercel.app/) mediante el proyecto `jl-aberturas` en la cuenta de Ramiro. Build remoto aprobado con Node 24 y pnpm 11.7.0.

Comprobación del sitio público con contextos anónimos a 1366 × 768 y 390 × 844: HTTP 200 sin login, imágenes/fuente cargadas, sin errores de página ni respuestas 4xx, márgenes simétricos, scroll suave nativo, firma del footer y metadatos absolutos correctos. Se mantiene `noindex,follow` y modo demo. Resultado: [deployment-results.json](qa/artifacts/deployment-results.json).

Para repetir esta comprobación: `node qa/deployment.mjs`. `QA_URL` permite indicar otra URL publicada.

## Pendientes para el sitio oficial

Completar el dominio oficial y aprobar los textos con el negocio. Identidad y fotos propias siguen pendientes; también horarios, correo y cualquier detalle técnico/comercial adicional que se quiera mencionar. La dirección, localidad, cobertura y redes ya fueron proporcionadas e incorporadas. No se inventan garantías, estadísticas ni reseñas.

El JSON-LD incorpora PostalAddress, areaServed y sameAs con los datos visibles confirmados. El score técnico de SEO no garantiza resultados enriquecidos, posiciones ni indexación.

Instrucciones de ejecución y edición: [README.md](README.md). Fuentes y licencias: [ASSETS.md](ASSETS.md).
