const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('nav-open', !isOpen);
});

document.querySelectorAll('.desktop-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('nav-open');
  });
});

const parallaxImages = document.querySelectorAll('.parallax-image');
const updateParallax = () => {
  parallaxImages.forEach((image) => {
    const bounds = image.getBoundingClientRect();
    const distance = (window.innerHeight / 2 - (bounds.top + bounds.height / 2)) * 0.055;
    image.style.transform = `translateY(${distance}px) scale(1.08)`;
  });
};
window.addEventListener('scroll', updateParallax, { passive: true });
updateParallax();
