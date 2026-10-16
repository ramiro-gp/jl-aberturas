# Validación de la integración de imágenes

Actualización: **15 de octubre de 2026**. Verificación del build de demo local; no se publicó esta actualización ni se regeneró el paquete oficial de Hostinger.

## Resultado de la actualización visual

### Ajustes posteriores de nombre, flechas y footer

- Categoría renombrada a **Puertas de aluminio**.
- Hover de Ver Instagram y los tres enlaces de contacto/redes del footer: desplazamiento de la flecha `(2px, -2px)`, igual al CTA de Contacto. El enlace Ver productos conserva su movimiento vertical.
- Footer hasta 1023 px: logo, navegación, tres enlaces consecutivos de ancho completo (WhatsApp, Instagram y Facebook), dirección y créditos. Orden de teclado coherente con la presentación.
- Revisión a 320, 390, 600, 768, 820, 1023, 1024, 1366 y 1920 px: sin overflow; enlaces apilados en móvil/tablet. Geometría de escritorio idéntica a la anterior en 1024, 1366 y 1920 px; captura a 1366 px idéntica píxel por píxel.
- `pnpm check` y `pnpm build` aprobados. Axe del footer: cero infracciones A/AA a 390, 820 y 1366 px. Evidencia en `qa/artifacts/footer-review.json` y `footer-after-{390,820,1366}.png`.

### Integración de imágenes

- `pnpm check`: 40 archivos; cero errores, advertencias o hints. `pnpm build`: aprobado, con imágenes locales responsive AVIF/WebP/JPEG y dimensiones reservadas.
- **30 escenarios aprobados**: Chromium 151.0.7922.34, Firefox 153.0 y WebKit 26.5; seis viewports por motor y cuatro fallbacks (reduced motion, sin JS, JS bloqueado y fallo de inicialización). Cero infracciones axe WCAG A/AA.
- Cuatro categorías principales, un bloque de techos, cuatro fichas de vidrio y tres ambientes de galería. Leyendas ilustrativas y de IA verificadas.
- Selector de ventanas operable con Tab, Espacio y Enter, estados `aria-pressed` y una única vista activa. La altura se mantiene al cambiar entre De abrir y Ventiluz; tolerancia de medición de medio píxel para redondeo entre motores. Sin JavaScript o con scripts bloqueados, ambas vistas siguen disponibles y los botones se ocultan.
- `pnpm qa:images`: carga de los ocho encuadres visibles y de la vista alternativa de ventiluz comprobada; capturas e inspección visual a **390 × 844, 1366 × 768 y 1920 × 1080**. Sin overflow horizontal.
- Fotos del catálogo limitadas a **320 px en móvil y 440 px en escritorio**. A 1366 × 768, la tarjeta completa de Ventanales y corredizas termina en y = 651.38 px al alinearla 20 px debajo del header de 86 px; foto, título y descripción quedan dentro del viewport.
- Fotografías completas de catálogo con `object-fit: contain`, sin recorte de marcos. SVG de vidrio y textos HTML revisados en escritorio/móvil; galería y techo con encuadres coherentes y sin referencias a trabajos propios.
- `node qa/metrics.mjs`: 174.58 KB de recursos propios iniciales (12 solicitudes) y 328.03 KB al recorrer la página (16 solicitudes), a 1366 × 768, DPR 1 y caché vacía. JavaScript: 4.16 KB / 1.65 KB gzip; CSS: 37.07 KB / 8.63 KB gzip. La vista alternativa permanece sin descargar hasta seleccionarla y su carga se comprueba en `qa:images`.
- Maps no se solicita inicialmente; Analytics y Ads siguen desactivados. No se incorporó una librería de carruseles. Las cifras Lighthouse del histórico inferior corresponden al build anterior y no se atribuyen a esta actualización.

Evidencia local (ignorada por Git): [resultados de navegadores](qa/artifacts/browser-results-demo.json), [imágenes](qa/artifacts/images-results.json), [recursos](qa/artifacts/size-report-demo.json). Capturas: `qa/artifacts/images-{catalog,glass,roof,gallery}-{390,1366,1920}.png`; las de secciones omiten overlays fijos y las de viewport conservan la cabecera real. La selección, archivos finales y prompts se documentan en [ASSETS.md](ASSETS.md).

---

# Histórico: validación de la preparación oficial

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

Comprobación de esta actualización con contextos anónimos a 1366 × 768 y 390 × 844: HTTP 200 sin login, imágenes y fuente cargadas, sin errores de página ni recursos propios fallidos, CTA mobile inicial, dos CTA de productos/líneas, teléfono clicable, cinco preguntas y tres referencias. Márgenes simétricos, scroll suave, perfil de Google, crédito del footer y metadatos correctos. La imagen social pública coincide byte por byte con el archivo actualizado. La ruta inexistente devuelve HTTP 404 con la página personalizada, sin canonical ni entidad. Conserva `noindex,follow`.

Despliegue verificado: `dpl_5K8aLw8GE8GXhmiUTPS6fBRLdzLC`, desde el código del commit `7311910`. Capturas públicas de los nuevos CTA: `qa/artifacts/published-cta-1366.png` y `qa/artifacts/published-cta-390.png`.

Resultado: [deployment-results.json](qa/artifacts/deployment-results.json). Repetir con `node qa/deployment.mjs`.

El código y los commits anteriores están publicados en [GitHub](https://github.com/ramiro-gp/jl-aberturas), rama `main`, con seguimiento de `origin/main`. Los reportes y capturas permanecen locales y se pueden regenerar con los comandos de QA.

## Pendientes externos para publicar el oficial

1. Aprobación del dominio, acceso a Hostinger, DNS y certificado HTTPS para dominio y `www`.
2. Fotografías reales autorizadas: reemplazar referencias y sus alt/captions; retirar las leyendas únicamente cuando corresponda.
3. Horarios y cualquier dato o condición comercial adicional que el negocio confirme. Logo, dirección, cobertura y perfil de Google ya están incorporados.
4. Verificación de Search Console, envío del sitemap e inspección de URL tras publicar. Revisar las opciones de inclusión en funciones generativas y vincular la web desde el perfil de Google existente.
5. Cuentas y conversiones de medición si se decide activarlas; configuración y privacidad deben revisarse antes. La administración del perfil de Google queda como servicio separado.
6. Repetir la comprobación de redirecciones, caché, 404 y Lighthouse en el dominio oficial sobre Hostinger; después observar métricas reales cuando haya tráfico.

Instrucciones de entrega y edición: [README.md](README.md). Fuentes y licencias: [ASSETS.md](ASSETS.md).
