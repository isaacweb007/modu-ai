const uuid=x=>/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(x||'');
const token=x=>/^[a-f0-9]{64}$/.test(x||'');
// The fragment carries a private visit capability and is erased before network calls.
export function consumeGuestContinuation(href,replace){const url=new URL(href),fragment=new URLSearchParams(url.hash.slice(1));if(!fragment.has('guest-access')&&!fragment.has('guest-visit'))return null;const secret=fragment.get('guest-access'),visitId=fragment.get('guest-visit'),storeId=url.searchParams.get('store');url.hash='';replace(url.href);if(!uuid(storeId)||!uuid(visitId)||!token(secret))throw Error('noAccess');return {storeId,visitId,token:secret};}
export function guestContinuationUrl(href,credential,lang){if(!uuid(credential?.storeId)||!uuid(credential?.visitId)||!token(credential?.token))throw Error('noAccess');const url=new URL(href);url.searchParams.set('store',credential.storeId);url.searchParams.set('lang',lang);url.hash=new URLSearchParams({'guest-access':credential.token,'guest-visit':credential.visitId}).toString();return url.href;}

// Several legacy modules import cloud.js with different cache versions. Capture once in this shared module.
let captured=false,continuation=null,captureError=null;
export function captureGuestContinuation(href,replace){if(!captured){captured=true;try{continuation=consumeGuestContinuation(href,replace);}catch(e){captureError=e;}}if(captureError)throw captureError;return continuation;}
