type IconProps = { className?: string };
const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconSpark({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.5c.6 2 .9 2.3 2.9 3 .1 0 .1.9 0 1-2 .7-2.3 1-3 3-.1.1-.9.1-1 0-.7-2-1-2.3-3-3-.1-.1-.1-.9 0-1 2-.7 2.3-1 3-3z" />
    </svg>
  );
}
export function IconSeo({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m20 20-4.5-4.5" />
      <path d="M8 11.5l1.8 1.8L13 9.5" />
    </svg>
  );
}
export function IconContent({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M7 3.5h7L19 8v12a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 7 20z" />
      <path d="M13.5 3.5V8H19" />
      <path d="M9.5 13h6M9.5 16.5h6" />
    </svg>
  );
}
export function IconBrand({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.8 9.2-1.6 4-4 1.6 1.6-4z" />
    </svg>
  );
}
export function IconWeb({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9h17" />
      <path d="M6.5 6.7h.01M9 6.7h.01" />
    </svg>
  );
}
export function IconPulse({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 12h4l2-5 3 9 2-4h6" />
    </svg>
  );
}
export function IconFolderPlus({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7a1 1 0 0 1 1-1h3.6l1.8 2H19a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M12 11.5v4M10 13.5h4" />
    </svg>
  );
}
export function IconGrid({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  );
}
export function IconAccessibility({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="7.7" r="1.1" fill="currentColor" stroke="none" />
      <path d="M7.8 10.4h8.4M12 10.4v3.8M9.7 18 12 14.2l2.3 3.8" />
    </svg>
  );
}
export function IconArrowUp({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}
export function IconArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export const AGENT_ICONS = {
  spark: IconSpark,
  seo: IconSeo,
  content: IconContent,
  brand: IconBrand,
  web: IconWeb,
  pulse: IconPulse,
  folderPlus: IconFolderPlus,
  grid: IconGrid,
  accessibility: IconAccessibility,
} as const;

export type AgentIconKey = keyof typeof AGENT_ICONS;
