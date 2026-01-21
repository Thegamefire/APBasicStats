import { readFile } from 'fs/promises';
import YAML from 'yaml';


export const config =  await readFile('config.yml', 'utf8').then(parseConfig);


type Config = {
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

function getAPSlots() {
    return config.ap_slots.map(s => s[0]);
}