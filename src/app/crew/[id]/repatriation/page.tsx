"use client";

import React, { useState } from 'react';

export default function RepatriationPage({ params }: { params: { id: string } }){
  const crewId = params.id;
  const [form, setForm] = useState({ repatriationDate:'', reason:'', finalAccount:0, processedBy:'', remarks:'' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(){
    setError(null);
    try{
      const res = await fetch('/api/crew/' + crewId + '/repatriation', {
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
      <h1>Repatriation - Crew {crewId}</h1>
      {error && <div style={{color:'red'}}>{error}</div>}
      {saved && <div style={{color:'green'}}>Saved</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,maxWidth:800}}>
        <div>
          <label>Repatriation Date</label>
          <input type="date" value={form.repatriationDate} onChange={(e)=>setForm({...form,repatriationDate:e.target.value})} />
        </div>
        <div>
          <label>Final Account</label>
          <input type="number" value={form.finalAccount} onChange={(e)=>setForm({...form,finalAccount:parseFloat(e.target.value||'0')})} />
        </div>
        <div style={{gridColumn:'1 / -1'}}>
          <label>Reason</label>
          <textarea value={form.reason} onChange={(e)=>setForm({...form,reason:e.target.value})} rows={4} />
        </div>
        <div>
          <label>Processed By</label>
          <input value={form.processedBy} onChange={(e)=>setForm({...form,processedBy:e.target.value})} />
        </div>
        <div style={{gridColumn:'1 / -1'}}>
          <label>Remarks</label>
          <textarea value={form.remarks} onChange={(e)=>setForm({...form,remarks:e.target.value})} rows={3} />
        </div>
      </div>
      <div style={{marginTop:12}}>
        <button onClick={submit}>Save Repatriation</button>
      </div>
    </div>
  );
}
