// Enable only after account setup, conversion setup and privacy review.
// IDs are public identifiers, never credentials. No tags load while disabled.
export const measurement = {
  enabled: false,
  googleAnalyticsId: '', // G-...
  googleAdsConversionId: '', // AW-...
  googleAdsConversionLabel: '',
} as const;

export type WhatsAppPlacement = 'header' | 'menu' | 'hero' | 'contact' | 'footer';
