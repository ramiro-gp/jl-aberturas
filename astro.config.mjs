import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

const env = loadEnv(
  process.env.NODE_ENV || "production",
  process.cwd(),
  "PUBLIC_",
);
const productionSite = process.env.JL_SITE_MODE === "production";
const siteUrl = env.PUBLIC_SITE_URL?.trim();
if (siteUrl) {
  const url = new URL(siteUrl);
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "PUBLIC_SITE_URL debe ser el origen HTTPS real, sin ruta, query ni fragmento.",
    );
  }
}
if (productionSite && !siteUrl) {
  throw new Error(
    "El sitio oficial requiere PUBLIC_SITE_URL con el dominio HTTPS real. La demo se construye con pnpm build.",
  );
}
export default defineConfig({
  output: "static",
  site: siteUrl || undefined,
  integrations: productionSite ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
    define: { __PRODUCTION_SITE__: JSON.stringify(productionSite) },
  },
  devToolbar: { enabled: false },
});
