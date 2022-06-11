import { getLibraryIndex } from './clients/little-free-library';

async function main() {
  console.time('main');
  await getLibraryIndex();
  console.timeEnd('main');
}

main();
