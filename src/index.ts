import Papa from 'papaparse';
import {
  Library,
  getLibraryIndex,
  showLibrary,
} from './clients/little-free-library';
import { put } from './cache';
import { logger } from './logger';

const limit = (): number => {
  const fallback = 10;
  if (process.env.LIMIT) {
    const parsed = parseInt(process.env.LIMIT);
    if (isNaN(parsed)) {
      return fallback;
    }
    return parsed;
  }
  return fallback;
};

const LIMIT = limit();

async function main() {
  logger.trace({ limit: LIMIT }, 'Kicking off a run.');
  const librariesIndex = await getLibraryIndex();
  const numLibraries = librariesIndex.libraries.length;
  logger.trace({ numLibraries }, 'Looking at index');

  const libraries: Array<Library> = [];

  const loopMax = LIMIT > numLibraries ? numLibraries : LIMIT;

  for (let i = 0; i < loopMax; i++) {
    const item = librariesIndex.libraries[i];
    if (!item) {
      logger.warn(
        { i, numLibraries },
        'Did not find a library at index. Skipping.'
      );
    } else {
      const library = await showLibrary({
        id: item.id,
        delayInMsIfCacheMiss: 1000,
      });
      libraries.push(library);
    }
  }

  logger.trace(
    { numberOfLibraries: libraries.length },
    'Finished aggregating libraries.'
  );

  const rows: Array<LibraryCsvRow> = libraries.map(library => {
    const row: LibraryCsvRow = {
      'Name of library': library.List_As_Name__c,
      "Person's name": library.Primary_Steward_s_Name__c ?? null,
      "Person's email": library.Primary_Steward_s_Email__c ?? null,
      'Street address': library.Street__c ?? null,
      City: library.City__c ?? null,
      Zipcode: library.Postal_Zip_Code__c ?? null,
      State: library.State_Province_Region__c ?? null,
    };
    return row;
  });

  const indianaRows = rows.filter(row => row.State === 'IN');
  logger.trace(
    { numberOfIndianaLibraries: indianaRows.length },
    'Filtered to libraries in Indiana.'
  );

  const csv = Papa.unparse(indianaRows);
  logger.trace('Prepared csv');
  await put('output.csv', csv);
  logger.trace('Done!');
}

(async () => {
  console.time('main');
  await main();
  console.timeEnd('main');
})();

interface LibraryCsvRow {
  'Name of library': string | null;
  "Person's name": string | null;
  "Person's email": string | null;
  'Street address': string | null;
  City: string | null;
  Zipcode: string | null;
  State: string | null;
}
