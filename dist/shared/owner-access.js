// Local checks decide which UI to show; the server validates every operation.
export const shopId=value=>/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value||'');
export function readJson(storage,key){try{return JSON.parse(storage.getItem(key));}catch{return null;}}
export function ownerCredential(storage,id,now=Date.now()){const c=readJson(storage,'modu-owner-session:'+id);return shopId(id)&&c?.storeId===id&&/^[a-f0-9]{64}$/.test(c.token||'')&&Date.parse(c.expiresAt)>now?c:null;}
export function legacyOwnerCredential(storage,id){const c=readJson(storage,'modu-owner:'+id);return shopId(id)&&c?.storeId===id&&/^[a-f0-9]{64}$/.test(c.token||'')?c:null;}
export function ownerStoreAccess(search,storage){const p=new URLSearchParams(search);if(!p.has('store'))return {restricted:false,credential:null};const credential=ownerCredential(storage,p.get('store'));return {restricted:!credential,credential};}
export function clearOwnerCache(storage,id,expectedToken){if(!expectedToken||readJson(storage,'modu-owner-session:'+id)?.token===expectedToken)storage.removeItem('modu-owner-session:'+id);for(const key of ['modu-owner:','modu-cloud-owner:','modu-conflict-draft:'])storage.removeItem(key+id);}
export function parseShopLink(value){if(shopId(value))return value.toLowerCase();try{const id=new URL(value).searchParams.get('store');return shopId(id)?id.toLowerCase():null;}catch{return null;}}
