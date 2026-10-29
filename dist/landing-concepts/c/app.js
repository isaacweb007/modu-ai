const examples = {
  vi: { label: '여행 온 손님 · 베트남어', question: 'Món này có cay không? Tôi muốn món không cay.', reply: 'Bạn có thể thử món gà sốt tương, không cay. Bạn muốn gọi một phần không?' },
  en: { label: '여행 온 손님 · 영어', question: 'Is this spicy? I’d like something mild.', reply: 'Try the soy-glazed chicken. It’s not spicy. Would you like one serving?' },
  ja: { label: '여행 온 손님 · 일본어', question: 'これは辛いですか？辛くない料理が食べたいです。', reply: '辛くないしょうゆチキンはいかがですか？一人前ご注文なさいますか？' },
  zh: { label: '여행 온 손님 · 중국어', question: '这道菜辣吗？我想吃不辣的。', reply: '可以试试不辣的酱油鸡。您要点一份吗？' }
};
const languageButtons = document.querySelectorAll('[data-lang]');
languageButtons.forEach(button => button.addEventListener('click', () => {
  const language = button.dataset.lang;
  const example = examples[language];
  languageButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.getElementById('guest-speaker').textContent = example.label;
  const question = document.getElementById('guest-question');
  const reply = document.getElementById('rami-reply');
  question.textContent = example.question;
  reply.textContent = example.reply;
  question.lang = language;
  reply.lang = language;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelector('.translation-stage').animate([{opacity: .3, transform: 'translateY(4px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 260, easing: 'ease-out'});
  }
}));
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '메뉴 열기'); navigation.classList.remove('is-open'); }
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('is-open', !expanded);
  menuButton.setAttribute('aria-label', expanded ? '메뉴 열기' : '메뉴 닫기');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {if (event.key === 'Escape') {closeMenu();menuButton.focus();}});
