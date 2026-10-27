import {MENU} from './menu.js?v=5.5.0';
import {SAMPLE_COPY} from './owner-sample.js?v=5.5.0';
import {SAMPLE_ORIGINALS} from './sample-originals.js?v=5.5.0';
const units={ko:'인분',en:'servings',vi:'phần',zh:'份',ja:'人前',km:'ចំណែក',id:'porsi',lo:'ທີ່',hi:'सर्विंग'};
const teams={ko:['주방','홀'],en:['Kitchen','Dining room'],vi:['Bếp','Phục vụ'],zh:['后厨','前厅'],ja:['キッチン','ホール'],km:['ផ្នែកផ្ទះបាយ','ផ្នែកបម្រើភ្ញៀវ'],id:['Dapur','Ruang makan'],lo:['ຄົວ','ຝ່າຍບໍລິການ'],hi:['रसोई','सर्विस टीम']};
const media={ko:['주모 외관 시안','주모 실내 시안','주모 메뉴 이미지 시안'],en:['Jumo exterior concept','Jumo interior concept','Jumo menu image concept'],vi:['Ý tưởng mặt tiền Jumo','Ý tưởng không gian Jumo','Ảnh ý tưởng món ăn Jumo'],zh:['Jumo 外观概念图','Jumo 室内概念图','Jumo 菜品概念图'],ja:['ジュモの外観イメージ','ジュモの店内イメージ','ジュモの料理イメージ'],km:['រូបភាពគំនិតផ្នែកខាងក្រៅ Jumo','រូបភាពគំនិតផ្នែកខាងក្នុង Jumo','រូបភាពគំនិតម្ហូប Jumo'],id:['Konsep tampak luar Jumo','Konsep interior Jumo','Konsep foto menu Jumo'],lo:['ພາບແນວຄິດພາຍນອກ Jumo','ພາບແນວຄິດພາຍໃນ Jumo','ພາບແນວຄິດອາຫານ Jumo'],hi:['जुमो के बाहरी हिस्से की अवधारणा','जुमो के अंदरूनी हिस्से की अवधारणा','जुमो के व्यंजनों की अवधारणा']};
const sampleCopies=()=>Object.values(SAMPLE_COPY);
const unchanged=(value,legacy,current=[])=>[...legacy,...current].includes(value);
export function sampleAddress(s,lang){return s.sampleVersion&&unchanged(s.store.address,SAMPLE_ORIGINALS.address,sampleCopies().map(c=>c.sampleAddress))?SAMPLE_COPY[lang].sampleAddress:s.store.address;}
export function sampleInventory(row,s,lang){
 if(!s.sampleVersion)return row;
 const i=['sample-stock-1','sample-stock-2'].indexOf(row.id),item=MENU[i];
 if(!item)return row;
 return {...row,name:unchanged(row.name,SAMPLE_ORIGINALS.items[item.id],Object.values(item.name))?item.name[lang]:row.name,unit:unchanged(row.unit,[...Object.values(units),'परोस'])?units[lang]:row.unit};
}
export function sampleTask(row,s,lang){
 if(!s.sampleVersion)return row;
 const i=['sample-task-1','sample-task-2'].indexOf(row.id);if(i<0)return row;
 const key='sampleTask'+(i+1);
 return {...row,title:unchanged(row.title,SAMPLE_ORIGINALS.tasks[i],sampleCopies().map(c=>c[key]))?SAMPLE_COPY[lang][key]:row.title,assignee:unchanged(row.assignee,['Kitchen','Floor',...Object.values(teams).flat()])?teams[lang][i]:row.assignee};
}
export function sampleMediaName(row,lang){
 const i=['sample-exterior','sample-interior','sample-menu'].indexOf(row.id);
 return i>=0&&row.name===['Jumo exterior · concept','Jumo interior · concept','Jumo jeon · concept'][i]?media[lang][i]:row.name;
}
// Only known fixture text is re-localized. Owner edits and customer records remain verbatim.
export function sampleStateForDisplay(s,lang){
 if(!s.sampleVersion)return s;
 const translated=(item,field)=>{
  const reference=MENU.find(x=>x.id===item.id);if(!reference||!item[field])return item[field];
  const old=field==='name'?SAMPLE_ORIGINALS.items[item.id]:SAMPLE_ORIGINALS.descriptions[item.id];
  return Object.fromEntries(Object.entries(item[field]).map(([l,value])=>[l,unchanged(value,old,Object.values(reference[field]))?reference[field][l]:value]));
 };
 return {...s,store:{...s.store,address:sampleAddress(s,lang)},items:s.items?.map(x=>({...x,name:translated(x,'name'),description:translated(x,'description')})),orders:s.orders.map(o=>/^sample-order-[1-4]$/.test(o.id)?{...o,lines:o.lines.map(line=>({...line,name:translated({id:line.itemId,name:line.name},'name')}))}:o)};
}
