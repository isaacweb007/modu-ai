// Native WebCrypto: no password or derived material is returned to clients or logged.
export const PASSWORD_ITERATIONS=600000;
const hex=bytes=>Array.from(bytes,n=>n.toString(16).padStart(2,'0')).join('');
const bytes=hex=>Uint8Array.from(hex.match(/../g)||[],x=>parseInt(x,16));
export function validatePassword(value){if(typeof value!=='string'||[...value].length<12||[...value].length>128||new TextEncoder().encode(value).length>512)throw Object.assign(Error('passwordLength'),{status:400});return value;}
async function derive(password,salt){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:bytes(salt),iterations:PASSWORD_ITERATIONS},key,256));}
export async function hashPassword(password){validatePassword(password);const salt=hex(crypto.getRandomValues(new Uint8Array(16)));return {salt,digest:hex(await derive(password,salt)),iterations:PASSWORD_ITERATIONS};}
export async function verifyPassword(password,record){validatePassword(password);const valid=record&&/^[a-f0-9]{32}$/.test(record.salt)&&/^[a-f0-9]{64}$/.test(record.digest)&&record.iterations===PASSWORD_ITERATIONS;const actual=await derive(password,valid?record.salt:'0'.repeat(32)),expected=bytes(valid?record.digest:'0'.repeat(64));let diff=0;for(let i=0;i<32;i++)diff|=actual[i]^expected[i];return !!valid&&diff===0;}
