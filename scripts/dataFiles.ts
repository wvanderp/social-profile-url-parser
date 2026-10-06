import fs from 'fs';
import path from 'path';
import type { RawProperty } from '../src/types';
import compileProperties from './compileProperties';

export const rawPropertiesPath = path.join(__dirname, '../data/properties.raw.json');
export const compiledPropertiesPath = path.join(__dirname, '../data/properties.compiled.json');

function writeJson(filePath: string, data: unknown): void {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    // eslint-disable-next-line unicorn/no-null
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readRawProperties(): RawProperty[] {
    return JSON.parse(fs.readFileSync(rawPropertiesPath, 'utf8')) as RawProperty[];
}

export function writeRawProperties(rawProperties: RawProperty[]): void {
    writeJson(rawPropertiesPath, rawProperties);
}

export function writeCompiledProperties(rawProperties: RawProperty[]): void {
    writeJson(compiledPropertiesPath, compileProperties(rawProperties));
}
