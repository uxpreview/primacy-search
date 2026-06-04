import type { UniverseItem } from "./types";
import { work } from "./work";
import { services } from "./services";
import { industries } from "./industries";
import { people } from "./people";
import { ideas } from "./ideas";

export const UNIVERSE: UniverseItem[] = [
  ...work,
  ...services,
  ...industries,
  ...people,
  ...ideas,
];

export { work, services, industries, people, ideas };
export * from "./types";
