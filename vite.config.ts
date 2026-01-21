import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {fileURLToPath} from "node:url";
import {readFileSync} from "node:fs";

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

process.env.PUBLIC_APP_VERSION = pkg.version;

export default defineConfig({ plugins: [tailwindcss(), sveltekit()] });
