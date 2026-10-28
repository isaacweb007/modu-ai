import fs from 'node:fs/promises';
import vm from 'node:vm';
import {integratedGuestUrl,integratedQr} from '../dist/shared/integrated-demo-state.js';
import {LANGS} from '../dist/shared/locale.js';
const context={};vm.createContext(context);
vm.runInContext(await fs.readFile(new URL('../dist/assets/qrcode.min.js',import.meta.url),'utf8'),context);
for(const scenario of ['dineIn','delivery'])for(const lang of Object.keys(LANGS)){
 const qr=context.qrcode(0,'M');qr.addData(integratedGuestUrl(lang,scenario));qr.make();
 await fs.writeFile(new URL('../dist/'+integratedQr(lang,scenario),import.meta.url),qr.createSvgTag({cellSize:6,margin:24,scalable:true}));
}
console.log('Built 18 isolated guest QR codes: table entry and online entry in nine languages.');
