const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}));

document.querySelectorAll('.how-card').forEach((card) => {
  card.addEventListener('click', () => {
    const isFlipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-expanded', String(isFlipped));
    card.setAttribute('aria-label', isFlipped ? card.dataset.backLabel : card.dataset.frontLabel);
    card.querySelector('.how-card-front').setAttribute('aria-hidden', String(isFlipped));
    card.querySelector('.how-card-back').setAttribute('aria-hidden', String(!isFlipped));
  });
});
