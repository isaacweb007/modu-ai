import fs from 'node:fs/promises';
import vm from 'node:vm';
import {setupGuestUrl} from '../dist/shared/shop-setup-state.js';
import {LANGS} from '../dist/shared/locale.js';
// Use the existing, locally vendored QR encoder. Four-module quiet zone.
const context={};vm.createContext(context);
vm.runInContext(await fs.readFile(new URL('../dist/assets/qrcode.min.js',import.meta.url),'utf8'),context);
for(const lang of Object.keys(LANGS)){
 const qr=context.qrcode(0,'M');qr.addData(setupGuestUrl(lang));qr.make();
 const svg=qr.createSvgTag({cellSize:6,margin:24,scalable:true});
 await fs.writeFile(new URL(`../dist/assets/one-shop/onboarding/qr-${lang}.svg`,import.meta.url),svg);
}
console.log('Built nine sample shop QR codes.');
