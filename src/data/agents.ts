import type { AgentIconKey } from "@/components/ui/icons";

export interface Agent {
  id: string;
  label: string;
  icon: AgentIconKey;
  query: string;
}

export const agents: Agent[] = [
  { id: "healthcare", label: "Healthcare Growth", icon: "pulse", query: "work in healthcare" },
  { id: "vision", label: "Vision Creation", icon: "spark", query: "vision creation brand" },
  { id: "seo", label: "SEO Evaluation", icon: "seo", query: "seo performance marketing" },
  { id: "content", label: "Content Audit", icon: "content", query: "content strategy" },
  { id: "brand", label: "Brand Strategy", icon: "brand", query: "brand strategy" },
  { id: "web", label: "UX & Web Design", icon: "web", query: "experience design" },
];

// Agents surfaced from the search composer's "+" menu.
export const menuAgents: Agent[] = [
  { id: "website-audit", label: "Website audit", icon: "web", query: "website audit" },
  { id: "start-project", label: "Start a project", icon: "folderPlus", query: "start a project" },
  { id: "find-work", label: "Find relevant work", icon: "grid", query: "relevant work" },
  { id: "insights-finder", label: "Insights finder", icon: "pulse", query: "insights" },
  { id: "accessibility", label: "Accessibility checker", icon: "accessibility", query: "accessibility" },
  { id: "seo-geo", label: "SEO/GEO evaluation", icon: "seo", query: "seo geo evaluation" },
];
