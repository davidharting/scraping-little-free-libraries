import fs from 'fs/promises';
import path from 'path';
import { logger } from '../logger';

export async function put(key: string, value: string): Promise<void> {
  try {
    await fs.access('./.cache');
  } catch {
    logger.trace({}, 'No .cache directory found. Making directory.');
    await fs.mkdir('./.cache');
  }
  await fs.writeFile(`./.cache/${key}`, value, { flag: 'w' });
}

export async function destroyCache(): Promise<boolean> {
  try {
    const cachePath = path.join(process.cwd(), '.cache');
    logger.trace({ cachePath }, 'attempting to destroy cache');
    await fs.access(cachePath);
    logger.trace({}, '.cache exists.');
    await fs.rm(cachePath, { recursive: true, force: true });
    logger.trace({ path: cachePath }, '.cache destroyed');
    return true;
  } catch {
    return false;
  }
}
