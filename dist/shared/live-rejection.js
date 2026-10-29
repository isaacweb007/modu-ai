import {reasonLabel,reasonMessage} from './rejection-copy.js?v=5.19.0';
import {AMENDMENT_COPY} from './amendment-copy.js?v=5.19.0';
import {LANGS} from './locale.js?v=5.6.0';
const operational={
 ko:['샵 운영 사정','샵의 운영 사정으로 이번 요청을 처리하기 어렵습니다. 도움이 필요하시면 직원에게 말씀해 주세요.'],
 en:['Shop operations','We cannot accommodate this request due to the shop’s current operating circumstances. Please speak to our staff if you need help.'],
 vi:['Điều kiện hoạt động của quán','Vì điều kiện hoạt động hiện tại, quán chưa thể đáp ứng yêu cầu này. Nếu cần hỗ trợ, bạn vui lòng trao đổi với nhân viên nhé.'],
 zh:['店铺运营原因','由于店铺目前的运营情况，暂时无法处理本次请求。如需帮助，请联系店员。'],
 ja:['店舗の運営上の都合','店舗の運営上の都合により、今回のご要望は承れません。お困りの場合はスタッフにお声がけください。'],
 km:['ស្ថានភាពប្រតិបត្តិការហាង','ដោយសារស្ថានភាពប្រតិបត្តិការរបស់ហាង យើងមិនអាចទទួលសំណើនេះបានទេ។ បើត្រូវការជំនួយ សូមប្រាប់បុគ្គលិក។'],
 id:['Kondisi operasional kedai','Karena kondisi operasional kedai saat ini, kami belum dapat memenuhi permintaan ini. Silakan hubungi staf jika membutuhkan bantuan.'],
 lo:['ສະຖານະການດຳເນີນງານຂອງຮ້ານ','ເນື່ອງຈາກສະຖານະການດຳເນີນງານຂອງຮ້ານ ຈຶ່ງຍັງບໍ່ສາມາດຮັບຄຳຂໍນີ້ໄດ້. ຖ້າຕ້ອງການຊ່ວຍເຫຼືອ ກະລຸນາແຈ້ງພະນັກງານ.'],
 hi:['दुकान की संचालन संबंधी स्थिति','दुकान की मौजूदा संचालन स्थिति के कारण हम यह अनुरोध पूरा नहीं कर सकते। सहायता के लिए कर्मचारी से बात करें।']
};
export const REASON_IDS=['menuUnavailable','preparationStarted','slotUnavailable','capacityUnavailable','verificationRequired','operationalConstraint'];
export function liveReasons(entry){const booking=entry.target_type==='booking',late=!booking&&['preparing','ready'].includes(entry.original_status);return [...(entry.kind==='change'?(booking?['slotUnavailable','capacityUnavailable']:['menuUnavailable']):[]),...(late?['preparationStarted']:[]),'operationalConstraint','verificationRequired'];}
export function liveReasonLabel(id,lang='ko'){return id==='operationalConstraint'?(operational[lang]||operational.en)[0]:reasonLabel(id,lang);}
export function liveReasonMessage(id,lang='ko'){const body=id==='operationalConstraint'?(operational[lang]||operational.en)[1]:reasonMessage(id,lang);return body?(AMENDMENT_COPY[lang]||AMENDMENT_COPY.en).rejected+' '+body:'';}
export function frozenReasonMessages(id){if(!REASON_IDS.includes(id))return null;return Object.fromEntries(Object.keys(LANGS).map(lang=>[lang,liveReasonMessage(id,lang)]));}
