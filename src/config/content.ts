import ventanales from "../assets/products/ventanales.jpg";
import ventanas from "../assets/products/ventanas.jpg";
import corredizas from "../assets/products/corredizas.jpg";
import mamparas from "../assets/products/mamparas.jpg";
import techosVidrio from "../assets/products/techos-vidrio.webp";

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
      "Fabricamos ventanas, ventanales y puertas corredizas en Rafael Calzada. Medición a domicilio sin cargo en CABA y GBA. Venta directa y colocación en el día.",
  },
  products: {
    headingFirst: "Aberturas para",
    headingSecond: "cada espacio.",
    intro:
      "Para construir, renovar o conectar ambientes. Encontrá el punto de partida para tu proyecto.",
    customHeading: "Aberturas a medida",
    customDescription:
      "Cada espacio tiene sus medidas. Contanos tu idea y definimos juntos la abertura que necesitás.",
  },
  about: {
    heading: ["Fabricamos.", "Te asesoramos.", "Instalamos."],
    description:
      "Tenemos fábrica propia en Rafael Calzada. Fabricamos y vendemos aberturas a medida, te asesoramos para elegir la línea y el vidrio, y nos ocupamos de la colocación. Atención directa, desde la medición hasta la abertura instalada.",
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

export const products = [
  {
    name: "Ventanales",
    description: "Más conexión entre tus ambientes y el exterior.",
    image: ventanales,
    alt: "Ventanales de referencia que conectan un ambiente con el exterior.",
    className: "product-large",
    position: "center",
  },
  {
    name: "Ventanas",
    description: "Una abertura pensada para cada ambiente.",
    image: ventanas,
    alt: "Ventanas de referencia en un ambiente iluminado por luz natural.",
    className: "product-small",
    position: "left center",
  },
  {
    name: "Puertas corredizas",
    description: "Abrí el paso entre un espacio y otro.",
    image: corredizas,
    alt: "Puertas corredizas de referencia que conectan un ambiente con un patio.",
    className: "product-wide",
    position: "center",
  },
  {
    name: "Mamparas de baño",
    description: "Una división de vidrio para el espacio de ducha.",
    image: mamparas,
    alt: "Imagen ilustrativa de una mampara de baño de vidrio.",
    className: "product-small",
    position: "center",
  },
  {
    name: "Techos de vidrio",
    description: "Más luz natural para proyectos que la incorporan desde arriba.",
    image: techosVidrio,
    alt: "Imagen ilustrativa de un atrio con cubierta de vidrio y estructura visible.",
    className: "product-roof",
    position: "center",
  },
] as const;

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
    use: "Pensada para el recambio",
    description: "Una opción para renovar tus aberturas, con hermeticidad y colocación sobre el marco existente, sin obra.",
    features: ["Recambio sobre el marco existente", "Sin obra", "Hermeticidad"],
  },
  {
    name: "A30 NEW",
    use: "Diseño moderno y robustez",
    description: "Diseño moderno, seguridad y aislamiento. Una línea robusta para un recambio rápido y una terminación de calidad.",
    features: ["Seguridad y aislamiento", "Recambio rápido", "Estructura robusta"],
  },
] as const;

export const glassTypes = ["Vidrio float", "Vidrio DVH", "Vidrio laminado"] as const;
export const accessories = ["Mosquiteros", "Premarcos", "Tapajuntas"] as const;
