# Assets y licencias

Las fotografías son referencias visuales de categorías. No muestran obras, instalaciones ni productos comprobados de JL Aberturas. La leyenda de imágenes ilustrativas debe mantenerse mientras se utilicen.

La galería reutiliza estas referencias con otras proporciones. Sus captions describen los espacios, no instalaciones del negocio. Para reemplazarla, editar `src/config/gallery.ts` con fotografías autorizadas del cliente y alt fiel a cada imagen.

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
- **Hero, dibujos, favicon e imagen social:** construidos para esta demo con HTML/CSS/SVG. El favicon de marco y la composición social siguen siendo recursos de la demo.

Para sustituir imágenes: colocar las fotografías autorizadas en `src/assets/products`, actualizar imports/alt/encuadre en `src/config/content.ts`, y reconstruir. No retirar la leyenda hasta que todas las fotos representen contenido real autorizado.
