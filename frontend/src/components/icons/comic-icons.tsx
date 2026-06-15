/** Hand-drawn comic ink icons — thick strokes, slight wobble, no generic AI look */
import { ComponentType, ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const ink = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ComicSvg({ size = 24, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden {...ink} {...props}>
      {children}
    </svg>
  );
}

export function IconSummarize({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <path d="M8 5h14c1.2 0 2 .9 2 2v18c0 1.1-.8 2-2 2H8c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z" />
      <path d="M10 11h12M10 16h9M10 21h11" />
      <path d="M22 5v4h4" strokeWidth={2} />
    </ComicSvg>
  );
}

export function IconClassify({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <path d="M6 10l10-5 10 5v12c0 1-.8 2-2 2H8c-1.2 0-2-1-2-2V10z" />
      <path d="M6 10l10 5 10-5" />
      <rect x="19" y="4" width="8" height="5" rx="1" fill="currentColor" stroke="none" />
      <path d="M20.5 7.2h4" stroke="#fff" strokeWidth={1.6} />
    </ComicSvg>
  );
}

export function IconPrioritize({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <path d="M16 6v16" />
      <path d="M11 11l5-5 5 5" />
      <path d="M8 24h16" strokeWidth={2.8} />
      <path d="M9 20v4M14 17v7M19 14v10M24 11v13" strokeWidth={2} />
    </ComicSvg>
  );
}

export function IconDeadlines({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <rect x="6" y="8" width="20" height="18" rx="2" />
      <path d="M6 14h20" />
      <path d="M11 5v5M21 5v5" />
      <circle cx="22" cy="22" r="5" fill="currentColor" stroke="none" />
      <path d="M22 19.5v3l2 1.5" stroke="#fff" strokeWidth={1.8} />
    </ComicSvg>
  );
}

export function IconOpportunities({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <circle cx="14" cy="14" r="8" />
      <path d="M20.5 20.5l6 6" strokeWidth={3} />
      <path
        d="M14 9.5l1.2 3.6h3.8l-3 2.2 1.1 3.5-3.1-2.3-3.1 2.3 1.1-3.5-3-2.2h3.8z"
        fill="currentColor"
        stroke="none"
      />
    </ComicSvg>
  );
}

export function IconAlerts({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <path d="M16 5c-5 0-7 4-7 8v5l-2 3h18l-2-3v-5c0-4-2-8-7-8z" />
      <path d="M13 24c0 1.7 1.3 3 3 3s3-1.3 3-3" />
      <path d="M16 12v5" strokeWidth={3} />
      <circle cx="16" cy="20" r="1.2" fill="currentColor" stroke="none" />
    </ComicSvg>
  );
}

export function IconOrganize({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <path d="M7 10h18v16H7z" />
      <path d="M7 10c0-2 2-4 4.5-4h9C23 6 25 8 25 10" />
      <path d="M11 16h10M11 20h8" />
      <path d="M5 14h3v12H5z" fill="currentColor" stroke="none" opacity={0.35} />
      <path d="M24 16h3v10h-3z" fill="currentColor" stroke="none" opacity={0.35} />
    </ComicSvg>
  );
}

export function IconGmail({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <rect x="4" y="9" width="24" height="16" rx="2" />
      <path d="M4 11l12 9 12-9" />
      <path d="M4 25l7-8M28 25l-7-8" strokeWidth={2} />
    </ComicSvg>
  );
}

export function IconWhatsApp({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <path d="M6 26l2.5-7.5C5 16 5 11.5 8.5 8S16 4 20 6.5 26 13 24.5 17.5 20 26 16 27c-1.4.1-3.5-.4-5.5-1.5z" />
      <path d="M11.5 14.5c.8 2 2.8 4 5 4.5" strokeWidth={2} />
      <path d="M12 12.5c2.5-.5 5.5.5 7 3" strokeWidth={1.8} opacity={0.5} />
    </ComicSvg>
  );
}

export function IconInbox({ size = 24, ...props }: IconProps) {
  return (
    <ComicSvg size={size} {...props}>
      <path d="M8 6h16l2 6v14H6V12l2-6z" />
      <path d="M8 6l8 8 8-8" />
    </ComicSvg>
  );
}

const INTEL_ICON_MAP: Record<string, ComponentType<IconProps>> = {
  Summarize: IconSummarize,
  Classify: IconClassify,
  Prioritize: IconPrioritize,
  "Extract Deadlines": IconDeadlines,
  "Detect Opportunities": IconOpportunities,
  "Smart Alerts": IconAlerts,
  "Organize Study Material": IconOrganize,
};

export function IntelFunctionIcon({ id, size = 28, ...props }: IconProps & { id: string }) {
  const Icon = INTEL_ICON_MAP[id] ?? IconSummarize;
  return <Icon size={size} {...props} />;
}

export function sourceChannelIcon(from: string, size = 16) {
  const lower = from.toLowerCase();
  if (lower.includes("gmail") || lower.includes("email")) return <IconGmail size={size} />;
  if (lower.includes("whatsapp")) return <IconWhatsApp size={size} />;
  return <IconInbox size={size} />;
}
