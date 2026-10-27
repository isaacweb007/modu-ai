// Approved one shop mascot. Relative module URLs work at every deployment prefix.
export const mascotUrl=new URL('../assets/one-shop/blue-mascot.webp',import.meta.url).href;
export const avatarUrl=new URL('../assets/one-shop/blue-avatar.png',import.meta.url).href;
export const mascotName='라미';
export const mascotPoses=Object.freeze(Object.fromEntries(Object.entries({greeting:'hello',thinking:'thinking',order:'ordering'}).map(([mood,id])=>[mood,new URL(`../assets/one-shop/rami/expressions/${id}.webp`,import.meta.url).href])));
export function brandMark(mood='idle',animated=false){const pose=mascotPoses[mood]?mood:'idle';return `<span class="bot-mark one-shop-mark ${animated?'mascot-animated':''}" data-mood="${pose}" aria-hidden="true"><img src="${mascotPoses[pose]||mascotUrl}" alt="" width="96" height="96" decoding="async"></span>`;}
export function brandLogo(){return `<span class="one-shop-lockup">${brandMark()}<span class="one-shop-wordmark"><strong>원샵</strong><small>one shop ai</small></span></span>`;}
