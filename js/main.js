// Nav scroll state
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Hero entry animation
window.addEventListener('load', () => {
  document.querySelector('.hero').classList.add('loaded');
});

// Mobile menu toggle
function openMenu() {
  mobileMenu.classList.add('open');
  burger.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  burger.classList.remove('open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () =>
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
);
mobileClose.addEventListener('click', closeMenu);

document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Menu tabs
function activateMenuTab(name) {
  const tab = document.querySelector(`.menu__tab[data-tab="${name}"]`);
  const panel = document.querySelector(`[data-panel="${name}"]`);
  if (!tab || !panel) return;
  document.querySelectorAll('.menu__tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.menu__panel').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  panel.classList.add('active');
}

document.querySelectorAll('.menu__tab').forEach(tab => {
  tab.addEventListener('click', () => activateMenuTab(tab.dataset.tab));
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 16;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// Scroll reveal
const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 80;
        });
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Intro popup: La Raccomandazione
const recoModal = document.getElementById('recoModal');
if (recoModal) {
  const STORAGE_KEY = 'recoModalSeen';

  function openReco() {
    recoModal.classList.add('open');
    recoModal.setAttribute('aria-hidden', 'false');
  }
  function closeReco() {
    recoModal.classList.remove('open');
    recoModal.setAttribute('aria-hidden', 'true');
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
  }

  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (e) {}

  if (!alreadySeen) {
    window.addEventListener('load', () => setTimeout(openReco, 1200));
  }

  recoModal.querySelectorAll('[data-reco-close]').forEach(el => {
    el.addEventListener('click', closeReco);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && recoModal.classList.contains('open')) closeReco();
  });

  const recoCta = recoModal.querySelector('[data-reco-cta]');
  if (recoCta) {
    recoCta.addEventListener('click', e => {
      e.preventDefault();
      closeReco();
      activateMenuTab('empfehlung');
      const target = document.querySelector('#menu');
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 16;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  }
}
