import {hashPassword,verifyPassword} from './passwords.js';
// All entry points use a server-only client. Passwords never leave the request handler.
export function ownerAuthRoutes({admin,checked,fail,hash,token,limit,json,reply}:any){
 const secretHash=async(req:Request)=>{const raw=req.headers.get('x-modu-token')||'';if(!/^[a-f0-9]{64}$/.test(raw))return null;return hash(raw);};
 const passwordRecord=async(id:string)=>checked(await admin.from('modu_owner_passwords').select('salt,digest,iterations,revision').eq('store_id',id).maybeSingle());
 const sessionValid=async(id:string,h:string)=>!!h&&checked(await admin.rpc('modu_owner_session_valid',{p_store:id,p_hash:h}));
 return async(req:Request,id:string,item:string,ipKey:string,st:any)=>{
  const h=await secretHash(req);
  if(req.method==='GET'&&!item){
   if(await sessionValid(id,h))return reply({mode:'session',storeId:id,name:st.public_data.name,...(st.demo_expires_at?{demo:true,expiresAt:st.demo_expires_at}:{})});
   const configured=!!(await passwordRecord(id));let setup=false;
   if(!configured&&h)setup=!!checked(await admin.from('modu_owners').select('store_id').eq('store_id',id).eq('token_hash',h).maybeSingle());
   return reply({mode:setup?'setup':'login',storeId:id,name:st.public_data.name});
  }
  if(req.method!=='POST')fail('invalid',404);
  if(item==='logout'){if(!h)fail('ownerAccess',401);checked(await admin.rpc('modu_owner_logout',{p_store:id,p_hash:h}));return reply({ok:true});}
  await limit('password-ip:'+ipKey,30,600);await limit('password-shop:'+id,40,600);
  const b=await json(req),record=await passwordRecord(id);let expiresAt,session=token();
  if(item==='login'){
   if(!await verifyPassword(b.password,record))fail('invalidPassword',401);
   expiresAt=checked(await admin.rpc('modu_owner_login_session',{p_store:id,p_revision:record.revision,p_session_hash:await hash(session)}));
  }else if(item==='setup'){
   if(!h||record)fail('ownerAccess',403);
   const legacy=checked(await admin.from('modu_owners').select('store_id').eq('store_id',id).eq('token_hash',h).maybeSingle());if(!legacy)fail('ownerAccess',403);
   const password=await hashPassword(b.password);
   expiresAt=checked(await admin.rpc('modu_owner_password_setup',{p_store:id,p_legacy_hash:h,p_password:password,p_session_hash:await hash(session)}));
  }else if(item==='password'){
   if(!await sessionValid(id,h))fail('ownerAccess',401);
   if(!await verifyPassword(b.currentPassword,record))fail('invalidPassword',401);
   const password=await hashPassword(b.password);
   expiresAt=checked(await admin.rpc('modu_owner_password_change',{p_store:id,p_hash:h,p_revision:record.revision,p_password:password,p_session_hash:await hash(session)}));
  }else fail('invalid',404);
  return reply({storeId:id,token:session,expiresAt});
 };
}
