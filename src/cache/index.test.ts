import { put, destroyCache } from './index';
import { logger } from '../logger';

describe('cache', () => {
  describe('put', () => {
    afterEach(async done => {
      const result = await destroyCache();
      logger.info({ result }, 'Destroyed directory from afterEach');
      done();
    });
    it('should write contents to a file in .cache', async () => {
      await put('abc-123.json', '3423434 hello there');
    });
  });
});
