# Assets y licencias

Las imágenes son referencias visuales de categorías. No muestran obras ni instalaciones comprobadas de JL Aberturas. Las leyendas ilustrativas deben mantenerse mientras se utilicen.

## Selección del cliente — 15 de octubre de 2026

Los 15 adjuntos originales se conservan **sin modificar** en `references/client-images/`. Fueron enviados por el cliente y, según lo informado, obtenidos de Google. La fuente original y la autorización de uso **no están acreditadas**. El retoque y la generación de ambientes no establecen permiso sobre las referencias; resolver esa procedencia antes de publicación comercial.

Se utilizó la herramienta integrada **image_gen**, sin CLI, API key ni proveedor alternativo. Los prompts completos, referencias y rutas de los masters generados se registran en [`references/image-generation.json`](references/image-generation.json). Los nueve derivados finales están dentro del proyecto en WebP; Astro genera las variantes AVIF/WebP/JPEG para la web. Las referencias originales y el registro no se sirven públicamente y se excluyen del upload de Vercel.

| Derivado activo | Referencia y tratamiento |
| --- | --- |
| `src/assets/catalog/corrediza-blanca.webp` | #8: corrediza blanca de dos hojas; encuadre sin cabecera publicitaria, fondo marfil, perfiles y tiradores conservados. |
| `src/assets/catalog/ventana-abrir.webp` | #1: ventana blanca cerrada, manija izquierda y bisagras derechas; fondo unificado. |
| `src/assets/catalog/ventiluz-negro.webp` | #7: ventiluz abierto, brazo central y acabado negro; fondo y reflejos armonizados. |
| `src/assets/catalog/puerta-blanca.webp` | #4: puerta opaca blanca, juntas horizontales, manija izquierda; mejora de claridad y fondo. |
| `src/assets/catalog/mampara.webp` | #6: mampara fija con perfil plateado; se conserva el conjunto de apoyo para que el vidrio transparente sea legible. Grifería y plato son contexto ilustrativo, no accesorios incluidos. |
| `src/assets/gallery/estar-corrediza.webp` | Ambiente generado a partir de #8; dos hojas, perfiles blancos, juntas y tiradores negros. |
| `src/assets/gallery/acceso-puerta.webp` | Acceso generado a partir de #4; puerta blanca opaca de paneles horizontales. |
| `src/assets/gallery/bano-mampara.webp` | Baño generado a partir de #6; panel fijo transparente y perfil plateado. |
| `src/assets/gallery/techo-residencial.webp` | Ambiente residencial generado sin referencia de modelo específico; cubierta vidriada con estructura oscura. |

Se revisaron visualmente los nueve resultados frente a las referencias: formas, cantidad de hojas, orientación, herrajes y ausencia de textos. Son imágenes orientativas, no planos, fichas de fabricación ni garantía de identidad de cada detalle. El retoque no recupera detalles originales que no existían en la imagen comprimida.

**Excluidas:** #2 por redundancia y menor definición; #3 por resolución y reflejo dominante; #5 por sus 375 × 500 px; #9 por ser captura con controles/collage; #10 y #11 por menor calidad y redundancia. Las #12–15 se usan solo como referencias conceptuales: sus gráficos, fondos, textos comerciales y listas de espesores no se publican.

## Gráficos de vidrio

Los cuatro esquemas se construyen en `src/components/GlassDiagram.astro` con SVG propio: float, DVH, laminado y templado. Los nombres, detalles y explicaciones son HTML. Son esquemas conceptuales sin escala; no especifican dimensiones, prestaciones garantizadas ni disponibilidad. El espesor no define una categoría independiente y un DVH puede combinar laminado o templado. Referencia de contenido: [VASA — Información técnica](https://www.vasa.com.ar/asesoramiento/informacion-tecnica/).

## Referencias anteriores conservadas

Estas fotografías de Unsplash ya no aparecen en Productos ni Galería. Se conservan los archivos y sus créditos como historial de assets:

| Archivo | Autor y fuente | Licencia |
| --- | --- | --- |
| `src/assets/products/ventanales.jpg` | [Tsuyoshi Kozu — Modern glass doors overlooking trees and buildings](https://unsplash.com/photos/modern-glass-doors-overlooking-trees-and-buildings-m2QXm3V7mds) | [Unsplash License](https://unsplash.com/license), fotografía gratuita |
| `src/assets/products/ventanas.jpg` | [Louie A — A bright, empty room with large windows](https://unsplash.com/photos/a-bright-empty-room-with-large-windows-RY4l1gk1688) | [Unsplash License](https://unsplash.com/license), fotografía gratuita |
| `src/assets/products/corredizas.jpg` | [Franco Debartolo — Modern dining area with tiled floor, sunlight, and patio access](https://unsplash.com/photos/modern-dining-area-with-tiled-floor-sunlight-and-patio-access-83A5p6ntNPQ) | [Unsplash License](https://unsplash.com/license), fotografía gratuita |
| `src/assets/products/mamparas.jpg` | [Peter Muniz — Modern bathroom with glass shower enclosure](https://unsplash.com/photos/modern-bathroom-with-glass-shower-enclosure-zYIUp9jf6nI) | [Unsplash License](https://unsplash.com/license), fotografía gratuita |
| `src/assets/products/techos-vidrio.webp` | [Tanya Barrow — Modern atrium with glass roof and balconies](https://unsplash.com/photos/modern-atrium-with-glass-roof-and-balconies-nZtrD-u8378) | [Unsplash License](https://unsplash.com/license), fotografía gratuita |

Las tres primeras fotografías se consultaron y descargaron el 7 de octubre de 2026; las dos últimas, el 8 de octubre de 2026. La licencia de Unsplash permite el uso comercial en este sitio. Astro genera versiones responsive AVIF, WebP y JPEG en el build. No hay hotlinks ni solicitudes a Unsplash al navegar.

- **Libre Franklin:** archivo latino variable normal, 29.292 bytes, desde `@fontsource-variable/libre-franklin`. [Proyecto y licencia SIL OFL 1.1](https://github.com/googlefonts/Libre-Franklin). No se solicitan fuentes a Google.
- **Lucide:** SVG renderizado por `@lucide/astro`; [licencia](https://lucide.dev/license). No se utilizan sus iconos como logo de WhatsApp.
- **Logo de header y footer:** suministrado por el cliente a través de una imagen de WhatsApp. PNG preparado con `imagegen`: recorte al círculo y transparencia exterior, conservando el interior blanco, el monograma, el nombre y el teléfono. Archivo: `src/assets/brand/logo-jl-aberturas.png` (1024 × 1024). Astro genera versiones WebP pequeñas para cada ubicación, con alpha y dimensiones reservadas.
- **Favicon, icono de inicio y logo público:** `public/favicon.png` (96px), `public/apple-touch-icon.png` (180px) y `public/logo.png` (512px), optimizados con Sharp a partir del PNG oficial sin redibujar la identidad ni quitar el blanco interior.
- **Hero y dibujos:** construidos con HTML/CSS/SVG. La imagen social `public/og.png` (1200 × 630) incorpora el logo oficial; se renderiza con la fuente local desde `scripts/og-source.svg`. `pnpm og` regenera estos recursos.

Para sustituir imágenes: colocar los derivados en `src/assets/catalog` o `src/assets/gallery`, actualizar imports, vistas y alt en `src/config/content.ts` y `src/config/gallery.ts`, y reconstruir. `ProductViews.astro` admite varias vistas por categoría. No retirar las leyendas hasta que las imágenes representen contenido real autorizado; mantener la identificación de IA cuando corresponda.
