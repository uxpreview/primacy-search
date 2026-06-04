export type ResultType = "work" | "service" | "industry" | "person" | "idea";
export type TabKey = "all" | ResultType;

export interface BaseItem {
  id: string;
  type: ResultType;
  title: string;
  excerpt: string;
  tags: string[];
  image?: string;
  href: string;
}

export interface WorkItem extends BaseItem {
  type: "work";
  client: string;
  disciplines: string[];
  industry: string;
  year: number;
  metric?: string;
}

export interface ServiceItem extends BaseItem {
  type: "service";
  category: "Strategy" | "Creative" | "Technology" | "Media";
}

export interface IndustryItem extends BaseItem {
  type: "industry";
  sectors: string[];
}

export interface PersonItem extends BaseItem {
  type: "person";
  role: string;
  discipline: string;
  location?: string;
}

export interface IdeaItem extends BaseItem {
  type: "idea";
  format: "Article" | "Report" | "Podcast";
  readTime?: number;
  date: string;
}

export type UniverseItem =
  | WorkItem
  | ServiceItem
  | IndustryItem
  | PersonItem
  | IdeaItem;

export interface MatchSpan {
  field: "title" | "excerpt" | "tags";
  start: number;
  end: number;
}

export interface ScoredResult {
  item: UniverseItem;
  score: number;
  spans: MatchSpan[];
}

export interface SearchResponse {
  query: string;
  total: number;
  countsByType: Record<ResultType, number>;
  results: ScoredResult[];
  didYouMean?: string;
  related: {
    topics: string[];
    people: PersonItem[];
    work: WorkItem[];
  };
  answer?: {
    text: string;
    sources: UniverseItem[];
  };
}

export const TYPE_LABEL: Record<ResultType, string> = {
  work: "Work",
  service: "Service",
  industry: "Industry",
  person: "Person",
  idea: "Idea",
};
