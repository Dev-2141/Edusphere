import { books, byId, courseById, readersChoice, topics, type Book, type Course } from '../data/books';
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
      <a class="book-card__link" href="courses.html#${b.id}" draggable="false">
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
  el.innerHTML = topics.map((t) => `<li data-genre><a href="course.html?id=${t.course}">${t.label}</a></li>`).join('');
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
          <p class="t-hand" data-tab-anim>Learners’ pick ${c.year}</p>
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
    <div class="choice__tabs" role="tablist" aria-label="Learners’ choice by year">${tabs}<span class="choice__indicator" data-tabs-indicator></span></div>
    ${panels}`;
}

// ---- Courses (sub-topics) & video lessons -----------------------------------

const planTones = ['var(--c-sun)', 'var(--c-lilac)', 'var(--c-mint)', 'var(--c-coral-lt)', 'var(--c-cream)'];
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export const thumbURL = (youtube: string) => `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`;
export const embedURL = (youtube: string, autoplay = false) =>
  `https://www.youtube-nocookie.com/embed/${youtube}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
export const watchURL = (youtube: string) => `https://www.youtube.com/watch?v=${youtube}`;

export function courseCard(c: Course, i: number) {
  const tilt = [-2, 1.5, -1, 2, -1.5, 1][i % 6];
  return `
    <article class="plan course-card spotlight" data-scatter-item data-momentum-item data-tilt="${tilt}" style="--bg: ${planTones[i % planTones.length]}">
      <a class="course-card__link" href="course.html?id=${c.id}">
        <figure class="course-card__thumb"><img src="${thumbURL(c.lessons[0].youtube)}" alt="" width="480" height="360" loading="lazy"/><span class="course-card__play" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M5 3.5v9l7.5-4.5z" fill="currentColor"/></svg></span></figure>
        <p class="course-card__by t-hand">${c.instructor}</p>
        <h3 class="t-h3">${c.title}</h3>
        <p>${c.summary}</p>
        <div class="book-card__tags"><span class="tag" data-tone="cream">${c.level}</span><span class="tag" data-tone="${toneOrder[(i + 1) % toneOrder.length]}">${c.lessons.length} video lesson${c.lessons.length > 1 ? 's' : ''}</span></div>
      </a>
    </article>`;
}

/** All Courses page: one track per main course, listing its sub-topic courses. */
export function renderCourseTracks(el: HTMLElement) {
  el.innerHTML = books
    .map(
      (b) => `
    <section class="track" id="${b.id}" data-filter-item data-genres="${b.genres.join('|')}" aria-labelledby="track-${b.id}">
      <div class="track__head">
        <p class="t-hand" data-hand>${b.author}</p>
        <h2 class="t-h2" id="track-${b.id}" data-split="lines">${b.title}</h2>
        <p class="t-lead" data-depth-blur>${b.blurb}</p>
      </div>
      <div class="track__list" data-scatter data-momentum>${b.courses.map(courseCard).join('')}</div>
    </section>`,
    )
    .join('');
}

/** Course page: hero, YouTube lesson player + lesson list, then sibling courses. */
export function renderCoursePage(el: HTMLElement, id: string | null) {
  const c = id ? courseById(id) : undefined;
  if (!c) {
    el.innerHTML = `
      <section class="page-hero" style="--bg: var(--c-coral-lt)">
        <div class="container">
          <p class="t-hand" data-hand>this one wandered off</p>
          <h1 class="t-hero" data-split="lines" data-intro>Course not found</h1>
          <div data-intro-item><a class="btn btn--ink" href="courses.html"><span class="btn__label">Browse all courses</span><span class="btn__icon">${arrowIcon}</span></a></div>
        </div>
      </section>`;
    return;
  }
  document.title = `${c.title} — Edusphere`;
  const b = c.category;
  const first = c.lessons[0];
  const hero = { sun: 'var(--c-sun)', coral: 'var(--c-coral-lt)', mint: 'var(--c-mint)', lilac: 'var(--c-lilac)', cobalt: 'var(--c-lilac-lt)', cream: 'var(--c-cream)', ink: 'var(--c-mint)' }[b.card];
  const lessons = c.lessons
    .map(
      (l, i) => `
        <li class="faq-item"><h3><button class="player__lesson" data-lesson="${l.youtube}" data-title="${esc(l.title)}" data-channel="${esc(l.channel)}" ${i === 0 ? 'aria-current="true"' : ''}>
          <span class="player__num">${String(i + 1).padStart(2, '0')}</span>
          <span class="player__name">${l.title}<small>${l.channel}</small></span>
          <span class="player__check" aria-hidden="true">✓</span>
        </button></h3></li>`,
    )
    .join('');
  const siblings = b.courses.filter((s) => s.id !== c.id);
  el.innerHTML = `
    <section class="page-hero" style="--bg: ${hero}">
      <div class="container">
        <p class="t-hand" data-hand><a href="courses.html#${b.id}">${b.title}</a> · ${c.level.toLowerCase()} course</p>
        <h1 class="t-h2 course-hero__title" data-split="lines" data-intro>${c.title}</h1>
        <p class="t-lead" data-intro-item>${c.summary}</p>
        <div class="book-card__tags" data-intro-item><span class="tag" data-tone="cream">${c.instructor}</span><span class="tag" data-tone="sun">${c.lessons.length} video lesson${c.lessons.length > 1 ? 's' : ''}</span><span class="tag">Free to watch</span></div>
      </div>
    </section>

    <section class="player container" data-player="${c.id}" aria-label="Course player">
      <div class="player__stage">
        <div class="player__frame" data-player-frame>
          <iframe data-player-iframe src="${embedURL(first.youtube)}" title="${esc(first.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <div class="player__now">
          <p><span class="t-hand">now playing</span><strong data-player-title>${first.title}</strong><span data-player-channel>by ${first.channel}</span></p>
          <a class="pill" data-player-source href="${watchURL(first.youtube)}" target="_blank" rel="noopener">Watch on YouTube ↗</a>
        </div>
      </div>
      <aside class="player__side">
        <div class="player__progress"><p><strong data-player-progress>0 / ${c.lessons.length}</strong> lessons watched</p><p class="player__done" data-player-complete hidden>course complete 🎓</p><span class="player__bar"><span data-player-bar></span></span></div>
        <ol class="faq__list player__lessons">${lessons}</ol>
        <div class="player__skills"><p class="t-hand">skills you’ll gain</p><div class="book-card__tags">${c.skills.map((s, i) => `<span class="tag" data-tone="${toneOrder[i % toneOrder.length]}">${s}</span>`).join('')}</div></div>
        <p class="plans__note">Lessons are embedded from YouTube. All videos belong to their original creators.</p>
      </aside>
    </section>

    ${
      siblings.length
        ? `<section class="track container" aria-labelledby="more-title">
      <div class="track__head">
        <p class="t-hand" data-hand>keep going</p>
        <h2 class="t-h2" id="more-title" data-split="lines">More in ${b.title}</h2>
      </div>
      <div class="track__list" data-scatter data-momentum>${siblings.map(courseCard).join('')}</div>
    </section>`
        : ''
    }`;
}

// ---- Developer support plan (mock ₹10 / month) -----------------------------

export function renderSupportPlan(el: HTMLElement) {
  el.innerHTML = `
    <article class="support-card" data-spotlight data-support data-scatter-item data-tilt="2">
      <span class="support-card__sticker" data-plop>mock plan!</span>
      <span class="support-card__badge" aria-hidden="true">supporter ♥</span>
      <p class="t-hand">developer support</p>
      <p class="support-card__price" aria-label="10 rupees per month"><span class="support-card__cur">₹</span><span data-count="10">10</span><small>/ month</small></p>
      <ul class="support-card__perks">
        <li><span aria-hidden="true">✓</span>A supporter badge on your Edusphere logo</li>
        <li><span aria-hidden="true">✓</span>Vote on the next subject we add</li>
        <li><span aria-hidden="true">✓</span>Early peek at new courses</li>
        <li><span aria-hidden="true">✓</span>Keeps the developers in chai</li>
      </ul>
      <button class="btn" type="button" data-support-toggle><span class="btn__label">Support for ₹10 / month</span><span class="btn__icon">${arrowIcon}</span></button>
      <p class="support-card__status" data-support-status aria-live="polite"></p>
      <p class="plans__note">A mock subscription for a demo project. No payment is taken and no card details are ever asked for.</p>
    </article>`;
}

const arrowIcon =`<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Original line illustrations for the four steps (drawn for this project).
export const stepArt = {
  pick: `<svg viewBox="0 0 200 160" fill="none" stroke="#141115" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="40" y="30" width="120" height="100" rx="10" fill="#fff8ec"/><path d="M40 55h120M70 22v18M130 22v18"/><g fill="#141115"><circle cx="65" cy="75" r="4"/><circle cx="90" cy="75" r="4"/><circle cx="115" cy="75" r="4"/><circle cx="65" cy="100" r="4"/><circle cx="140" cy="100" r="4"/></g><path d="M85 95l10 10 22-24" stroke="#ff5470" stroke-width="6"/></svg>`,
  box: `<svg viewBox="0 0 200 160" fill="none" stroke="#141115" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M40 70l60-25 60 25v55l-60 20-60-20z" fill="#ff8a3d"/><path d="M40 70l60 22 60-22M100 92v53"/><path d="M40 70l-12-22 60-22 12 19M160 70l12-22-60-22-12 19" fill="#fff8ec"/><rect x="72" y="30" width="18" height="34" rx="2" fill="#3355ff" transform="rotate(-12 81 47)"/><rect x="100" y="26" width="18" height="36" rx="2" fill="#ffcf33" transform="rotate(8 109 44)"/></svg>`,
  read: `<svg viewBox="0 0 200 160" fill="none" stroke="#141115" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M30 120c30-6 50 0 70 12 20-12 40-18 70-12V45c-30-6-50 0-70 12-20-12-40-18-70-12z" fill="#fff8ec"/><path d="M100 57v75M45 62c15-2 30 0 42 6M45 78c15-2 30 0 42 6M113 68c12-6 27-8 42-6M113 84c12-6 27-8 42-6"/><path d="M150 20c4 8 12 10 20 8-6 6-6 14-2 20-8-4-16-2-20 4 0-8-4-14-12-16 8-2 12-8 14-16z" fill="#ffcf33"/></svg>`,
  talk: `<svg viewBox="0 0 200 160" fill="none" stroke="#141115" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M30 40h90a12 12 0 0 1 12 12v36a12 12 0 0 1-12 12H70l-22 18v-18H30a12 12 0 0 1-12-12V52a12 12 0 0 1 12-12z" fill="#fff8ec"/><path d="M110 70h60a12 12 0 0 1 12 12v30a12 12 0 0 1-12 12h-8v16l-18-16h-34a12 12 0 0 1-12-12V82" fill="#c6b4ff"/><g fill="#141115"><circle cx="52" cy="70" r="4"/><circle cx="70" cy="70" r="4"/><circle cx="88" cy="70" r="4"/></g></svg>`,
};
