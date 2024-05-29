import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export type PageSize = [number, number];

// dirnameForURL(import.meta.url)
export const dirnameForURL = (url: string) => dirname(fileURLToPath(url));

export const run = (cb: () => Promise<void>) => cb().catch((err) => {
  console.log(err.stack);
});

export const assetsRoot = join(dirnameForURL(import.meta.url), '..', 'assets');

export const load = async (filename: string): Promise<Buffer> => {
  const fullName = join(assetsRoot, filename);
  console.log('»', fullName);
  return await readFile(fullName);
}

export const save = async (filename: string, buffer: Buffer): Promise<void> => {
  const fullName = join(assetsRoot, filename);
  console.log('«', fullName);
  await writeFile(fullName, buffer);
}

export const toLandscape = (size: PageSize): PageSize => {
  return [ size[1], size[0] ];
}
