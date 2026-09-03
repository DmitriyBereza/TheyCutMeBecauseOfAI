import { getCompany, getCompanies } from "@/lib/data";
import CommentsWall from "@/components/CommentsWall";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getCompanies().map((c) => ({ slug: c.slug }));
}

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const c = getCompany(params.slug);
  if (!c) return notFound();
  const total = c.layoffs.reduce((a, e) => a + e.number_cut, 0);

  return (
    <main>
      <a href="/">← all companies</a>
      <h1 style={{marginBottom:4}}>{c.name}</h1>
      <div className="muted">{c.sector} • {c.hq} • ~{c.employees_start_2025_approx.toLocaleString()} employees (start 2025, {c.employees_source}) • <a href={c.website} target="_blank">{c.website}</a></div>
      <div className="row">
        <div className="kpi"><div className="muted">Total cut tracked</div><div className="stat" style={{color:"#f87171"}}>{total.toLocaleString()}</div></div>
        <div className="kpi"><div className="muted">Share of headcount (rough)</div><div className="stat">{((total / c.employees_start_2025_approx)*100).toFixed(1)}%</div></div>
        <div className="kpi"><div className="muted">Waves</div><div className="stat">{c.layoffs.length}</div></div>
      </div>

      <h2>Waves of layoffs</h2>
      <table>
        <thead><tr><th>Date</th><th>Cut</th><th>%</th><th>Reason</th><th>AI?</th><th>Source</th></tr></thead>
        <tbody>
          {c.layoffs.slice().sort((a,b)=>b.date.localeCompare(a.date)).map((e,i)=>(
            <tr key={i}>
              <td>{e.date}</td>
              <td><b>{e.number_cut.toLocaleString()}</b></td>
              <td>{e.percent_of_workforce ?? "—"}%</td>
              <td>{e.reason_cited}{e.ai_evidence ? <><br/><span className="muted">AI note: {e.ai_evidence}</span></> : null}</td>
              <td>{e.ai_related ? "yes" : "no"}</td>
              <td><a href={e.source_url} target="_blank">{e.source_label}</a></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{marginTop:32}}>Were you affected at {c.name}? Tell your story</h2>
      <p className="muted">Per-company wall. Be kind, no names of private individuals, no internal docs. Moderation: Supabase RLS + report button in v2.</p>
      <CommentsWall companySlug={c.slug} />
    </main>
  );
}
