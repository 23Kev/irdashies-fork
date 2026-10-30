import type { Standings } from '@irdashies/domain';
import type { NameFormat } from '@irdashies/types';
import { getTailwindStyle } from '@irdashies/utils/colors';
import {
  DriverName as formatDriverName,
  extractDriverName,
} from '../DriverName/DriverName';

export const classColor = (color: number) =>
  getTailwindStyle(color, undefined, true).classHeader;

export const driverName = (standing: Standings, format: NameFormat) =>
  formatDriverName(extractDriverName(standing.driver.name), format);

/** Has run every joker lap the session asks for; never when it asks for none. */
export const jokerDone = (standing: Standings, jokerLaps: number) =>
  jokerLaps > 0 && (standing.jokerLapsComplete ?? 0) >= jokerLaps;
