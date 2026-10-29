// Track only request IDs and states. The current authorized snapshot supplies all displayed details.
export function createCounterTracker(role,visitId=()=>null){
 let initialized=false,seen=new Map();
 return {
  reset(){initialized=false;seen.clear();},
  scan(state){
   const changes=[];
   for(const a of state?.amendments||[]){
    if(!a.parent_amendment_id)continue;
    if(role==='guest'&&a.visit_id!==visitId())continue;
    const kind=a.target_type==='booking'?'reservations':'orders';
    if(role==='kitchen'&&kind!=='orders')continue;
    const records=kind==='reservations'?(state.reservations||state.bookings||[]):(state.orders||[]);
    if(!records.some(r=>r.id===a.target_id))continue;
    const prior=seen.get(a.id),isNew=!seen.has(a.id);
    if(initialized){
     if((role==='owner'||role==='floor')&&isNew&&a.status==='pending'&&!a.proposal_status)changes.push({key:`counter:${a.id}:requested`,kind,id:a.target_id,amendmentId:a.id,type:'counterRequested'});
     if((role==='guest'||role==='kitchen')&&a.status==='approved'&&(isNew||prior!=='approved'))changes.push({key:`counter:${a.id}:approved`,kind,id:a.target_id,amendmentId:a.id,type:'counterApproved'});
    }
    seen.set(a.id,a.status);
   }
   initialized=true;
   return changes;
  }
 };
}
export function currentCounterNotice(n,state,role,visitId=null){
 const a=(state?.amendments||[]).find(x=>x.id===n.amendmentId);
 if(!a||!a.parent_amendment_id)return null;
 if(role==='guest'&&a.visit_id!==visitId)return null;
 if(n.type==='counterRequested'&&(a.status!=='pending'||a.proposal_status))return null;
 if(n.type==='counterApproved'&&a.status!=='approved')return null;
 const rows=n.kind==='reservations'?(state.reservations||state.bookings||[]):(state.orders||[]);
 return rows.some(r=>r.id===n.id)?a:null;
}
export function counterSummary(a,lang){const d=a?.after_data;if(d?.lines)return d.lines.map(x=>`${x.name?.[lang]||x.name?.ko||x.itemId} × ${x.quantity}`).join(' · ');if(d?.date)return `${d.date} ${String(d.time).slice(0,5)} · ${d.partySize}`;return '';}
