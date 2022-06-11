import { get, put, destroyCache } from './index';
import { logger } from '../logger';

describe('cache', () => {
  afterEach(async done => {
    const result = await destroyCache();
    logger.info({ result }, 'Destroyed directory from afterEach');
    done();
  });

  describe('put', () => {
    it('should write contents to a file in .cache and they should be retrievable with get', async () => {
      const key = 'abc-123.json';
      const contents = '3423434 hello there';
      await put(key, contents);
      const retrievedContents = await get(key);
      expect(retrievedContents).toBe(contents);
    });
  });

  describe('get', () => {
    it('should return null if the cache file does not exist', async () => {
      const contents = await get('some-random-key/that-is-not-there.json');
      expect(contents).toBe(null);
    });
  });
});
