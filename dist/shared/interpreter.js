import {PHRASES} from './interpreter-phrases.js';
export {PHRASES};
export const SCENARIOS=Object.keys(PHRASES.ko);
const validLang=lang=>Object.hasOwn(PHRASES,lang);
// Match complete prepared phrases only: no substring guesses about allergies or quantities.
const normalize=value=>String(value??'').normalize('NFKC').toLocaleLowerCase().replace(/[\p{P}\p{Z}\s]/gu,'');
export function matchRequest(text,preferred='ko') {
 if(typeof text!=='string'||text.length>400)return null;
 const normalized=normalize(text);
 for(const lang of [preferred,...Object.keys(PHRASES).filter(l=>l!==preferred)]) {
  if(!validLang(lang))continue;
  for(const scenarioId of SCENARIOS){const p=PHRASES[lang][scenarioId];if([p.request,...p.aliases].some(s=>normalize(s)===normalized))return {scenarioId,lang};}
 }
 return null;
}
export function createInterpretation({scenarioId,lang,original,requestId},at=new Date().toISOString()) {
 if(!validLang(lang)||!SCENARIOS.includes(scenarioId)||!/^interp-[a-zA-Z0-9_-]{8,60}$/.test(requestId||''))throw Error('invalidInterpretation');
 const phrase=PHRASES[lang][scenarioId];
 if(typeof original!=='string'||original.length>400||![phrase.request,...phrase.aliases].some(s=>normalize(s)===normalize(original)))throw Error('unsupportedInterpretation');
 return {id:requestId,at,role:'user',text:original.trim(),interpretation:{direction:'guest',scenarioId,sourceLang:lang,original:original.trim(),ko:PHRASES.ko[scenarioId].request}};
}
export function createInterpretedReply(request,at=new Date().toISOString()) {
 const i=request?.interpretation;
 if(i?.direction!=='guest')throw Error('invalidInterpretation');
 createInterpretation({scenarioId:i.scenarioId,lang:i.sourceLang,original:i.original,requestId:request.id},request.at);
 return {id:'reply-'+request.id,at,role:'assistant',text:PHRASES[i.sourceLang][i.scenarioId].reply,interpretation:{direction:'owner',scenarioId:i.scenarioId,sourceLang:'ko',targetLang:i.sourceLang,original:PHRASES.ko[i.scenarioId].reply,translation:PHRASES[i.sourceLang][i.scenarioId].reply,replyTo:request.id}};
}
export function interpretationRows(state) {
 return (state.sessions||[]).flatMap(visit=>(visit.thread||[]).filter(m=>m.interpretation?.direction==='guest').map(message=>({message,visit,reply:visit.thread.find(m=>m.interpretation?.direction==='owner'&&m.interpretation.replyTo===message.id)}))).sort((a,b)=>b.message.at.localeCompare(a.message.at));
}
export function appendInterpretation(state,visitId,message) {
 const visit=state.sessions.find(v=>v.id===visitId);if(!visit)throw Error('invalidInterpretation');
 visit.thread??=[];const old=visit.thread.find(m=>m.id===message.id);if(old)return old;
 visit.thread.push({...message,seq:(visit.thread.at(-1)?.seq||visit.thread.length)+1});return message;
}
export function addInterpreterSample(state) {
 if(state.interpreterSampleVersion)return state;
 const visit=state.sessions.find(v=>v.id==='sample-visit-3');
 if(visit)appendInterpretation(state,visit.id,createInterpretation({scenarioId:'water',lang:'vi',original:PHRASES.vi.water.request,requestId:'interp-sample-water-01'}));
 state.interpreterSampleVersion=1;return state;
}
