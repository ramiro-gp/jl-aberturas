process.env.JL_SITE_MODE = "production";
const { build } = await import("astro");
await build({ outDir: './release/production/' });
