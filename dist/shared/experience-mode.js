export function ownerSampleMode(role,search=''){
 const p=new URLSearchParams(search);
 return role==='owner'&&(p.get('preview')==='1'||(p.get('live')!=='1'&&!p.has('store')));
}
