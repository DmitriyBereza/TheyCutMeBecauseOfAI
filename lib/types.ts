export type LayoffEvent = {
  date: string;
  number_cut: number;
  percent_of_workforce?: number | null;
  reason_cited?: string;
  ai_related: boolean;
  ai_evidence?: string;
  source_label: string;
  source_url: string;
};

export type Company = {
  slug: string;
  name: string;
  sector: string;
  hq?: string;
  employees_start_2025_approx: number;
  employees_source?: string;
  website?: string;
  layoffs: LayoffEvent[];
};

export const SCOPE_NOTE =
  "Scope v1: companies with ~10k+ employees at start of 2025, with >=1 layoff round of 500+ between 2024-01-01 and 2026-09-01. Numbers vary by tracker (Layoffs.fyi, Crunchbase, company filings). Treat as directional, not audited. AI-related flag = company explicitly cited AI/efficiency/automation OR credible press reported it.";
