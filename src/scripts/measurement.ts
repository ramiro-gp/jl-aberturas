import { measurement, type MeasurementConfig, type WhatsAppPlacement } from '../config/measurement';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;
const placements: readonly WhatsAppPlacement[] = ['header', 'menu', 'hero', 'products', 'options', 'contact', 'footer'];

export function initMeasurement(config: MeasurementConfig = measurement) {
  if (!config.enabled || initialized) return;
  const analytics = /^G-[A-Z0-9]+$/.test(config.googleAnalyticsId)
    ? config.googleAnalyticsId : '';
  const ads = /^AW-\d+$/.test(config.googleAdsConversionId)
    && /^[\w-]+$/.test(config.googleAdsConversionLabel)
    ? config.googleAdsConversionId : '';
  const id = analytics || ads;
  if (!id) return;
  initialized = true;

  window.dataLayer ??= [];
  window.gtag ??= function () { window.dataLayer!.push(arguments); };
  window.gtag('js', new Date());
  if (analytics) window.gtag('config', analytics);
  if (ads) window.gtag('config', ads);
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(tag);

  document.addEventListener('click', event => {
    const link = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>('a[data-whatsapp-placement]') : null;
    if (!link || new URL(link.href).hostname !== 'wa.me') return;
    const placement = link.dataset.whatsappPlacement as WhatsAppPlacement | undefined;
    if (!placement || !placements.includes(placement)) return;
    // A click is an intent signal, not proof of a received message or a sale.
    if (analytics) window.gtag?.('event', 'whatsapp_click', { cta_location: placement });
    if (ads) window.gtag?.('event', 'conversion', {
      send_to: `${ads}/${config.googleAdsConversionLabel}`,
    });
    // Native navigation stays immediate. No preventDefault, timeout or lead PII.
  });
}
