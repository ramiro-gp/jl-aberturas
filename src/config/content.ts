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
      "Fabricamos aberturas de aluminio a medida en Rafael Calzada. Medición a domicilio sin cargo en CABA y GBA. Venta directa y colocación en el día.",
  },
  products: {
    headingFirst: "Aberturas para",
    headingSecond: "cada espacio.",
    intro:
      "Fabricamos ventanas, ventanales y puertas corredizas de aluminio a medida para viviendas y obras. También evaluamos tu proyecto de mamparas y techos de vidrio. Coordinamos la instalación en CABA y GBA.",
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

export const products = [
  {
    name: "Ventanales",
    description: "Ventanales a medida para conectar tus ambientes con el exterior. Evaluamos las medidas, la línea y el vidrio para tu proyecto.",
    image: ventanales,
    alt: "Ventanales de referencia que conectan un ambiente con el exterior.",
    className: "product-large",
    position: "center",
  },
  {
    name: "Ventanas",
    description: "Ventanas a medida para construir o renovar. Te asesoramos sobre las líneas Módena y A30 NEW y las opciones de vidrio.",
    image: ventanas,
    alt: "Ventanas de referencia en un ambiente iluminado por luz natural.",
    className: "product-small",
    position: "left center",
  },
  {
    name: "Puertas corredizas",
    description: "Puertas corredizas a medida para comunicar ambientes y patios. Consultanos por fabricación, venta y colocación.",
    image: corredizas,
    alt: "Puertas corredizas de referencia que conectan un ambiente con un patio.",
    className: "product-wide",
    position: "center",
  },
  {
    name: "Mamparas de baño",
    description: "Mamparas de baño para delimitar el espacio de ducha. Compartinos las medidas o una foto para evaluar tu consulta.",
    image: mamparas,
    alt: "Imagen ilustrativa de una mampara de baño de vidrio.",
    className: "product-small",
    position: "center",
  },
  {
    name: "Techos de vidrio",
    description: "Techos de vidrio para incorporar luz desde arriba. Contanos cómo es el espacio y evaluamos la propuesta para tu proyecto.",
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
  { name: "Vidrio float", description: "Vidrio plano simple. Evaluamos el espesor y su uso según la abertura y el espacio." },
  { name: "Vidrio DVH", description: "Doble vidriado hermético: dos vidrios separados por una cámara sellada que ayuda al aislamiento térmico. Su desempeño depende de la composición elegida." },
  { name: "Vidrio laminado", description: "Dos o más vidrios unidos por una lámina intermedia que ayuda a retener los fragmentos ante una rotura. Evaluamos su composición según el proyecto." },
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
