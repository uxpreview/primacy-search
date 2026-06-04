import type { IndustryItem } from "./types";

export const industries: IndustryItem[] = [
  {
    id: "ind-healthcare",
    type: "industry",
    title: "Healthcare",
    excerpt:
      "We help health systems earn trust and grow patient demand — from find-care experiences to brand after a merger.",
    tags: ["healthcare", "health systems", "patient experience", "providers", "telehealth"],
    sectors: ["Health Systems", "Academic Medicine", "Payers", "Digital Health"],
    href: "/industries/healthcare",
  },
  {
    id: "ind-higher-ed",
    type: "industry",
    title: "Higher Education",
    excerpt:
      "Enrollment marketing and story-led experiences that help institutions stand out and fill the class.",
    tags: ["higher education", "enrollment", "admissions", "universities", "students"],
    sectors: ["Universities", "Colleges", "Graduate", "Online Programs"],
    href: "/industries/higher-education",
  },
  {
    id: "ind-financial",
    type: "industry",
    title: "Financial Services",
    excerpt:
      "Modernizing banking, insurance, and wealth experiences to build confidence and drive revenue growth.",
    tags: ["financial services", "banking", "insurance", "wealth", "fintech"],
    sectors: ["Banking", "Insurance", "Wealth", "Credit Unions"],
    href: "/industries/financial-services",
  },
  {
    id: "ind-manufacturing",
    type: "industry",
    title: "Manufacturing",
    excerpt:
      "Omnichannel demand generation and recruitment that fills pipelines — for customers and for talent.",
    tags: ["manufacturing", "industrial", "recruitment", "b2b", "demand generation"],
    sectors: ["Industrial", "Building Products", "Distribution", "B2B"],
    href: "/industries/manufacturing",
  },
  {
    id: "ind-nonprofit",
    type: "industry",
    title: "Mission & Nonprofit",
    excerpt:
      "Brand and digital that move people to act — donors, members, and advocates for organizations with a mission.",
    tags: ["nonprofit", "mission", "fundraising", "advocacy", "membership"],
    sectors: ["Foundations", "Advocacy", "Associations", "Cultural"],
    href: "/industries/nonprofit",
  },
];
