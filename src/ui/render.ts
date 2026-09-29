import { books, byId, genres, readersChoice, type Book } from '../data/books';
import { coverURL } from '../data/covers';

const toneOrder = ['sun', 'lilac', 'mint', 'coral', 'cobalt'];

export function bookCard(b: Book, i: number) {
  const tilt = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.4, -2.2, 1.6][i % 8];
  const tags = b.genres
    .map((g, k) => `<span class="tag" data-tone="${k === 0 ? 'cream' : toneOrder[(i + k) % toneOrder.length]}">${g}</span>`)
    .join('');
  const extra = b.extra ? `<span class="tag" data-tone="${toneOrder[(i + 2) % toneOrder.length]}">${b.extra}</span>` : '';
  return `
    <article class="book-card" data-tone="${b.card}" data-slider-item data-tilt="${tilt}" style="--tilt:${tilt}deg">
      <a class="book-card__link" href="/books.html#${b.id}" draggable="false">
        <figure class="book-card__cover"><img src="${coverURL(b)}" alt="${b.title}: ${b.author}" width="420" height="630" draggable="false" loading="lazy"/></figure>
        <div class="book-card__body">
          <div class="book-card__tags">${tags}${extra}</div>
          <h3 class="book-card__title">${b.title}</h3>
          <p class="book-card__blurb">${b.blurb}</p>
        </div>
      </a>
    </article>`;
}

export function renderBookSlider(el: HTMLElement) {
  el.innerHTML = books.map(bookCard).join('');
}

export function renderBookGrid(el: HTMLElement) {
  el.innerHTML = books.map((b, i) => bookCard(b, i).replace('data-slider-item', `data-filter-item data-genres="${b.genres.join('|')}"`)).join('');
}

export function renderGenreList(el: HTMLElement) {
  el.innerHTML = genres.map((g) => `<li data-genre><a href="/books.html?genre=${encodeURIComponent(g)}">${g}</a></li>`).join('');
}

export function renderGenreCovers(el: HTMLElement) {
  const spots = [
    [4, 14, -14], [86, 10, 12], [10, 58, 9], [82, 54, -8], [2, 86, -6], [90, 84, 14],
  ];
  el.innerHTML = spots
    .map(([x, y, r], i) => {
      const b = books[(i * 3) % books.length];
      return `<img class="genre-cover" data-plop data-momentum-item data-tilt="${r}" style="left:${x}%;top:${y}%;--r:${r}deg" src="${coverURL(b)}" alt="" width="420" height="630" loading="lazy"/>`;
    })
    .join('');
}

export function renderChoice(el: HTMLElement) {
  const tabs = readersChoice
    .map((c, i) => `<button role="tab" id="tab-${c.year}" aria-controls="panel-${c.year}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${c.year}</button>`)
    .join('');
  const panels = readersChoice
    .map((c, i) => {
      const b = byId(c.book);
      return `
      <div class="choice__panel" role="tabpanel" id="panel-${c.year}" aria-labelledby="tab-${c.year}" ${i ? 'hidden' : ''}>
        <img class="choice__cover" data-tab-anim data-tilt="-4" src="${coverURL(b)}" alt="${b.title}" width="420" height="630" loading="lazy"/>
        <div class="choice__meta">
          <p class="t-hand" data-tab-anim>Readers’ pick ${c.year}</p>
          <h3 class="t-h3" data-tab-anim>${b.title}</h3>
          <p class="choice__author" data-tab-anim>${b.author}</p>
          <p class="choice__note" data-tab-anim>${c.note}</p>
          <div class="book-card__tags" data-tab-anim>${b.genres.map((g) => `<span class="tag">${g}</span>`).join('')}</div>
        </div>
        <div class="choice__badge" data-tab-anim data-tilt="10" aria-hidden="true"><span>${c.year}</span><small>winner</small></div>
      </div>`;
    })
    .join('');
  el.innerHTML = `
    <div class="choice__tabs" role="tablist" aria-label="Readers’ choice by year">${tabs}<span class="choice__indicator" data-tabs-indicator></span></div>
    ${panels}`;
}

// Original line illustrations for the four steps (drawn for this project).
export const stepArt = {
  pick: `<svg viewBox="0 0 200 160" fill="none" stroke="#141115" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="40" y="30" width="120" height="100" rx="10" fill="#fff8ec"/><path d="M40 55h120M70 22v18M130 22v18"/><g fill="#141115"><circle cx="65" cy="75" r="4"/><circle cx="90" cy="75" r="4"/><circle cx="115" cy="75" r="4"/><circle cx="65" cy="100" r="4"/><circle cx="140" cy="100" r="4"/></g><path d="M85 95l10 10 22-24" stroke="#ff5470" stroke-width="6"/></svg>`,
  box: `<svg viewBox="0 0 200 160" fill="none" stroke="#141115" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M40 70l60-25 60 25v55l-60 20-60-20z" fill="#ff8a3d"/><path d="M40 70l60 22 60-22M100 92v53"/><path d="M40 70l-12-22 60-22 12 19M160 70l12-22-60-22-12 19" fill="#fff8ec"/><rect x="72" y="30" width="18" height="34" rx="2" fill="#3355ff" transform="rotate(-12 81 47)"/><rect x="100" y="26" width="18" height="36" rx="2" fill="#ffcf33" transform="rotate(8 109 44)"/></svg>`,
  read: `<svg viewBox="0 0 200 160" fill="none" stroke="#141115" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M30 120c30-6 50 0 70 12 20-12 40-18 70-12V45c-30-6-50 0-70 12-20-12-40-18-70-12z" fill="#fff8ec"/><path d="M100 57v75M45 62c15-2 30 0 42 6M45 78c15-2 30 0 42 6M113 68c12-6 27-8 42-6M113 84c12-6 27-8 42-6"/><path d="M150 20c4 8 12 10 20 8-6 6-6 14-2 20-8-4-16-2-20 4 0-8-4-14-12-16 8-2 12-8 14-16z" fill="#ffcf33"/></svg>`,
  talk: `<svg viewBox="0 0 200 160" fill="none" stroke="#141115" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M30 40h90a12 12 0 0 1 12 12v36a12 12 0 0 1-12 12H70l-22 18v-18H30a12 12 0 0 1-12-12V52a12 12 0 0 1 12-12z" fill="#fff8ec"/><path d="M110 70h60a12 12 0 0 1 12 12v30a12 12 0 0 1-12 12h-8v16l-18-16h-34a12 12 0 0 1-12-12V82" fill="#c6b4ff"/><g fill="#141115"><circle cx="52" cy="70" r="4"/><circle cx="70" cy="70" r="4"/><circle cx="88" cy="70" r="4"/></g></svg>`,
};
