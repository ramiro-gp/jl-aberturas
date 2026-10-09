// Enable only after account setup, conversion setup and privacy review.
// IDs are public identifiers, never credentials. No tags load while disabled.
export interface MeasurementConfig {
  enabled: boolean;
  googleAnalyticsId: string;
  googleAdsConversionId: string;
  googleAdsConversionLabel: string;
}

export const measurement = {
  enabled: false,
  googleAnalyticsId: '', // G-...
  googleAdsConversionId: '', // AW-...
  googleAdsConversionLabel: '',
} as const satisfies MeasurementConfig;

export type WhatsAppPlacement = 'header' | 'menu' | 'hero' | 'products' | 'options' | 'contact' | 'footer';
