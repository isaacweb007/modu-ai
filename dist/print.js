import {getLang} from './shared/locale.js?v=5.5.0';
const url=new URL('jumo/print.html',location.href),params=new URLSearchParams(location.search);
for(const key of ['table','channel','sample'])if(params.has(key))url.searchParams.set(key,params.get(key));
url.searchParams.set('lang',getLang());
if(/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(params.get('store')||''))url.searchParams.set('store',params.get('store'));else url.searchParams.set('preview','1');
location.replace(url.href);
