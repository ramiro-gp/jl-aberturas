import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";
import { officialOrigin, demoOrigin } from './src/config/origins.mjs';

const env = loadEnv(
  process.env.NODE_ENV || "production",
  process.cwd(),
  "PUBLIC_",
);
const productionSite = process.env.JL_SITE_MODE === "production";
const siteUrl = productionSite ? officialOrigin : (env.PUBLIC_SITE_URL?.trim() || demoOrigin);
if (siteUrl) {
  const url = new URL(siteUrl);
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "La URL del sitio debe ser un origen HTTPS real, sin ruta, query ni fragmento.",
    );
  }
}
export default defineConfig({
  output: "static",
  site: siteUrl || undefined,
  integrations: productionSite ? [sitemap({ filter: url => !new URL(url).pathname.startsWith('/404') })] : [],
  vite: {
    plugins: [tailwindcss()],
    define: { __PRODUCTION_SITE__: JSON.stringify(productionSite) },
  },
  devToolbar: { enabled: false },
});
