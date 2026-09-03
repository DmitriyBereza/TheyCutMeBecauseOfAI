"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

type Comment = {
  id: string;
  company_slug: string;
  nickname: string;
  role?: string;
  wave_date?: string;
  body: string;
  created_at: string;
};

export default function CommentsWall({ companySlug }: { companySlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState("");
  const [wave, setWave] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  const storageKey = `tcmbai-comments-${companySlug}`;

  useEffect(() => {
    async function load() {
      const sb = getSupabase();
      if (sb) {
        const { data } = await sb
          .from("comments")
          .select("*")
          .eq("company_slug", companySlug)
          .order("created_at", { ascending: false })
          .limit(100);
        if (data) setComments(data as Comment[]);
      } else {
        try {
          const raw = localStorage.getItem(storageKey);
          if (raw) setComments(JSON.parse(raw));
        } catch {}
      }
    }
    load();
  }, [companySlug, storageKey]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim() || !body.trim()) { setStatus("Nickname + story required."); return; }
    if (body.length < 10) { setStatus("Tell a bit more (10+ chars)."); return; }
    setStatus("Posting…");
    const entry: Comment = {
      id: Math.random().toString(36).slice(2),
      company_slug: companySlug,
      nickname: nickname.trim().slice(0,40),
      role: role.trim().slice(0,80),
      wave_date: wave.trim(),
      body: body.trim().slice(0,2000),
      created_at: new Date().toISOString(),
    };
    const sb = getSupabase();
    if (sb) {
      const { error } = await sb.from("comments").insert({
        company_slug: entry.company_slug,
        nickname: entry.nickname,
        role: entry.role,
        wave_date: entry.wave_date || null,
        body: entry.body,
      });
      if (error) { setStatus("Supabase error: " + error.message + " — saved locally instead."); }
      else { setStatus("Posted. Thanks for sharing."); }
    } else {
      setStatus("Posted locally (Supabase not configured).");
    }
    const next = [entry, ...comments].slice(0,100);
    setComments(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
    setBody("");
  }

  return (
    <div>
      <form onSubmit={submit} className="card">
        <input placeholder="Nickname (e.g. ex-PM, anon2025)" value={nickname} onChange={(e)=>setNickname(e.target.value)} />
        <div style={{display:"flex", gap:8}}>
          <input placeholder="Role / team (optional)" value={role} onChange={(e)=>setRole(e.target.value)} />
          <input placeholder="Wave date YYYY-MM-DD (optional)" value={wave} onChange={(e)=>setWave(e.target.value)} />
        </div>
        <textarea placeholder="What happened? Were you told it was AI / efficiency / restructuring? What would you tell others?" rows={4} value={body} onChange={(e)=>setBody(e.target.value)} />
        <button type="submit">Share story</button>
        {status && <div className="muted" style={{marginTop:8}}>{status}</div>}
      </form>
      <div style={{marginTop:16}}>
        {comments.length===0 && <p className="muted">No stories yet. Be the first.</p>}
        {comments.map((cm)=>(
          <div key={cm.id} className="comment">
            <b>{cm.nickname}</b> {cm.role && <span className="muted">• {cm.role}</span>} {cm.wave_date && <span className="badge">wave {cm.wave_date}</span>}
            <div className="muted" style={{fontSize:12}}>{new Date(cm.created_at).toLocaleString()}</div>
            <div style={{marginTop:6, whiteSpace:"pre-wrap"}}>{cm.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
