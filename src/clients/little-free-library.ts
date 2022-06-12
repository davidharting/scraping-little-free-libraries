import axios from 'axios';
import { get, put } from '../cache';
import { z } from 'zod';
import { logger } from '../logger';

// Index
// https://appapi.littlefreelibrary.org/library/pin.json?page_size=50&distance=50&near=indiana

// Individual
// https://appapi.littlefreelibrary.org/libraries/15334.json

interface ShowLibraryParam {
  id: number;
  delayInMsIfCacheMiss?: number;
}
export const showLibrary = async ({
  id,
  delayInMsIfCacheMiss = 500,
}: ShowLibraryParam): Promise<Library> => {
  const cacheKey = `library-${id}.json`;

  const log = logger.child({ cacheKey });

  const contents = await get(cacheKey);
  if (contents !== null) {
    log.trace('Returning cached contents.');
    return zLibrary.passthrough().parse(JSON.parse(contents));
  }

  log.trace(
    { delayInMs: delayInMsIfCacheMiss },
    'Sleeping before hitting API.'
  );
  await wait(delayInMsIfCacheMiss);
  log.trace('Waking up from sleep.');

  const response = await axios.get(
    `https://appapi.littlefreelibrary.org/libraries/${id}.json`
  );
  log.trace({ status: response.status }, 'Received response from API');

  const json = response.data;
  const payload = zLibrary.passthrough().parse(json);
  await put(cacheKey, JSON.stringify(payload));
  return payload;
};

export const getLibraryIndex = async (): Promise<LibraryIndexPayload> => {
  const cacheKey = 'all-libraries.json';

  const contents = await get(cacheKey);
  if (contents !== null) {
    logger.trace({ cacheKey }, 'Returning cached contents.');
    return zLibraryIndex.passthrough().parse(JSON.parse(contents));
  }

  logger.trace({ cacheKey }, 'Cache missed. Attempting API call for libraries');
  const response = await axios.get(
    'https://appapi.littlefreelibrary.org/library/pin.json',
    { params: { page_size: 2000, distance: 125, near: 'indianapolis' } }
  );

  const json = response.data;
  const payload = zLibraryIndex.passthrough().parse(json);
  await put('all-libraries.json', JSON.stringify(payload));
  return payload;
};

const wait = (timeInMs: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeInMs);
  });
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

const zLibrary = z.object({
  id: z.number().nonnegative(),
  Name: z.string(),
  Street__c: z
    .string()
    .optional()
    .nullable(),
  City__c: z
    .string()
    .optional()
    .nullable(),
  State_Province_Region__c: z
    .string()
    .optional()
    .nullable(),
  Postal_Zip_Code__c: z
    .string()
    .optional()
    .nullable(),
  Country__c: z
    .string()
    .optional()
    .nullable(),
  Traveling_Library__c: z.boolean().optional(),
  Official_Charter_Number__c: z
    .string()
    .optional()
    .nullable(),
  Dedication__c: z
    .string()
    .optional()
    .nullable(),
  Collaborators__c: z.any(),
  Library_Story__c: z
    .string()
    .optional()
    .nullable(),
  Email_on_Map__c: z.boolean(),
  Name_on_Map__c: z.boolean(),
  Exact_Location_on_Map__c: z.boolean(),
  Primary_Steward_s_Name__c: z
    .string()
    .optional()
    .nullable(),
  Primary_Steward_s_Phone__c: z
    .string()
    .optional()
    .nullable(),
  Primary_Steward_s_Email__c: z
    .string()
    .email()
    .optional()
    .nullable(),
  Opportunity__c: z.unknown().nullable(),
  Primary_Organizational_Steward__c: z.any().nullable(),
  Library_Name__c: z.string().nullable(),
  List_As_Name__c: z.string().nullable(),
  First_Map_Date__c: z
    .string()
    .optional()
    .nullable(),
  Map_Me__c: z
    .string()
    .optional()
    .nullable(),
  Map_Date__c: z
    .string()
    .optional()
    .nullable(),
  Duplicate_Charter_Number__c: z.boolean(),
  Map_Me_Notes__c: z
    .any()
    .optional()
    .nullable(),
  Library_Picture_URL__c: z
    .string()
    .url()
    .optional()
    .nullable(),
  HowToFind__c: z
    .unknown()
    .optional()
    .nullable(),
  CommentsActive__c: z.boolean(),
  Count_of_Primary_Stewards__c: z
    .number()
    .optional()
    .nullable(),
  Facebook__c: z
    .unknown()
    .optional()
    .nullable(),
  Instagram__c: z
    .unknown()
    .optional()
    .nullable(),
  Twitter__c: z
    .unknown()
    .optional()
    .nullable(),
  Pintrest__c: z
    .unknown()
    .optional()
    .nullable(),
  Announcement__c: z
    .unknown()
    .optional()
    .nullable(),
  DisplayAnnouncementUntil__c: z
    .unknown()
    .optional()
    .nullable(),
  DownUntil__c: z
    .unknown()
    .optional()
    .nullable(),
  Latitude_MapAnything__c: z
    .number()
    .optional()
    .nullable(),
  Longitude_MapAnything__c: z
    .number()
    .optional()
    .nullable(),
  Library_Geolocation__Latitude__s: z.number().optional(),
  Library_Geolocation__Longitude__s: z.number().optional(),
  distance: z.unknown().nullable(),
  favorite: z.boolean(),
  comments_disabled: z.boolean(),
  visited: z.boolean(),
  last_visited: z
    .unknown()
    .optional()
    .nullable(),
  primary_image: z
    .string()
    .url()
    .nullable(),
  image_urls: z.array(z.string().url()),
  check_in_count: z.number().nonnegative(),
  active_flags: z.array(z.unknown()),
  check_ins: z.array(z.unknown()),
  library_comments: z.array(z.unknown()),
  library_issues: z.array(z.unknown()),
  library_images: z.array(
    z.object({
      id: z.number().nonnegative(),
      order: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
      image_url: z
        .string()
        .url()
        .optional()
        .nullable(),
      url: z
        .string()
        .url()
        .optional()
        .nullable(),
    })
  ),
  notification_preferences: z
    .unknown()
    .optional()
    .nullable(),
  url: z.string().url(),
});

export type Library = z.infer<typeof zLibrary>;
