export const TEMPLATES=[
 {id:'amber',name:'templateAmber',description:'descAmber',color:'#f3a44b',background:'#241c18',layout:'glass'},
 {id:'aqua',name:'templateAqua',description:'descAqua',color:'#61d8d6',background:'#123b3e',layout:'glass'},
 {id:'ivory',name:'templateIvory',description:'descIvory',color:'#97704a',background:'#f3eee3',layout:'list'},
 {id:'ruby',name:'templateRuby',description:'descRuby',color:'#d5a588',background:'#331f26',layout:'editorial'},
 {id:'midnight',name:'templateMidnight',description:'descMidnight',color:'#9db4ed',background:'#182437',layout:'soft'}
];
export function validTemplate(id){return TEMPLATES.some(x=>x.id===id)?id:'amber'}
