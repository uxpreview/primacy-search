export type View = "ask" | "services" | "work" | "insights" | "about" | "contact";

export interface NavTab {
  label: string;
  view: View;
}

export const navTabs: NavTab[] = [
  { label: "Ask", view: "ask" },
  { label: "Services", view: "services" },
  { label: "Work", view: "work" },
  { label: "Insights", view: "insights" },
  { label: "About", view: "about" },
  { label: "Contact", view: "contact" },
];
