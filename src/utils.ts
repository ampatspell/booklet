import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export type PageSize = [number, number];

// dirnameForURL(import.meta.url)
export const dirnameForURL = (url: string) => dirname(fileURLToPath(url));

export const run = (cb: () => Promise<void>) => {
  cb().then(() => {
    console.log('done');
  }, err => {
    console.log(err.stack);
  });
}

export const assetsRoot = join(dirnameForURL(import.meta.url), '..', 'assets');

export const load = async (filename: string): Promise<Buffer> => {
  return await readFile(join(assetsRoot, filename));
}

export const save = async (filename: string, buffer: Buffer): Promise<void> => {
  await writeFile(join(assetsRoot, filename), buffer);
}

export const toLandscape = (size: PageSize): PageSize => {
  return [ size[1], size[0] ];
}
