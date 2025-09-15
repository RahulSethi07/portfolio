window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ===================== UTILITIES =====================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ===================== NAVBAR: shrink on scroll + position indicator =====================
const nav = $('#navbar');
const links = $$('.nav-link');
const progressBar = $('#progress-bar');
const sections = ['#intro', '#about', '#experience', '#projects', '#skills', '#education', '#documents', '#video', '#contact'].map(id => $(id));
let lastActive = null;

function updateNavResize() {
  const shrink = window.scrollY > 8;
  nav.classList.toggle('shrink', shrink);
}

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.max(0, Math.min(1, scrollTop / docHeight));
  progressBar.style.width = (progress * 100).toFixed(2) + '%';
}

function updateActiveLink() {
  // We set active based on the section just below the bottom of the nav bar.
  const navBottom = nav.getBoundingClientRect().bottom + window.scrollY;
  let active = sections[0].id;

  const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;

  if (isAtBottom) {
    active = sections[sections.length - 1].id;
  } else {
    for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (top <= navBottom + 4) {
          active = sec.id;
        }
      }
  }

  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
  lastActive = active;
}

function onScroll() {
  updateNavResize();
  updateProgress();
  updateActiveLink();
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
document.addEventListener('DOMContentLoaded', () => {
  // set current year
  $('#year').textContent = new Date().getFullYear();
  onScroll();
});

// ===================== SMOOTH SCROLLING (for browsers without CSS smooth) =====================
links.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = $(a.getAttribute('href'));
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===================== CAROUSEL =====================
const track = $('.carousel-track');
const slides = $$('.slide', track);
let index = 0;

function go(dir) {
  index = (index + dir + slides.length) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
}

$$('.carousel-nav').forEach(btn => {
  btn.addEventListener('click', () => go(parseInt(btn.dataset.dir, 10)));
});

// ===================== MODALS =====================
function openModal(el) {
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal(el) {
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$$('[data-modal]').forEach(el => {
  el.addEventListener('click', () => {
    const modal = $(el.getAttribute('data-modal'));
    if (modal) openModal(modal);
  });
});

$$('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
      closeModal(modal);
    }
    if (e.key === 'Escape') closeModal(modal);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    $$('.modal.open').forEach(closeModal);
  }
});

// ===================== FORM (demo only) =====================
$('.contact-form')?.addEventListener('submit', () => {
  alert('Thanks! This demo form does not send data.');
});