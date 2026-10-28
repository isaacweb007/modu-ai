import {hashPassword} from './passwords.js';
import {storeData,menuData,workspaceData} from './validation.js';

// This endpoint creates a fresh, expiring shop. It never grants access to an existing shop.
export function connectedDemoRoute({admin,checked,hash,token,limit,json,reply}:any){
 return async(req:Request,ipKey:string)=>{
  await limit('create:'+ipKey,5,3600);
  await limit('connected-demo-global',100,3600);
  const b=await json(req),owner=token(),floor=token(),kitchen=token();
  const workspace=workspaceData(b.workspace);
  workspace.manager={...workspace.manager,profileName:'Jumo',stage:'ready',completed:true};
  const shop=storeData({...b.store,name:'주모 · JUMO',country:'VN'});
  const menu=menuData(b.menu);
  const password=await hashPassword(token());
  const room=checked(await admin.rpc('modu_create_connected_demo',{
   p_store:shop,p_menu:menu,p_workspace:workspace,p_password:password,
   p_legacy_hash:await hash(token()),p_owner_hash:await hash(owner),p_floor_hash:await hash(floor),p_kitchen_hash:await hash(kitchen)
  }));
  return reply({...room,owner:{storeId:room.storeId,token:owner,expiresAt:room.expiresAt},floor:{...room.floor,token:floor},kitchen:{...room.kitchen,token:kitchen}},201);
 };
}
