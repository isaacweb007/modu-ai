// Approved one shop mascot. Relative module URLs work at every deployment prefix.
export const mascotUrl=new URL('../assets/one-shop/blue-mascot.webp',import.meta.url).href;
export const avatarUrl=new URL('../assets/one-shop/blue-avatar.png',import.meta.url).href;
export function brandMark(){return `<span class="bot-mark one-shop-mark" aria-hidden="true"><img src="${mascotUrl}" alt="" width="96" height="96" decoding="async"></span>`;}
export function brandLogo(){return `<span class="one-shop-lockup">${brandMark()}<span class="one-shop-wordmark"><strong>원샵</strong><small>one shop · one ai</small></span></span>`;}
