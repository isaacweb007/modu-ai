import {UI} from './copy.js?v=5.1.0';import {MENU} from './menu.js?v=5.1.0';import {money} from './core.js?v=5.1.0';
export const QUESTIONS=['qRecommend','qIngredients','qSpicy','qStory','qHours','qComplaint','qPayment'];
export const REPLIES={qRecommend:'replyRecommend',qIngredients:'replyIngredients',qSpicy:'replySpicy',qStory:'replyStory',qHours:'replyHours',qComplaint:'replyComplaint',qPayment:'replyPayment'};
const normalize=t=>t.toLowerCase().replace(/[?？.!。!។]/g,'').replace(/\s+/g,' ').trim();
const exact=new Map(Object.values(UI).flatMap(ui=>QUESTIONS.map(k=>[normalize(ui[k]),REPLIES[k]])));
export const unrelatedRequest=text=>/\b(ignore|python|javascript|bitcoin|president|homework|weather|coding|movie|movies|stock|openai)\b|system prompt|api.?key|파이썬|코딩|주식|대통령|숙제|프롬프트|정치|시스템|무시|영화|시를|날씨|bài tập|chính trị|股票|编程|忽略|宿題|政治|cuaca|कोड|राजनीति/.test(normalize(text));
export function classify(text){const s=normalize(text);if(exact.has(s))return exact.get(s);
 if(unrelatedRequest(text))return 'offTopic';
 if(/너무 늦|불만|불편|음식.*차가|음식.*차갑|주문.*잘못|\b(complaint|complain)\b|food.*(late|cold|wrong)|order.*(late|wrong)|taking too long|chờ lâu|món.*lạnh|phàn nàn|投诉|等得太久|苦情|料理.*来ません|keluhan|makanan.*(dingin|terlambat)|យឺត|ຊ້າ|शिकायत/.test(s))return 'replyComplaint';
 if(/재료|알레르|성분|땅콩|새우|\b(ingredient|ingredients|allergy|allergies|peanuts|gluten)\b|nguyên liệu|dị ứng|原料|材料|过敏|アレルギー|bahan|alergi|គ្រឿងផ្សំ|ແພ້|सामग्री|एलर्जी/.test(s))return 'replyIngredients';
 if(/맵|\b(spicy|heat)\b|cay|辣|辛|pedas|ហឹរ|ເຜັດ|तीखा/.test(s))return 'replySpicy';
 if(/결제|계산|\b(pay|bill|payment)\b|thanh toán|支付|付款|支払|会計|bayar|ទូទាត់|ຈ່າຍ|भुगतान/.test(s))return 'replyPayment';
 if(/전화|연락처|이메일|sns|website|contact|phone|email|điện thoại|liên hệ|电话|网站|連絡|電話|kontak|telepon|संपर्क|फोन/.test(s))return 'replyContact';
 if(/주소|위치|영업시간|주차|\b(hours|address|parking)\b|where are you|when.*open|địa chỉ|mở cửa|ở đâu|地址|营业|営業時間|場所|lokasi|alamat|buka|ទីតាំង|ເປີດ|पता/.test(s))return 'replyHours';
 if(/메뉴.*추천|추천.*메뉴|둘이|recommend.*(dish|food|meal)|gợi ý.*món|hai người|推荐.*菜|おすすめ|rekomendasi.*(menu|makan)|ណែនាំ|ແນະນຳ|सुझा/.test(s))return 'replyRecommend';
 if(/어떤 샵|샵 소개|jumo.*story|tell me about jumo|câu chuyện|店.*介绍|紹介|cerita.*jumo|រឿង|ເລື່ອງ|कहानी/.test(s))return 'replyStory';
 if(/주모|jumo|\b(menu|restaurant|plate|chocolate)\b|메뉴|샵|주문|quán|店|注文|restoran|ហាង|ຮ້ານ|रेस्तरां|मेन्यू/.test(s))return 'unknown';
 return 'offTopic';}
const aliases={m01:['김치전','kimchi jeon','kimchi pancake','泡菜饼'],m04:['모둠전','assortment','thập cẩm','盛り合わせ','拼盘'],m05:['삼합','samhap','three-way'],m12:['한치','dried squid','mực khô','鱿鱼干','干しイカ'],m13:['뻥튀기','puffed rice'],m15:['김부각','gim bugak'],m16:['홍시','persimmon'],m17:['양갱','yanggaeng','chestnut']};
function findItem(text,items=MENU){const s=text.toLowerCase();return items.find(x=>[...Object.values(x.name),...(aliases[x.id]||[])].some(n=>s.includes(n.toLowerCase())))}
export function resolveAnswer(text,question,state,lang){let key=REPLIES[question]||classify(text),data=null;const items=state.items||MENU;
 if(key==='replyContact'){key='storeContact';data={name:state.store.name,phone:state.store.phone,email:state.store.email,website:state.store.website};}
 if(key==='replyIngredients'){const item=question==='qIngredients'||exact.get(normalize(text))==='replyIngredients'?(items.find(x=>x.id==='m04')||items[0]):findItem(text,items);if(item){key='menuItem';data={itemId:item.id,name:item.name,description:item.description,price:state.menu[item.id]?.price??item.price}}else key='allergyNote';}
 if(key==='replyRecommend'&&state.items){const item=items.find(x=>x.available!==false);if(item){key='menuItem';data={itemId:item.id,name:item.name,description:item.description,price:item.price};}else key='unknown';}
 if(key==='replyStory'&&state.items){key='storeAddress';data={name:state.store.name,address:state.store.address};}
 if(key==='replyRecommend'){if(state.menu.m04?.available===false||state.menu.m15?.available===false){const item=MENU.find(x=>state.menu[x.id]?.available!==false);if(item){key='menuItem';data={itemId:item.id,name:item.name,description:item.description,price:state.menu[item.id]?.price??item.price}}else key='unknown';}}
 if(key==='replyHours'&&state.store.address){key='storeAddress';data={address:state.store.address,name:state.store.name};}
 return {key,data};}
export function answerText(message,lang){const ui=UI[lang],data=message.answerData;
 if(message.key==='menuItem'&&data){const item=data.name?data:MENU.find(x=>x.id===data.itemId);if(!item)return ui.unknown;return `${item.name[lang]}\n${item.description[lang]}\n${money(data.price)}\n\n${ui.allergyNote}`;}
 if(message.key==='storeContact'&&data)return [data.name,...['phone','email','website'].filter(k=>data[k]).map(k=>`${ui[k]}: ${data[k]}`),ui.unknown].join('\n');
 if(message.key==='storeAddress'&&data)return `${data.name}\n${ui.address}: ${data.address}\n\n${ui.unknown}`;
 return ui[message.key]||ui.unknown;}
export function storeGreeting(lang,name){return UI[lang].hello.replace(/주모|Jumo|JUMO|ジュモ|जुमो|ជូម៉ូ|ຈູໂມ/g,name);}
