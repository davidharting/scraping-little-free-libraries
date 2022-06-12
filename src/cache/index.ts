import fs from 'fs/promises';
import path from 'path';

const getCacheDirectoryName = () => process.env.CACHE_DIRECTORY ?? '.cache';
const cacheDirPath = (): string =>
  path.join(process.cwd(), getCacheDirectoryName());
const cacheFilePath = (key: string): string => path.join(cacheDirPath(), key);

export async function put(key: string, value: string): Promise<void> {
  try {
    await fs.access(cacheDirPath());
  } catch {
    await fs.mkdir(cacheDirPath());
  }
  await fs.writeFile(cacheFilePath(key), value, { flag: 'w' });
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
    const path = cacheDirPath();
    await fs.access(path);
    await fs.rm(path, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}
