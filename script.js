const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const toast = document.querySelector('[data-toast]');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav.classList.toggle('is-open', !open);
});

mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('is-open');
}));

document.querySelector('[data-demo-add]')?.addEventListener('click', () => showToast('Демо: новая запись добавлена в календарь'));
document.querySelector('[data-client-filter]')?.addEventListener('click', (event) => {
  event.currentTarget.textContent = event.currentTarget.textContent === 'Активные' ? 'Все клиенты' : 'Активные';
});
const chatCard = document.querySelector('[data-chat-card]');
const chatForm = document.querySelector('[data-chat-form]');
const chatInput = document.querySelector('[data-chat-input]');
const chatLog = document.querySelector('[data-chat-log]');
const chatTyping = document.querySelector('[data-typing]');
const chatError = document.querySelector('[data-chat-error]');
const sendButton = document.querySelector('[data-send-message]');
const chatReplies = [
  'Спасибо! Тогда буду завтра в назначенное время.',
  'Отлично, уведомление о визите уже пришло.',
  'Всё верно. До встречи!'
];
let replyIndex = 0;

function appendChatMessage(text, direction) {
  const message = document.createElement('p');
  message.className = direction;
  message.textContent = text;
  chatLog.insertBefore(message, chatTyping);
  chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
  if (!reducedMotion) {
    message.animate([
      { opacity: 0, transform: 'translateY(16px) scale(.985)', clipPath: 'inset(100% 0 0 round 8px)' },
      { opacity: 1, transform: 'translateY(0) scale(1)', clipPath: 'inset(0 0 0 round 8px)' }
    ], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
  }
}

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) {
    chatError.textContent = 'Напишите сообщение перед отправкой.';
    chatInput.setAttribute('aria-invalid', 'true');
    chatInput.focus();
    return;
  }

  chatError.textContent = '';
  chatInput.removeAttribute('aria-invalid');
  appendChatMessage(value, 'outgoing');
  chatInput.value = '';
  chatInput.disabled = true;
  sendButton.disabled = true;
  sendButton.textContent = 'Отправлено';
  chatTyping.hidden = false;
  chatLog.scrollTo({ top: chatLog.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });

  window.setTimeout(() => {
    chatTyping.hidden = true;
    appendChatMessage(chatReplies[replyIndex % chatReplies.length], 'incoming');
    replyIndex += 1;
    chatInput.disabled = false;
    sendButton.disabled = false;
    sendButton.textContent = 'Отправить';
    chatInput.focus();
  }, reducedMotion ? 350 : 1050);
});

if (chatCard && 'IntersectionObserver' in window) {
  const chatObserver = new IntersectionObserver(([entry]) => {
    chatCard.classList.toggle('is-chat-visible', entry.isIntersecting);
  }, { threshold: .2 });
  chatObserver.observe(chatCard);
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach((element) => {
    gsap.fromTo(element, { opacity: 0, y: 34 }, {
      opacity: 1,
      y: 0,
      duration: .8,
      ease: 'power2.out',
      scrollTrigger: { trigger: element, start: 'top 88%', once: true }
    });
  });
  gsap.fromTo('.hero-product', { scale: .97 }, {
    scale: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 60%', scrub: .7 }
  });
  gsap.fromTo('.phone-figure img', { yPercent: 7, scale: .96 }, {
    yPercent: -2,
    scale: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.download-section', start: 'top bottom', end: 'bottom top', scrub: .8 }
  });
}
