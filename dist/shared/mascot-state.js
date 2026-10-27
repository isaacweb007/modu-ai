// Presentation only: poses never change an order, booking, or payment state.
export function messageMood(message){
  if(!message||message.role!=='assistant')return 'greeting';
  if(['orderSent','bookingSent','orderReady','reviewOrder','tablePrompt','deliveryPrompt'].includes(message.key))return 'order';
  if(['menu','cart','fulfillment','order-review','orders','order-sources','reservation','bookings','payment'].includes(message.card))return 'order';
  if(message.answer||['brief','inventory','staff','tax','store-info'].includes(message.card))return 'thinking';
  return 'greeting';
}

export function currentMood(messages,{pending=false,dashboard=false}={}){
  if(pending||dashboard)return 'thinking';
  return messageMood(messages.findLast(m=>m.role==='assistant'));
}
