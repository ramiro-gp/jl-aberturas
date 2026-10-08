import ventanales from '../assets/products/ventanales.jpg';
import ventanas from '../assets/products/ventanas.jpg';
import corredizas from '../assets/products/corredizas.jpg';
import mamparas from '../assets/products/mamparas.jpg';
import techosVidrio from '../assets/products/techos-vidrio.webp';

// Reference images only. Replace with authorized client images and accurate captions.
export const gallery = {
  illustrative: true,
  heading: 'Una mirada a los espacios.',
  intro: 'Luz, conexión y distintas formas de abrir un ambiente.',
  images: [
    { image: ventanas, caption: 'Luz en cada ambiente', alt: 'Imagen ilustrativa de un ambiente con ventanas amplias.', ratio: '4 / 5', position: 'left center' },
    { image: corredizas, caption: 'Interior y exterior', alt: 'Imagen ilustrativa de un ambiente conectado con un patio mediante puertas corredizas.', ratio: '4 / 3', position: 'center' },
    { image: ventanales, caption: 'Una nueva perspectiva', alt: 'Imagen ilustrativa de ventanales con vista hacia el exterior.', ratio: '3 / 4', position: 'center' },
    { image: mamparas, caption: 'Vidrio para el baño', alt: 'Imagen ilustrativa de una mampara de baño en un espacio de tonos cálidos.', ratio: '4 / 3', position: 'center' },
    { image: techosVidrio, caption: 'Luz desde arriba', alt: 'Imagen ilustrativa de una cubierta de vidrio que deja entrar luz natural.', ratio: '3 / 4', position: 'center' },
  ],
};
