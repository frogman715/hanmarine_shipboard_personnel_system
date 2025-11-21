"use client";

import React, { useEffect, useState } from 'react';

export default function CrewEvaluationPage({ params }: { params: { id: string } }){
  const crewId = params.id;
  const [form, setForm] = useState({ evaluator:'', rank:'', score:0, comments:'' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(){
    setError(null);
    try{
      const res = await fetch('/api/crew/' + crewId + '/evaluation', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...form, crewId })
      });
      if(!res.ok) throw new Error('Failed to save');
      setSaved(true);
    }catch(err:any){ setError(err.message||'Error') }
  }

  return (
    <div style={{padding:20}}>
      <h1>Evaluation - Crew {crewId}</h1>
      {error && <div style={{color:'red'}}>{error}</div>}
      {saved && <div style={{color:'green'}}>Saved</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,maxWidth:800}}>
        <div>
          <label>Evaluator</label>
          <input value={form.evaluator} onChange={(e)=>setForm({...form,evaluator:e.target.value})} />
        </div>
        <div>
          <label>Rank</label>
          <input value={form.rank} onChange={(e)=>setForm({...form,rank:e.target.value})} />
        </div>
        <div>
          <label>Score (0-100)</label>
          <input type="number" value={form.score} onChange={(e)=>setForm({...form,score:parseInt(e.target.value||'0')})} />
        </div>
        <div style={{gridColumn:'1 / -1'}}>
          <label>Comments</label>
          <textarea value={form.comments} onChange={(e)=>setForm({...form,comments:e.target.value})} rows={6} />
        </div>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={submit}>Save Evaluation</button>
      </div>
    </div>
  );
}
