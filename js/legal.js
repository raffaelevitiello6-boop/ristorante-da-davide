// Minimal nav + mobile menu for legal pages (no scroll-based nav change needed)
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

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
document.querySelectorAll('.mobile-menu__link').forEach(l => l.addEventListener('click', closeMenu));
