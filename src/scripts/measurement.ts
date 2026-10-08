import { measurement } from '../config/measurement';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initMeasurement() {
  if (!measurement.enabled) return;
  const analytics = /^G-[A-Z0-9]+$/.test(measurement.googleAnalyticsId)
    ? measurement.googleAnalyticsId : '';
  const ads = /^AW-\d+$/.test(measurement.googleAdsConversionId)
    && /^[\w-]+$/.test(measurement.googleAdsConversionLabel)
    ? measurement.googleAdsConversionId : '';
  const id = analytics || ads;
  if (!id) return;

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
    const placement = link.dataset.whatsappPlacement;
    // A click is an intent signal, not proof of a received message or a sale.
    if (analytics) window.gtag?.('event', 'whatsapp_click', { cta_location: placement });
    if (ads) window.gtag?.('event', 'conversion', {
      send_to: `${ads}/${measurement.googleAdsConversionLabel}`,
    });
    // Native navigation stays immediate. No preventDefault, timeout or lead PII.
  });
}
