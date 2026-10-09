# Validación de la preparación oficial

Actualización: 8 de octubre de 2026. Lighthouse 13.5.0 sobre los builds estáticos locales, con compresión de texto. Las cifras son mediciones de laboratorio; Hostinger y los datos de usuarios reales todavía no se pueden medir.

## Build y separación de ambientes

- `pnpm check`: 36 archivos, cero errores, advertencias o hints.
- `pnpm build`: demo en `dist/`, `noindex,follow`, sin sitemap e identificada como demo.
- `pnpm build:hostinger`: oficial en `release/hostinger/`, indexable, sin identificación de demo. Canonical, Open Graph, entidad y sitemap usan `https://jlaberturas.com.ar`.
- `node qa/production.mjs`: aprobado. Verifica origen oficial, logos, datos estructurados, robots, sitemap, página 404 y separación de la demo.
- ZIP verificado: **70 archivos, 3.18 MB**, con `index.html` en la raíz, `.htaccess` y `_astro/.htaccess`. No contiene fuentes, dependencias, credenciales ni archivos de desarrollo.
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
- Cinco preguntas en `details`/`summary`, incluida la evaluación del marco para recambio sin obra, operables con teclado y presentes en el HTML.
- Cinco categorías de productos y tres fotografías de galería, dimensiones reservadas, carga responsive y lazy. Aclaraciones de imágenes ilustrativas conservadas.
- Todos los destinos WhatsApp coinciden y sus siete ubicaciones están identificadas para medición futura. Los dos CTA nuevos están después de categorías y de líneas/vidrios.
- Aluminio en presentación y metadatos, diferencias entre Módena/A30 NEW, explicaciones de float/DVH/laminado y enlace telefónico comprobados. Nuevas secciones e imagen social inspeccionadas visualmente.
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

En el oficial, LCP mediano de **1.28 s mobile / 0.34 s desktop**, CLS **0** y TBT **0 ms**. En la demo, LCP de 1.28 s / 0.34 s, CLS 0 y TBT 0 ms. TBT es una métrica de laboratorio; no reemplaza INP ni una medición de Core Web Vitals con visitantes reales.

El único chequeo puntuado que falla en la demo es la indexación, por `noindex,follow` intencional. Robots permite rastrear para que los buscadores lean esa directiva. El oficial permite indexación y publica su sitemap.

Permanece una observación sin impacto en la puntuación sobre la cadena HTML → CSS. No quedan chequeos puntuados pendientes en el oficial. Los 100 técnicos no garantizan posiciones, resultados enriquecidos ni recomendaciones de sistemas de IA.

Reportes HTML/JSON y medianas: [oficial](qa/artifacts/official/lighthouse-summary.json), [demo](qa/artifacts/demo/lighthouse-summary.json).

## Peso y servicios externos

Medición oficial a 1366 × 768, DPR 1, caché vacía:

| Recurso | Tamaño |
| --- | ---: |
| HTML gzip, incluyendo JS inline | 9.63 KB |
| JavaScript propio | 3.45 KB / 1.46 KB gzip |
| CSS | 34.10 KB / 8.08 KB gzip |
| Fuente variable latina WOFF2 | 29.29 KB |
| Recursos propios en la carga inicial | 254.67 KB, nueve solicitudes |
| Recursos propios en el recorrido completo | 260.85 KB, diez solicitudes |

El navegador puede anticipar imágenes lazy cercanas al viewport; la carga inicial incluye esas solicitudes. Los bytes varían con viewport, DPR, caché y servidor. No incluyen cabeceras HTTP, imagen social ni tráfico externo de Google Maps.

Google Maps no se solicitó al cargar inicialmente; al recorrer Ubicación se registraron 36 solicitudes externas. **Analytics y Ads no descargaron etiquetas ni enviaron eventos**, con la configuración desactivada. `whatsapp_click` queda preparado como señal de clic, no como confirmación de consulta o venta.

Detalle: [size-report-official.json](qa/artifacts/size-report-official.json). Los reportes de QA están ignorados por Git y no se incluyen en el ZIP ni en Vercel.

## Medición simulada y respaldo

- `pnpm qa:measurement`: **12 escenarios aprobados** sobre el módulo real, con IDs ficticios, etiqueta interceptada y destino WhatsApp simulado.
- Incluye desactivación, IDs vacíos/inválidos, GA4, Ads, ambos adaptadores, clic SVG, inicialización repetida, etiqueta lenta/bloqueada y enlaces sin medición o con ubicación desconocida. Un clic genera una sola señal por adaptador y conserva la navegación nativa.
- Los eventos únicamente contienen ubicación del CTA o destino de conversión; no contienen el mensaje ni el teléfono de la prueba. Ninguna etiqueta ni mensaje se envía a servicios reales.
- La prueba confirma los eventos procesados o encolados por el adaptador; no acredita recepción en Google. Al navegar antes de cargar la etiqueta, la cola puede perderse. Cuentas reales, privacidad/consentimiento, Tag Assistant y prevención de conversiones duplicadas siguen pendientes.
- Antes de preparar la subida se revisaron 74 objetos de texto del historial y 63 archivos actuales: sin archivos privados versionados ni coincidencias con los patrones de credenciales comprobados. `.env.local`, `.vercel`, dependencias, builds, ZIP y reportes están excluidos.

Resultado local: [measurement-results.json](qa/artifacts/measurement-results.json). Instrucciones de activación: [README.md](README.md).

## Demo publicada

Actualizada en [jl-aberturas.vercel.app](https://jl-aberturas.vercel.app/) mediante la cuenta conectada de Ramiro. Build remoto aprobado con Node 24 y pnpm 11.7.0.

La última comprobación pública registrada precede a estas mejoras. La actualización se comprobará después de desplegarla con contextos anónimos a 1366 × 768 y 390 × 844, incluidos los nuevos CTA, teléfono, metadatos, cinco preguntas y tres referencias. La demo conserva `noindex,follow`.

Resultado: [deployment-results.json](qa/artifacts/deployment-results.json). Repetir con `node qa/deployment.mjs`.

## Pendientes externos para publicar el oficial

1. Aprobación del dominio, acceso a Hostinger, DNS y certificado HTTPS para dominio y `www`.
2. Fotografías reales autorizadas: reemplazar referencias y sus alt/captions; retirar las leyendas únicamente cuando corresponda.
3. Horarios y cualquier dato o condición comercial adicional que el negocio confirme. Logo, dirección, cobertura y perfil de Google ya están incorporados.
4. Verificación de Search Console, envío del sitemap e inspección de URL tras publicar. Revisar las opciones de inclusión en funciones generativas y vincular la web desde el perfil de Google existente.
5. Cuentas y conversiones de medición si se decide activarlas; configuración y privacidad deben revisarse antes. La administración del perfil de Google queda como servicio separado.
6. Repetir la comprobación de redirecciones, caché, 404 y Lighthouse en el dominio oficial sobre Hostinger; después observar métricas reales cuando haya tráfico.

Instrucciones de entrega y edición: [README.md](README.md). Fuentes y licencias: [ASSETS.md](ASSETS.md).
