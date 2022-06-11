import {
  Library,
  getLibraryIndex,
  showLibrary,
} from './clients/little-free-library';
import { logger } from './logger';

async function main() {
  const librariesIndex = await getLibraryIndex();
  logger.trace(
    { numLibraries: librariesIndex.libraries.length },
    'Looking at index'
  );

  const libraries: Array<Library> = [];

  for (let i = 0; i < 10; i++) {
    const item = librariesIndex.libraries[i];
    const library = await showLibrary({
      id: item.id,
      delayInMsIfCacheMiss: 1500,
    });
    libraries.push(library);
  }
}

(async () => {
  console.time('main');
  await main();
  console.timeEnd('main');
})();
