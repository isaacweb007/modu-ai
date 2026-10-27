// Korean is the default entry language. Explicit language links remain shareable.
export const LANGS={ko:'한국어',en:'English',vi:'Tiếng Việt',zh:'中文',ja:'日本語',km:'ភាសាខ្មែរ',id:'Bahasa Indonesia',lo:'ພາສາລາວ',hi:'हिन्दी'};
export const LOCALES={ko:'ko-KR',en:'en-US',vi:'vi-VN',zh:'zh-CN',ja:'ja-JP',km:'km-KH',id:'id-ID',lo:'lo-LA',hi:'hi-IN'};
export function resolveLang(search=''){const requested=new URLSearchParams(search).get('lang');return Object.hasOwn(LANGS,requested)?requested:'ko';}
export const getLang=()=>resolveLang(typeof location==='undefined'?'':location.search);
export const localeFor=lang=>LOCALES[lang]||LOCALES.ko;
export const formatNumber=(value,lang=getLang())=>new Intl.NumberFormat(localeFor(lang)).format(Number(value));
// Language changes presentation, never the shop's currency or price.
export const formatMoney=(value,lang=getLang())=>new Intl.NumberFormat(localeFor(lang),{style:'currency',currency:'VND',maximumFractionDigits:0}).format(Number(value));
export function formatDateTime(value,lang=getLang()){const date=new Date(value);return Number.isNaN(+date)?String(value):new Intl.DateTimeFormat(localeFor(lang),{dateStyle:'medium',timeStyle:'short'}).format(date);}
export function formatBooking(date,time,lang=getLang()){
 const value=new Date(`${date}T${time}:00Z`);if(Number.isNaN(+value))return `${date} ${time}`;
 // A reservation is a wall-clock time at the shop, not a UTC instant.
 return new Intl.DateTimeFormat(localeFor(lang),{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'}).format(value);
}
export function countryName(code,lang=getLang()){if(!/^[A-Z]{2}$/.test(code||''))return code;try{return new Intl.DisplayNames([localeFor(lang)],{type:'region'}).of(code);}catch{return code;}}
const tables={ko:'{n}번 테이블',en:'Table {n}',vi:'Bàn {n}',zh:'{n}号桌',ja:'{n}番テーブル',km:'តុលេខ {n}',id:'Meja {n}',lo:'ໂຕະ {n}',hi:'टेबल {n}'};
const parties={ko:'{n}명',en:'{n} guests',vi:'{n} khách',zh:'{n}位',ja:'{n}名様',km:'{n} នាក់',id:'{n} orang',lo:'{n} ຄົນ',hi:'{n} मेहमान'};
export const tableLabel=(n,lang=getLang())=>(tables[lang]||tables.ko).replace('{n}',formatNumber(n,lang));
export const partyLabel=(n,lang=getLang())=>(lang==='en'&&Number(n)===1?'1 guest':(parties[lang]||parties.ko).replace('{n}',formatNumber(n,lang)));
