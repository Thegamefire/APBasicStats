import { readFile } from 'fs/promises';
import YAML from 'yaml';

let cachedConfig: Config;

export async function getConfig() {
    if (!cachedConfig) {
        const raw = await readFile('config.yml', 'utf8');
        cachedConfig = parseConfig(raw);
    }
    return cachedConfig;
}

export type Config = {
    ap_host: string,
    ap_pass: string,
    ap_slots: string[][]
}

function parseConfig(file: string): Config {
    const configFile = YAML.parse(file);
    return {
        ap_host: configFile.ap_host,
        ap_pass: configFile.ap_pass,
        ap_slots: configFile.ap_slots.map((a: string | string[]) => Array.isArray(a) ? a : [a])
    }
}