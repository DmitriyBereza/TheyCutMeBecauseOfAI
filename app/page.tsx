"use client";
import { useMemo, useState } from "react";
import { getCompanies, totals } from "@/lib/data";
import { SCOPE_NOTE } from "@/lib/types";

export default function Home() {
  const companies = useMemo(() => getCompanies(), []);
  const t = useMemo(() => totals(), []);
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("all");
  const [aiOnly, setAiOnly] = useState(false);
  const [sort, setSort] = useState<"cut_desc" | "pct_desc" | "name">("cut_desc");

  const sectors = useMemo(
    () => ["all", ...Array.from(new Set(companies.map((c) => c.sector)))],
    [companies]
  );

  const rows = useMemo(() => {
    let r = companies.map((c) => {
      const total = c.layoffs.reduce((a, e) => a + e.number_cut, 0);
      const pct = Math.max(...c.layoffs.map((e) => e.percent_of_workforce || 0));
      const ai = c.layoffs.some((e) => e.ai_related);
      const lastDate = c.layoffs.map((e) => e.date).sort().reverse()[0];
      return { c, total, pct, ai, lastDate };
    });
    if (q) {
      const s = q.toLowerCase();
      r = r.filter(
        ({ c }) =>
          c.name.toLowerCase().includes(s) || c.sector.toLowerCase().includes(s)
      );
    }
    if (sector !== "all") r = r.filter(({ c }) => c.sector === sector);
    if (aiOnly) r = r.filter((x) => x.ai);
    if (sort === "cut_desc") r.sort((a, b) => b.total - a.total);
    if (sort === "pct_desc") r.sort((a, b) => b.pct - a.pct);
    if (sort === "name") r.sort((a, b) => a.c.name.localeCompare(b.c.name));
    return r;
  }, [companies, q, sector, aiOnly, sort]);

  return (
    <main>
      <h1 style={{ fontSize: 36, margin: "8px 0" }}>They cut me because of AI?</h1>
      <p className="muted">{SCOPE_NOTE}</p>

      <div className="row">
        <div className="kpi"><div className="muted">Companies tracked</div><div className="stat">{t.companies}</div></div>
        <div className="kpi"><div className="muted">Total roles cut (sum of waves)</div><div className="stat">{t.totalCut.toLocaleString()}</div></div>
        <div className="kpi"><div className="muted">In AI-flagged waves</div><div className="stat" style={{color:"#22d3ee"}}>{t.aiCut.toLocaleString()}</div></div>
      </div>

      <div className="toolbar">
        <input placeholder="Search company or sector…" value={q} onChange={(e)=>setQ(e.target.value)} style={{maxWidth:280}} />
        <select value={sector} onChange={(e)=>setSector(e.target.value)} style={{maxWidth:240}}>
          {sectors.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={(e)=>setSort(e.target as any)} style={{maxWidth:200}}>
          <option value="cut_desc">Sort: most cut</option>
          <option value="pct_desc">Sort: highest %</option>
          <option value="name">Sort: A-Z</option>
        </select>
        <label className="muted"><input type="checkbox" checked={aiOnly} onChange={(e)=>setAiOnly(e.target.checked)} style={{width:"auto"}} /> AI-flagged only</label>
      </div>

      <div className="grid">
        {rows.map(({c,total,pct,ai,lastDate})=>(
          <a key={c.slug} href={`/company/${c.slug}`} className="card" style={{color:"inherit"}}>
            <h3>{c.name}</h3>
            <div className="muted">{c.sector} • ~{c.employees_start_2025_approx.toLocaleString()} employees start-2025</div>
            <div style={{margin:"10px 0", display:"flex", gap:8, alignItems:"center"}}>
              <span className="stat" style={{fontSize:22, color:"#f87171"}}>{total.toLocaleString()}</span>
              <span className="muted">cut • max {pct}% • last {lastDate}</span>
            </div>
            <div>{ai ? <span className="badge ai">AI-cited</span> : <span className="badge">restructuring</span>} <span className="badge">{c.layoffs.length} wave{c.layoffs.length>1?"s":""}</span></div>
          </a>
        ))}
      </div>
      {rows.length===0 && <p className="muted">No matches.</p>}
    </main>
  );
}
