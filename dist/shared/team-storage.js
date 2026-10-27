import {SAMPLE_STORAGE,createOwnerSample} from './owner-sample.js?v=5.6.0';
import {ensureTeam} from './team-state.js?v=5.8.0';
export {SAMPLE_STORAGE};
export function teamRead(key=SAMPLE_STORAGE){let s;try{s=JSON.parse(localStorage.getItem(key));}catch{}if(s?.version!==2||!Array.isArray(s.orders))s=createOwnerSample('ko');const fresh=s.teamVersion!==1;ensureTeam(s);if(fresh)localStorage.setItem(key,JSON.stringify(s));return s;}
export function teamWrite(s,key=SAMPLE_STORAGE){localStorage.setItem(key,JSON.stringify(s));window.dispatchEvent(new CustomEvent('one-shop-team',{detail:{key}}));if(key===SAMPLE_STORAGE)window.dispatchEvent(new Event('modu-state'));}
export function teamChange(fn,key=SAMPLE_STORAGE){const s=teamRead(key),result=fn(s);teamWrite(s,key);return result;}
