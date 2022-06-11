import axios from 'axios';
import { get, put } from '../cache';
import { z } from 'zod';
import { logger } from '../logger';

// https://appapi.littlefreelibrary.org/library/pin.json?page_size=50&distance=50&near=indiana

export const getLibraryIndex = async (): Promise<LibraryIndexPayload> => {
  const CACHE_KEY = 'all-libraries.json';

  const contents = await get(CACHE_KEY);
  if (contents !== null) {
    logger.trace('Returning cached contents.');
    return zLibraryIndex.passthrough().parse(JSON.parse(contents));
  }

  logger.trace({}, 'Cache missed. Attempting API call for libraries');
  const response = await axios.get(
    'https://appapi.littlefreelibrary.org/library/pin.json',
    { params: { page_size: 500, distance: 50, near: 'indiana' } }
  );

  const json = response.data;
  const payload = zLibraryIndex.passthrough().parse(json);
  await put('all-libraries.json', JSON.stringify(payload));
  return payload;
};

const zLibraryIndex = z.object({
  page: z.number().nonnegative(),
  page_size: z.number().positive(),
  page_count: z.number().nonnegative(),
  library_count: z.number().nonnegative(),
  distance: z.number().nonnegative(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  libraries: z.array(
    z.object({
      id: z.number().positive(),
      Library_Geolocation__Latitude__s: z.number().optional(),
      Library_Geolocation__Longitude__s: z.number().optional(),
    })
  ),
});

type LibraryIndexPayload = z.infer<typeof zLibraryIndex>;
