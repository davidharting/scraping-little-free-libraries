import { get, put, destroyCache } from './index';

describe('cache', () => {
  beforeAll(() => {
    process.env.CACHE_DIRECTORY = '.cache-test';
  });
  afterAll(() => {
    delete process.env['CACHE_DIRECTORY'];
  });

  afterEach(async () => {
    await destroyCache();
  });

  describe('put', () => {
    it('should write contents to a file in .cache and they should be retrievable with get', async () => {
      const key = 'abc-123.json';
      const contents = '3423434 hello there';
      await put(key, contents);
      const retrievedContents = await get(key);
      expect(retrievedContents).toBe(contents);
    });

    it('should over-write file (not append) contents if the same key is "put" to twice', async () => {
      const key = 'my_name.txt';
      await put(key, 'what');
      await put(key, 'jonas');
      const retrieved = await get(key);
      expect(retrieved).toBe('jonas');
      return true;
    });
  });

  describe('get', () => {
    it('should return null if the cache file does not exist', async () => {
      const contents = await get('some-random-key/that-is-not-there.json');
      expect(contents).toBe(null);
    });
  });
});
