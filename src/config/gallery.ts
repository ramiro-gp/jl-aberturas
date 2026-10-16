import estar from '../assets/gallery/estar-corrediza.webp';
import acceso from '../assets/gallery/acceso-puerta.webp';
import bano from '../assets/gallery/bano-mampara.webp';

// AI visualizations based on client references, never presented as completed work.
export const gallery = {
  illustrative: true,
  heading: 'Una mirada a los espacios.',
  intro: 'Los productos, en contexto. Tres ambientes para imaginar cómo podrían acompañar tu espacio.',
  images: [
    { image: estar, caption: 'Interior y exterior, conectados', alt: 'Visualización con IA de un estar cálido conectado a un patio mediante una corrediza blanca de dos hojas.', ratio: '4 / 5', position: 'center' },
    { image: acceso, caption: 'Una entrada para tu espacio', alt: 'Visualización con IA de un acceso residencial con puerta blanca de paneles horizontales.', ratio: '4 / 3', position: 'center' },
    { image: bano, caption: 'Vidrio que deja pasar la luz', alt: 'Visualización con IA de un baño de tonos cálidos con mampara fija transparente y perfil plateado.', ratio: '4 / 3', position: 'center' },
  ],
};
