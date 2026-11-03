const AREA_LABELS = {
  world: 'World Models', sciml: 'Scientific ML', earth: 'Earth Systems',
  multimodal: 'Multimodal & Agents', safety: 'RL & Safety'
};
const AREA_DESCRIPTIONS = {
  selected: 'A selection of my work on learned dynamics, from physical fields to robot videos.',
  all: 'Publications and preprints across my research areas. Browse by topic or search by title and author.',
  world: 'Learning to generate, remember, and predict in visual and interactive worlds.',
  sciml: 'Neural operators, reduced-order dynamics, and generalization to new physical conditions.',
  earth: 'Learning atmospheric and ocean dynamics across spatial and temporal scales.',
  multimodal: 'Understanding video, evaluating multimodal intelligence, and building agents.',
  safety: 'Policy improvement, reward learning, and safer behavior in generative systems.'
};
const FEATURE_ORDER = ['roboalign-r1', 'futureworlds', 'recap', 'geoflip', 'tritoncast', 'prometheus', 'nmo'];
let activeFilter = 'selected';
const list = document.querySelector('#publications');
const figureArea = document.querySelector('main');
const search = document.querySelector('#paper-search');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const allButton = document.querySelector('#view-all');
const papers = window.PUBLICATIONS || [];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const assetUrl = name => window.INLINE_ASSETS?.[name] || `assets/${name}`;
const safeLink = url => /^https?:\/\//.test(url || '') ? escapeHtml(url) : '';
const PAPER_ROLES = {geoflip: 'Corresponding Author', tyche: 'Corresponding Author', oneforecast: 'Co-first Author', neuralom: 'Co-first Author', nuwadynamics: 'Co-first Author', 'frequency-distillation': 'Corresponding Author', 'open-ck': 'Corresponding Author'};
function authorsHtml(authors) {
  return escapeHtml(authors).replace(/\bHao Wu\b|\bH\. Wu\b/g, '<strong>$&</strong>');
}
const globePaper = papers.find(paper => paper.id === 'tritoncast' && paper.figure?.stillAsset);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let globeRotates = !reducedMotion.matches;
function figureUrl(paper, figure = paper.figure) {
  if (figure.asset) return assetUrl(figure.asset);
  if (paper === globePaper && !globeRotates) return assetUrl(paper.figure.stillAsset);
  return assetUrl(`paper-figures/${paper.id}.webp`);
}
function rotationLabel() {
  return globeRotates ? 'Stop rotation' : 'Start rotation';
}
function figureControl(paper, figure, footerText) {
  const companion = figure === paper.figure.companion ? ' data-companion' : '';
  const preview = figure.preview || figure;
  const src = figure.preview ? assetUrl(preview.asset) : figureUrl(paper, figure);
  const content = footerText ? escapeHtml(footerText) :
    `<img src="${escapeHtml(src)}" alt="${escapeHtml(preview.description)}" width="${preview.width}" height="${preview.height}" loading="lazy" decoding="async">`;
  return `<button type="button" class="${footerText ? 'figure-action' : 'figure-open'}"
    data-figure-id="${escapeHtml(paper.id)}"${companion} aria-haspopup="dialog"
    aria-label="Enlarge ${escapeHtml(figure.number)} from ${escapeHtml(paper.shortTitle)}">${content}</button>`;
}
function figureThumbnail(paper) {
  const figure = paper.figure;
  if (!figure) return '';
  const second = figure.companion;
  const stage = figureControl(paper, figure) + (second ? figureControl(paper, second) : '');
  const stageClass = second ? 'paper-gallery-stage paper-gallery-stage-pair' : 'paper-gallery-stage';
  const rotate = paper === globePaper ? `<button type="button" class="globe-rotation">${rotationLabel()}</button>` : '';
  const caption = second
    ? figureControl(paper, figure, `Method · ${figure.number} ↗`) + figureControl(paper, second, `Result · ${second.number.split(' (')[0]} ↗`)
    : `<span class="figure-caption">${escapeHtml(figure.preview?.label || figure.number)}</span>${rotate}${figureControl(paper, figure, 'Enlarge ↗')}`;
  return `<div class="paper-gallery">
    <div class="${stageClass}">${stage}</div>
    <div class="paper-gallery-footer">${caption}</div>
  </div>`;
}
function paperHtml(paper) {
  const links = paper.links || {};
  const primaryLink = links.project || links.paper || links.code;
  const linkAttrs = ' target="_blank" rel="noopener noreferrer"';
  const figure = figureThumbnail(paper);
  const title = primaryLink ? `<a href="${safeLink(primaryLink)}"${linkAttrs}>${escapeHtml(paper.title)}</a>` : escapeHtml(paper.title);
  const paperLinks = Object.entries({ paper: 'Paper', project: 'Project Page', code: 'Code' }).filter(([key]) => links[key]).map(([key, label]) => `<a class="paper-link" href="${safeLink(links[key])}"${linkAttrs}>${label} ↗</a>`).join('');
  const role = PAPER_ROLES[paper.id] || (paper.authors.startsWith('Hao Wu,') ? 'First Author' : '');
  const preprint = /preprint|review/i.test(paper.venue);
  const layout = paper.figure ? '' : 'paper-card-text';
  return `<article class="paper-card ${paper.selected ? 'paper-card-featured' : ''} ${layout}">${figure}<div class="paper-content"><h3 class="paper-title">${title}</h3><p class="paper-authors" title="${escapeHtml(paper.authors)}">${authorsHtml(paper.authors)}</p>${paper.authorNote ? `<small class="paper-author-note">${escapeHtml(paper.authorNote)}</small>` : ''}<div class="paper-meta"><span class="paper-venue ${preprint ? 'paper-venue-review' : 'paper-venue-accepted'}">${escapeHtml(paper.venue)} ${paper.year}</span>${role ? `<span class="paper-role ${role === 'Corresponding Author' ? 'paper-role-corresponding' : ''}">${role}</span>` : ''}<span class="paper-area">${escapeHtml(AREA_LABELS[paper.areas[0]])}</span></div>${paper.description ? `<p class="paper-description">${escapeHtml(paper.description)}</p>` : ''}<div class="paper-links">${paperLinks}</div></div></article>`;
}
function render() {
  hideFigurePreview();
  const query = search.value.trim().toLowerCase();
  const scope = query && activeFilter === 'selected' ? 'all' : activeFilter;
  const matches = papers.filter(paper => {
    const inArea = scope === 'all' || (scope === 'selected' ? paper.selected : paper.areas.includes(scope));
    const text = [paper.title, paper.shortTitle, paper.authors, paper.venue, paper.year, paper.description, ...(paper.tags || [])].join(' ').toLowerCase();
    return inArea && text.includes(query);
  });
  matches.sort((a, b) => scope === 'selected' ? FEATURE_ORDER.indexOf(a.id) - FEATURE_ORDER.indexOf(b.id) : b.year - a.year);
  list.innerHTML = matches.length ? matches.map(paperHtml).join('') : '<div class="empty-result"><p>No papers match this search.</p><button type="button" id="reset-search">Show all papers</button></div>';
  document.querySelector('#area-description').textContent = AREA_DESCRIPTIONS[scope];
  document.querySelector('#result-count').textContent = `${matches.length} ${matches.length === 1 ? 'paper' : 'papers'}`;
  allButton.hidden = activeFilter !== 'selected' || Boolean(query);
  filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === scope)));
  document.querySelector('#reset-search')?.addEventListener('click', () => { search.value = ''; setFilter('all'); });
}
function setFilter(filter) { activeFilter = filter; render(); }
const figureDialog = document.querySelector('#paper-figure-dialog');
const dialogRotation = document.createElement('button');
dialogRotation.type = 'button';
dialogRotation.className = 'globe-rotation';
dialogRotation.hidden = true;
figureDialog.querySelector('.figure-dialog-caption').prepend(dialogRotation);
// One shared hover image keeps the cards still and uses the same figure as the full view.
const zoom = document.createElement('img');
zoom.className = 'figure-hover-preview';
zoom.hidden = true;
zoom.alt = '';
zoom.setAttribute('aria-hidden', 'true');
document.body.append(zoom);
const canHover = window.matchMedia('(any-hover: hover)');
let zoomOwner = null;
let hideTimer;
function setGlobeRotation(playing) {
  if (!globePaper) return;
  globeRotates = playing;
  const src = figureUrl(globePaper);
  const image = list.querySelector(`[data-figure-id="${globePaper.id}"] img`);
  if (image) image.src = src;
  if (zoomOwner?.dataset.figureId === globePaper.id) zoom.src = src;
  if (figureDialog.open && !dialogRotation.hidden) figureDialog.querySelector('#figure-full').src = src;
  document.querySelectorAll('.globe-rotation').forEach(button => { button.textContent = rotationLabel(); });
}
reducedMotion.addEventListener('change', event => setGlobeRotation(!event.matches));
dialogRotation.addEventListener('click', () => setGlobeRotation(!globeRotates));
function hideFigurePreview() {
  clearTimeout(hideTimer);
  zoom.hidden = true;
  zoomOwner = null;
}
function positionFigurePreview() {
  if (!zoomOwner || !zoom.naturalWidth) return;
  const rect = zoomOwner.getBoundingClientRect();
  const gap = 8, edge = 12;
  const vw = document.documentElement.clientWidth, vh = window.innerHeight;
  const isLink = zoomOwner.hasAttribute('data-preview-figure');
  const below = vh - rect.bottom - gap - edge;
  const above = rect.top - gap - edge;
  const availableHeight = isLink ? Math.max(above, below) : vh - 2 * edge;
  if (availableHeight < 1) return hideFigurePreview();
  const targetWidth = Math.min(vw - 2 * edge, isLink ? 520 : Math.max(760, rect.width * 1.55));
  const scale = Math.min(1, targetWidth / zoom.naturalWidth, availableHeight / zoom.naturalHeight);
  const w = Math.round(zoom.naturalWidth * scale), h = Math.round(zoom.naturalHeight * scale);
  const alignedLeft = Math.max(edge, Math.min(rect.left, vw - edge - w));
  const left = isLink ? alignedLeft : rect.right + gap + w <= vw - edge ? rect.right + gap
    : rect.left - gap - w >= edge ? rect.left - gap - w
    : alignedLeft;
  const top = isLink ? (below >= h ? rect.bottom + gap : rect.top - gap - h)
    : Math.max(edge, Math.min(rect.top + (rect.height - h) / 2, vh - edge - h));
  Object.assign(zoom.style, { width: w + 'px', height: h + 'px', left: left + 'px', top: top + 'px' });
  zoom.hidden = false;
}
function queueHideFigurePreview() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(hideFigurePreview, 160);
}
zoom.addEventListener('load', positionFigurePreview);
function showFigurePreview(owner) {
  clearTimeout(hideTimer);
  if (owner === zoomOwner || figureDialog.open) return;
  const paper = papers.find(entry => entry.id === (owner.dataset.previewFigure || owner.dataset.figureId));
  if (!paper?.figure) return;
  zoom.hidden = true;
  zoomOwner = owner;
  zoom.classList.toggle('figure-link-preview', owner.hasAttribute('data-preview-figure'));
  zoom.src = figureUrl(paper, owner.hasAttribute('data-companion') ? paper.figure.companion : paper.figure);
  if (zoom.complete) positionFigurePreview();
}
figureArea.addEventListener('pointerover', event => {
  const owner = event.target.closest('.figure-open, [data-preview-figure]');
  if (owner && canHover.matches && event.pointerType !== 'touch') showFigurePreview(owner);
});
figureArea.addEventListener('focusin', event => {
  if (event.target.matches('[data-preview-figure]:focus-visible')) showFigurePreview(event.target);
});
figureArea.addEventListener('focusout', event => {
  if (event.target === zoomOwner && event.target.hasAttribute('data-preview-figure')) hideFigurePreview();
});
figureArea.addEventListener('pointerout', event => {
  if (zoomOwner?.contains(event.target) && !zoomOwner.contains(event.relatedTarget) && event.relatedTarget !== zoom) queueHideFigurePreview();
});
zoom.addEventListener('pointerenter', () => clearTimeout(hideTimer));
zoom.addEventListener('pointerleave', queueHideFigurePreview);
zoom.addEventListener('click', () => { if (zoomOwner) { zoomOwner.focus({ preventScroll: true }); zoomOwner.click(); } });
document.addEventListener('keydown', event => { if (event.key === 'Escape') hideFigurePreview(); });
window.addEventListener('resize', hideFigurePreview);
window.addEventListener('scroll', hideFigurePreview, { capture: true, passive: true });
figureArea.addEventListener('click', event => {
  if (event.target.closest('.globe-rotation')) {
    setGlobeRotation(!globeRotates);
    return;
  }
  const button = event.target.closest('[data-figure-id]');
  if (!button) return;
  const paper = papers.find(entry => entry.id === button.dataset.figureId);
  if (!paper?.figure) return;
  const figure = button.hasAttribute('data-companion') ? paper.figure.companion : paper.figure;
  hideFigurePreview();
  const fullImage = figureDialog.querySelector('#figure-full');
  fullImage.src = figureUrl(paper, figure);
  fullImage.alt = figure.description;
  dialogRotation.hidden = paper !== globePaper;
  dialogRotation.textContent = rotationLabel();
  figureDialog.querySelector('#figure-heading').textContent = `${paper.shortTitle} · ${figure.number}`;
  figureDialog.querySelector('#figure-description').textContent = figure.description;
  figureDialog.querySelector('#figure-source').href = figure.source;
  figureDialog.showModal();
});
figureDialog.addEventListener('click', event => {
  if (event.target === figureDialog) figureDialog.close();
});
allButton.firstChild.textContent = `View all ${papers.length} papers `;
filterButtons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
search.addEventListener('input', render);
allButton.addEventListener('click', () => { setFilter('all'); document.querySelector('#research').scrollIntoView({ behavior: 'smooth' }); });
render();

const themeToggle = document.querySelector('#theme-toggle');
function syncThemeLabel() {
  themeToggle.setAttribute('aria-label', document.documentElement.dataset.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.title = themeToggle.getAttribute('aria-label');
}
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('hao-homepage-theme', theme); } catch (e) {}
  syncThemeLabel();
});
syncThemeLabel();

const demoTrigger = document.querySelector('#code-demo-trigger');
const demoPanel = document.querySelector('#code-demo');
const demoVideo = demoPanel.querySelector('video');
const demoClose = demoPanel.querySelector('.code-demo-close');
let demoPinned = false;
let demoHideTimer;

function placeDemo() {
  if (demoPanel.hidden || document.fullscreenElement) return;
  const trigger = demoTrigger.getBoundingClientRect();
  if (trigger.bottom < 0 || trigger.top > window.innerHeight) {
    hideDemo();
    return;
  }
  const edge = 12;
  const gap = 6;
  const panel = demoPanel.getBoundingClientRect();
  const roomBelow = window.innerHeight - trigger.bottom - edge;
  const roomAbove = trigger.top - edge;
  const below = roomBelow >= panel.height + gap || roomBelow >= roomAbove;
  const top = below ? trigger.bottom + gap : trigger.top - panel.height - gap;
  const left = Math.min(trigger.left, document.documentElement.clientWidth - panel.width - edge);
  demoPanel.style.left = Math.max(edge, left) + 'px';
  demoPanel.style.top = Math.max(edge, Math.min(top, window.innerHeight - panel.height - edge)) + 'px';
}

function showDemo(pin = false) {
  clearTimeout(demoHideTimer);
  demoPinned ||= pin;
  demoPanel.hidden = false;
  demoTrigger.setAttribute('aria-expanded', 'true');
  placeDemo();
  if (!demoPanel.hidden && (pin || !reducedMotion.matches)) {
    if (!pin) demoVideo.muted = true;
    demoVideo.play().catch(() => {}); // Native play controls remain available when autoplay is blocked.
  }
}

function hideDemo(restoreFocus = false) {
  clearTimeout(demoHideTimer);
  demoPinned = false;
  demoVideo.pause();
  demoPanel.hidden = true;
  demoTrigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) demoTrigger.focus({ preventScroll: true });
}

function scheduleHideDemo() {
  clearTimeout(demoHideTimer);
  if (!demoPinned) demoHideTimer = setTimeout(hideDemo, 220);
}

demoTrigger.addEventListener('pointerenter', event => {
  if (!canHover.matches || event.pointerType === 'touch') return;
  clearTimeout(demoHideTimer);
  if (!demoPinned) showDemo();
});
demoTrigger.addEventListener('pointerleave', scheduleHideDemo);
demoPanel.addEventListener('pointerenter', () => clearTimeout(demoHideTimer));
demoPanel.addEventListener('pointerleave', scheduleHideDemo);
demoTrigger.addEventListener('click', event => {
  if (demoPinned) { hideDemo(); return; }
  showDemo(true);
  if (event.detail === 0) demoClose.focus({ preventScroll: true });
});
demoVideo.addEventListener('pointerdown', () => { demoPinned = true; });
demoVideo.addEventListener('loadedmetadata', placeDemo);
demoClose.addEventListener('click', () => hideDemo(true));
document.addEventListener('pointerdown', event => {
  if (!demoPanel.hidden && !demoPanel.contains(event.target) && !demoTrigger.contains(event.target)) hideDemo();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !demoPanel.hidden) hideDemo(demoPanel.contains(document.activeElement));
});
demoPanel.addEventListener('focusout', event => {
  if (event.relatedTarget && !demoPanel.contains(event.relatedTarget) && event.relatedTarget !== demoTrigger) hideDemo();
});
window.addEventListener('resize', placeDemo);
window.addEventListener('scroll', placeDemo, { passive: true });
document.addEventListener('visibilitychange', () => { if (document.hidden) hideDemo(); });
