import fs from 'fs/promises';
import path from 'path';
import { logger } from '../logger';

const cacheDirPath = (): string => path.join(process.cwd(), '.cache');
const cacheFilePath = (key: string): string => path.join(cacheDirPath(), key);

export async function put(key: string, value: string): Promise<void> {
  try {
    await fs.access('./.cache');
  } catch {
    logger.trace({}, 'No .cache directory found. Making directory.');
    await fs.mkdir('./.cache');
  }
  await fs.writeFile(`./.cache/${key}`, value, { flag: 'w' });
}

export async function get(key: string): Promise<string | null> {
  try {
    const filePath = cacheFilePath(key);
    await fs.access(filePath);
    const contents = await fs.readFile(filePath);
    return contents.toString();
  } catch {
    return null;
  }
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
