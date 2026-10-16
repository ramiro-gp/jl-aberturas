import type { ImageMetadata } from 'astro';
import corrediza from '../assets/catalog/corrediza-blanca.webp';
import ventana from '../assets/catalog/ventana-abrir.webp';
import ventiluz from '../assets/catalog/ventiluz-negro.webp';
import puerta from '../assets/catalog/puerta-blanca.webp';
import mampara from '../assets/catalog/mampara.webp';
import techo from '../assets/gallery/techo-residencial.webp';

export interface ProductView {
  label: string;
  image: ImageMetadata;
  alt: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  views: readonly ProductView[];
}

export const navigation = [
  { label: "Productos", href: "#productos" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Cómo trabajamos", href: "#proceso" },
  { label: "Contacto", href: "#contacto" },
] as const;

export const copy = {
  hero: {
    activity: "Fábrica directa · Venta e instalación",
    titleFirst: "Aberturas a medida",
    titleSecond: "para tu espacio.",
    description:
      "Fabricamos aberturas de aluminio a medida en Rafael Calzada. Medición a domicilio sin cargo en CABA y GBA. Venta directa y colocación en el día.",
  },
  products: {
    headingFirst: "Aberturas para",
    headingSecond: "cada espacio.",
    intro:
      "Ventanas, ventanales, corredizas y puertas de aluminio a medida. También evaluamos proyectos de mamparas y techos de vidrio. Te asesoramos y coordinamos la instalación en CABA y GBA.",
    customHeading: "Aberturas a medida",
    customDescription:
      "Cada espacio tiene sus medidas. Contanos tu idea y definimos juntos la abertura que necesitás.",
  },
  about: {
    heading: ["Fabricamos.", "Te asesoramos.", "Instalamos."],
    description:
      "Tenemos fábrica propia en Rafael Calzada. Fabricamos y vendemos aberturas de aluminio a medida, te asesoramos para elegir la línea y el vidrio, y nos ocupamos de la colocación. Atención directa, desde la medición hasta la abertura instalada.",
    note: "Fábrica propia. Atención directa.",
  },
  contact: {
    headingFirst: "Contanos qué",
    headingSecond: "abertura",
    headingLast: "necesitás.",
    description:
      "Compartinos una idea, una foto o las medidas aproximadas. Te ayudamos a definir el próximo paso.",
  },
} as const;

export const products: readonly Product[] = [
  {
    id: 'corredizas',
    name: 'Ventanales y corredizas',
    description: 'Luz, amplitud y conexión con el exterior. Definimos las medidas, la línea y el vidrio según tu espacio.',
    views: [{ label: 'Corrediza de dos hojas', image: corrediza, alt: 'Referencia de una corrediza blanca de dos hojas vidriadas, con tiradores negros.' }],
  },
  {
    id: 'ventanas',
    name: 'Ventanas',
    description: 'Distintas formas de abrir y ventilar. Te ayudamos a elegir la tipología, la línea y el vidrio para construir o renovar.',
    views: [
      { label: 'De abrir', image: ventana, alt: 'Referencia de una ventana de abrir blanca, con manija negra a la izquierda.' },
      { label: 'Ventiluz', image: ventiluz, alt: 'Referencia de un ventiluz negro abierto, con brazo de empuje central.' },
    ],
  },
  {
    id: 'puertas',
    name: 'Puertas de aluminio',
    description: 'Una entrada pensada para tu proyecto. Evaluamos las medidas, la terminación y el sentido de apertura.',
    views: [{ label: 'Puerta de aluminio', image: puerta, alt: 'Referencia de una puerta blanca de aluminio con paneles horizontales y manija blanca.' }],
  },
  {
    id: 'mamparas',
    name: 'Mamparas de baño',
    description: 'Vidrio para delimitar la ducha y conservar la luz. Compartinos una foto o las medidas para evaluar tu consulta.',
    views: [{ label: 'Mampara fija', image: mampara, alt: 'Referencia de una mampara fija transparente, con perfil lateral plateado y plato de ducha blanco.' }],
  },
];

export const roofProduct = {
  name: 'Techos de vidrio',
  description: 'Luz natural desde arriba. Contanos cómo es tu patio o el espacio que querés cubrir y evaluamos una propuesta para tu proyecto.',
  image: techo,
  alt: 'Visualización ilustrativa de un patio residencial con cubierta de vidrio y estructura oscura.',
};

export const steps = [
  {
    title: "Nos contás qué necesitás.",
    description: "Compartís tu idea y el espacio donde irá la abertura.",
  },
  {
    title: "Medimos en tu domicilio.",
    description: "Medición sin cargo en CABA y GBA. Evaluamos medidas, línea y tipo de vidrio.",
  },
  {
    title: "Fabricamos tu abertura.",
    description: "Fabricamos en nuestra propia fábrica, según las medidas y la propuesta acordada.",
  },
  {
    title: "Colocación en el día.",
    description: "Coordinamos la fecha y colocamos tu abertura. El plazo de fabricación se acuerda al consultar.",
  },
] as const;

export const productLines = [
  {
    name: "Módena",
    use: "Versatilidad para tu vivienda",
    description: "Una línea de aluminio versátil para ventanas y puertas de medidas habituales. Una opción para construir o renovar, con distintas formas de apertura y vidrio según tu proyecto.",
    features: ["Construcción y renovación", "Distintas formas de apertura", "Vidrio según el proyecto"],
  },
  {
    name: "A30 NEW",
    use: "Alta prestación y amplitud",
    description: "Una línea de aluminio de alta prestación para proyectos que requieren aberturas de mayor tamaño. Evaluamos la tipología, las medidas y el vidrio según el uso y el lugar de instalación.",
    features: ["Alta prestación", "Proyectos de mayor tamaño", "Medidas a evaluar"],
  },
] as const;

export const glassTypes = [
  { kind: 'float', name: 'Vidrio float', detail: 'Un panel de vidrio', description: 'Vidrio plano simple y transparente. El espesor se elige según las medidas, la abertura y el lugar de uso.' },
  { kind: 'dvh', name: 'Vidrio DVH', detail: 'Dos paneles · cámara sellada', description: 'Doble vidriado hermético: dos vidrios separados por una cámara sellada que ayuda al aislamiento térmico. Su desempeño depende de la composición.' },
  { kind: 'laminado', name: 'Vidrio laminado', detail: 'Vidrio · lámina intermedia · vidrio', description: 'Dos o más vidrios unidos por una lámina intermedia que ayuda a retener los fragmentos ante una rotura. Evaluamos la composición según el proyecto.' },
  { kind: 'templado', name: 'Vidrio templado', detail: 'Vidrio con tratamiento térmico', description: 'Vidrio tratado térmicamente para aumentar su resistencia. Su elección y espesor se evalúan según la aplicación y el espacio.' },
] as const;
export const accessories = ["Mosquiteros", "Premarcos", "Tapajuntas"] as const;

export const questions = [
  {
    question: '¿En qué zonas trabajan?',
    answer: 'Nuestra fábrica está en Pastoriza 1765, Rafael Calzada. Trabajamos en CABA, Zona Sur, Zona Oeste y Zona Norte.',
  },
  {
    question: '¿La medición a domicilio tiene costo?',
    answer: 'La medición a domicilio es sin cargo en CABA y GBA. Consultanos por WhatsApp para coordinarla.',
  },
  {
    question: '¿Qué significa colocación en el día?',
    answer: 'Coordinamos una fecha para colocar tu abertura en el día. El plazo de fabricación se acuerda al consultar y es distinto del tiempo de colocación.',
  },
  {
    question: '¿Puedo cambiar mis aberturas sin hacer obra?',
    answer: 'Evaluamos el marco existente para definir si el recambio puede hacerse sin obra. La solución depende de su estado, las medidas y la abertura que quieras instalar.',
  },
  {
    question: '¿Qué necesito para pedir presupuesto?',
    answer: 'Podés enviarnos tu idea, una foto del espacio o medidas aproximadas por WhatsApp. Después evaluamos las medidas, la línea y el tipo de vidrio.',
  },
] as const;
