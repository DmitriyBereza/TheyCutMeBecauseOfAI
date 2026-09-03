import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TheyCutMeBecauseOfAI — Big Company Layoff Tracker 2024-2026",
  description: "Tracker of 10k+ employee companies with layoffs in last 2 years. Add your story per wave."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <div className="header">
            <a href="/" className="logo">TheyCutMeBecauseOfAI</a>
            <div className="muted">2024 → 2026 • 10k+ employee companies • crowdsourced stories</div>
          </div>
          {children}
          <div className="footer">
            Data is directional from public trackers (Layoffs.fyi, Crunchbase, WorkforceSignal, LayoffHedge) + company filings.
            Verify before citing. AI-flag means AI/automation cited, not proven cause.
            {" "}<a href="https://layoffs.fyi/">layoffs.fyi</a> • <a href="https://news.crunchbase.com/startups/tech-layoffs/">Crunchbase</a> • <a href="https://workforcesignal.com/layoff-tracker">WorkforceSignal</a>
          </div>
        </div>
      </body>
    </html>
  );
}
