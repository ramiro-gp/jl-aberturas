# Validación de la preparación oficial

Actualización: 8 de octubre de 2026. Lighthouse 13.5.0 sobre los builds estáticos locales, con compresión de texto. Las cifras son mediciones de laboratorio; Hostinger y los datos de usuarios reales todavía no se pueden medir.

## Build y separación de ambientes

- `pnpm check`: 35 archivos, cero errores, advertencias o hints.
- `pnpm build`: demo en `dist/`, `noindex,follow`, sin sitemap e identificada como demo.
- `pnpm build:hostinger`: oficial en `release/hostinger/`, indexable, sin identificación de demo. Canonical, Open Graph, entidad y sitemap usan `https://jlaberturas.com.ar`.
- `node qa/production.mjs`: aprobado. Verifica origen oficial, logos, datos estructurados, robots, sitemap, página 404 y separación de la demo.
- ZIP verificado: **79 archivos, 3.47 MB**, con `index.html` en la raíz, `.htaccess` y `_astro/.htaccess`. No contiene fuentes, dependencias, credenciales ni archivos de desarrollo.
- Página 404 personalizada: respuesta HTTP 404 comprobada con el servidor local; sin canonical, entidad empresarial ni JavaScript de la landing. Excluida del sitemap.

Las reglas de Hostinger preparan HTTPS sin `www`, revalidación del HTML, caché de un año para assets versionados y respuesta 404. El servidor local **no ejecuta `.htaccess`**: redirecciones, certificado y cabeceras deben comprobarse otra vez después de subir el ZIP al alojamiento real.

## Responsive, accesibilidad e interacción

- **30 escenarios oficiales aprobados**: seis viewports y cuatro fallbacks por motor, en Chromium 151.0.7922.34, Firefox 153.0 y WebKit 26.5.
- **10 escenarios de demo aprobados** en Chromium: los mismos tamaños y fallbacks.
- Viewports: 320 × 568, 360 × 640, 390 × 844, 768 × 1024, 1366 × 768 y 1920 × 1080.
- En mobile/tablet, descripción y presupuesto visibles y utilizables desde el inicio, antes de la ventana. La apertura revela la marca dentro de la mitad libre.
- Scroll nativo, estados cerrado/intermedio/abierto, movimiento inverso, teclado, foco, anclas suaves, menú mobile y touch emulado comprobados.
- Sin JavaScript, módulo bloqueado, fallo de inicialización y reduced motion: información y contacto accesibles. Sin JavaScript y reduced motion muestran la ventana abierta y eliminan el recorrido extra.
- Sin overflow horizontal. Verificado también un viewport equivalente al espacio disponible al hacer zoom al 200%.
- Cuatro preguntas en `details`/`summary`, operables con teclado, con respuestas presentes en el HTML.
- Cinco categorías de productos y cinco fotografías de galería, dimensiones reservadas, carga responsive y lazy. Aclaraciones de imágenes ilustrativas conservadas.
- Todos los destinos WhatsApp coinciden y sus cinco ubicaciones están identificadas para medición futura.
- Dirección, cobertura, redes y perfil de Google coinciden con los datos confirmados. No se agregan horarios, geo ni reseñas.
- Axe WCAG 2/2.1 A/AA: cero infracciones en los escenarios revisados. Hero abierto/cerrado, tablet e imagen social inspeccionados visualmente.

Pruebas móviles emuladas; no realizadas en teléfonos físicos. Axe y la emulación no sustituyen una revisión manual en dispositivos reales.

Resultados: [oficial](qa/artifacts/browser-results-official.json), [demo](qa/artifacts/browser-results-demo.json). Capturas en `qa/artifacts/`.

## Lighthouse

Mediana de tres ejecuciones por perfil y por build:

| Categoría | Oficial mobile | Oficial desktop | Demo mobile | Demo desktop |
| --- | ---: | ---: | ---: | ---: |
| Performance | 100 | 100 | 100 | 100 |
| Accessibility | 100 | 100 | 100 | 100 |
| Best Practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 69 | 69 |

En el oficial, LCP mediano de **1.35 s mobile / 0.34 s desktop**, CLS **0** y TBT **0 ms**. En la demo, LCP de 1.20 s / 0.34 s, CLS 0 y TBT 0 ms. TBT es una métrica de laboratorio; no reemplaza INP ni una medición de Core Web Vitals con visitantes reales.

El único chequeo puntuado que falla en la demo es la indexación, por `noindex,follow` intencional. Robots permite rastrear para que los buscadores lean esa directiva. El oficial permite indexación y publica su sitemap.

Permanece una observación sin impacto en la puntuación sobre la cadena HTML → CSS. No quedan chequeos puntuados pendientes en el oficial. Los 100 técnicos no garantizan posiciones, resultados enriquecidos ni recomendaciones de sistemas de IA.

Reportes HTML/JSON y medianas: [oficial](qa/artifacts/official/lighthouse-summary.json), [demo](qa/artifacts/demo/lighthouse-summary.json).

## Peso y servicios externos

Medición oficial a 1366 × 768, DPR 1, caché vacía:

| Recurso | Tamaño |
| --- | ---: |
| HTML gzip, incluyendo JS inline | 9.22 KB |
| JavaScript propio | 3.35 KB / 1.40 KB gzip |
| CSS | 32.93 KB / 7.92 KB gzip |
| Fuente variable latina WOFF2 | 29.29 KB |
| Recursos propios en la carga inicial | 254.10 KB, nueve solicitudes |
| Recursos propios en el recorrido completo | 289.83 KB, once solicitudes |

El navegador puede anticipar imágenes lazy cercanas al viewport; la carga inicial incluye esas solicitudes. Los bytes varían con viewport, DPR, caché y servidor. No incluyen cabeceras HTTP, imagen social ni tráfico externo de Google Maps.

Google Maps no se solicitó al cargar inicialmente; al recorrer Ubicación se registraron 36 solicitudes externas. **Analytics y Ads no descargaron etiquetas ni enviaron eventos**, con la configuración desactivada. `whatsapp_click` queda preparado como señal de clic, no como confirmación de consulta o venta.

Detalle: [size-report-official.json](qa/artifacts/size-report-official.json). Los reportes de QA están ignorados por Git y no se incluyen en el ZIP ni en Vercel.

## Demo publicada

Actualizada en [jl-aberturas.vercel.app](https://jl-aberturas.vercel.app/) mediante la cuenta conectada de Ramiro. Build remoto aprobado con Node 24 y pnpm 11.7.0.

Comprobación posterior a la publicación con contextos anónimos a 1366 × 768 y 390 × 844: HTTP 200 sin login, imágenes y fuente cargadas, sin errores de página ni respuestas 4xx, CTA mobile inicial, cuatro preguntas, perfil de Google, galería, márgenes simétricos, scroll suave, crédito del footer y metadatos correctos. Conserva `noindex,follow`.

Resultado: [deployment-results.json](qa/artifacts/deployment-results.json). Repetir con `node qa/deployment.mjs`.

## Pendientes externos para publicar el oficial

1. Aprobación del dominio, acceso a Hostinger, DNS y certificado HTTPS para dominio y `www`.
2. Fotografías reales autorizadas: reemplazar referencias y sus alt/captions; retirar las leyendas únicamente cuando corresponda.
3. Horarios y cualquier dato o condición comercial adicional que el negocio confirme. Logo, dirección, cobertura y perfil de Google ya están incorporados.
4. Verificación de Search Console, envío del sitemap e inspección de URL tras publicar. Revisar las opciones de inclusión en funciones generativas y vincular la web desde el perfil de Google existente.
5. Cuentas y conversiones de medición si se decide activarlas; configuración y privacidad deben revisarse antes. La administración del perfil de Google queda como servicio separado.
6. Repetir la comprobación de redirecciones, caché, 404 y Lighthouse en el dominio oficial sobre Hostinger; después observar métricas reales cuando haya tráfico.

Instrucciones de entrega y edición: [README.md](README.md). Fuentes y licencias: [ASSETS.md](ASSETS.md).
