export function ownerSampleMode(role,search=''){
 const p=new URLSearchParams(search);
 return role==='owner'&&!p.has('store')&&(p.get('preview')==='1'||p.get('live')!=='1');
}
