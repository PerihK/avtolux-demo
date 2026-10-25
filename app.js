const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const menuButton = $('.menu-button');
const mobileNav = $('#mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Открыть меню'); mobileNav.hidden = true; }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); mobileNav.hidden = !open; });
$$('a', mobileNav).forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
const heroDescriptions = {'36':'Белый Mercedes-Benz в мастерской AvtoLux — фото из Яндекс Карт','10':'Красная Mazda RX-8 в мастерской AvtoLux — фото из Яндекс Карт','0':'Nissan с оранжевой оклейкой в мастерской AvtoLux — фото из Яндекс Карт'};
let heroTimer;
$$('.hero-thumb').forEach(button => button.addEventListener('click', () => {
  clearTimeout(heroTimer);
  $$('.hero-thumb').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  const photo = $('#hero-photo');
  photo.classList.add('changing');
  heroTimer = setTimeout(() => { photo.src = `assets/work-${button.dataset.photo}.webp`; photo.alt = heroDescriptions[button.dataset.photo]; photo.onload = () => photo.classList.remove('changing'); if(photo.complete) photo.classList.remove('changing'); }, 170);
}));
$$('.service').forEach(service => service.addEventListener('toggle', () => {
  if (!service.open) return;
  $$('.service').forEach(other => { if (other !== service) other.open = false; });
  const image = $('#service-image'); image.src = `assets/work-${service.dataset.image}.webp`; image.alt = service.dataset.alt + ' — фото из Яндекс Карт';
}));
const works = $$('.work');
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  $('#gallery').classList.toggle('filtered', filter !== 'all');
  $('#gallery').classList.toggle('filtered-details', filter === 'details');
  works.forEach(w => w.hidden = filter !== 'all' && w.dataset.category !== filter);
}));
let reviewIndex = 0;
function showReview(delta) { const slides = $$('.review-slide'); reviewIndex = (reviewIndex + delta + slides.length) % slides.length; slides.forEach((s,i) => { s.hidden = i !== reviewIndex; s.classList.toggle('active', i === reviewIndex); }); $$('.review-dots i').forEach((d,i) => d.classList.toggle('active', i === reviewIndex)); }
$('#review-prev').addEventListener('click', () => showReview(-1));
$('#review-next').addEventListener('click', () => showReview(1));
const lightbox = $('.lightbox');
let currentWork;
function showPhoto(work) { currentWork = work; $('#lightbox-image').src = `assets/work-${work.dataset.image}.webp`; $('#lightbox-image').alt = $('img',work).alt; $('#lightbox-caption').textContent = work.dataset.caption; }
function closeLightbox() { lightbox.close(); document.body.classList.remove('modal-open'); }
function nextPhoto(delta) { const visibleWorks = works.filter(w => !w.hidden && getComputedStyle(w).display !== 'none'); const index = visibleWorks.indexOf(currentWork); showPhoto(visibleWorks[(index + delta + visibleWorks.length) % visibleWorks.length]); }
works.forEach(work => work.addEventListener('click', () => { showPhoto(work); lightbox.showModal(); document.body.classList.add('modal-open'); }));
$('.lightbox-close').addEventListener('click', closeLightbox);
$('.lightbox-prev').addEventListener('click', () => nextPhoto(-1));
$('.lightbox-next').addEventListener('click', () => nextPhoto(1));
lightbox.addEventListener('cancel', () => document.body.classList.remove('modal-open'));
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
lightbox.addEventListener('keydown', e => { if(e.key === 'ArrowLeft') {e.preventDefault(); nextPhoto(-1);} if(e.key === 'ArrowRight') {e.preventDefault(); nextPhoto(1);} });
