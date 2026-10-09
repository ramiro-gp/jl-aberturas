export const site = {
  businessName: "JL Aberturas",
  whatsappNumber: "5491141695236",
  displayPhone: "+54 9 11 4169-5236",
  whatsappMessage:
    "Hola, vi la web de JL Aberturas y quería consultar por una abertura.",
  production: __PRODUCTION_SITE__,
  title: "JL Aberturas | Aberturas de aluminio en Rafael Calzada",
  description:
    "Aberturas de aluminio a medida en Rafael Calzada. Líneas Módena y A30 NEW, medición sin cargo en CABA y GBA y colocación. Pedí presupuesto por WhatsApp.",
  // Complete only with confirmed business information, also visible on the page.
  address: {
    streetAddress: "Pastoriza 1765",
    addressLocality: "Rafael Calzada",
    addressCountry: "AR",
  },
  serviceArea: ["CABA", "Zona Sur", "Zona Oeste", "Zona Norte"],
  openingHours: null,
  email: null,
  googleBusinessProfileUrl: 'https://share.google/Kp1DXKrPlq93V9DPx',
  socialProfiles: [
    { name: "Instagram", url: "https://www.instagram.com/jl.aberturas/" },
    { name: "Facebook", url: "https://www.facebook.com/jl.aberturass" },
  ],
} as const;

const mapQuery = `${site.address.streetAddress}, ${site.address.addressLocality}, Argentina`;
export const map = {
  embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`,
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`,
};

export function getWhatsAppHref(): string {
  if (!/^\d{8,15}$/.test(site.whatsappNumber)) {
    throw new Error(
      "El número de WhatsApp debe incluir país y contener solo dígitos.",
    );
  }
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;
}

export function getPhoneHref(): string {
  return `tel:+${site.whatsappNumber}`;
}
