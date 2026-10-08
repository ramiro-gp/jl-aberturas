import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { officialOrigin } from '../src/config/origins.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'release', 'hostinger');
const archive = path.join(root, 'release', 'jl-aberturas-hostinger.zip');
process.env.JL_SITE_MODE = 'production';
const { build } = await import('astro');
await build({ outDir: output });
const hostnamePattern = new URL(officialOrigin).hostname.split('.').join('\\.');
const rules = (await fs.readFile(path.join(root, 'hosting', '.htaccess'), 'utf8'))
  .replaceAll('__OFFICIAL_ORIGIN__', officialOrigin)
  .replaceAll('__OFFICIAL_HOST_PATTERN__', hostnamePattern);
await fs.writeFile(path.join(output, '.htaccess'), rules);
await fs.copyFile(path.join(root, 'hosting', 'assets.htaccess'), path.join(output, '_astro', '.htaccess'));
await fs.rm(archive, { force: true });

// Include dotfiles (.htaccess). Compress-Archive alone can omit hidden files.
if (process.platform === 'win32') {
  execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
    "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory($env:JL_ARCHIVE_INPUT, $env:JL_ARCHIVE_OUTPUT, [System.IO.Compression.CompressionLevel]::Optimal, $false)"],
    { env: { ...process.env, JL_ARCHIVE_INPUT: output, JL_ARCHIVE_OUTPUT: archive }, stdio: 'inherit' });
} else {
  execFileSync('zip', ['-q', '-r', archive, '.'], { cwd: output, stdio: 'inherit' });
}
console.log(`Sitio oficial: ${officialOrigin}\nArchivos: ${output}\nZIP: ${archive}\nSubir el contenido a public_html cuando DNS y SSL estén operativos. dist/ sigue siendo la demo.`);
