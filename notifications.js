/* ============================================================
   Notifications prototype — interaction simulation only.
   Panel open/close is native (popover + popovertarget).
   Everything here would become Angular state / event handlers.
   ============================================================ */

const list        = document.querySelector('.notif-list');
const bell        = document.querySelector('.sb-bell');
const badge       = document.querySelector('.sb-bell__badge');
const unreadCount = document.querySelector('[data-unread-count]');
const filterBtns  = document.querySelectorAll('.notif-filter');

/* ── Read state helpers ──────────────────────────────────── */
function setRead(item, isRead) {
  item.classList.toggle('is-unread', !isRead);
  item.querySelector('.notif-item__unread')
      .setAttribute('aria-label', isRead ? 'Mark as unread' : 'Mark as read');
  updateCounts();
}

function updateCounts() {
  const count = list.querySelectorAll('.notif-item.is-unread').length;
  badge.textContent = count;
  badge.hidden = count === 0;
  unreadCount.textContent = `(${count})`;
  bell.setAttribute('aria-label', `Notifications, ${count} unread`);
}

/* ── All / Unread filter ─────────────────────────────────── */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    list.dataset.filter = btn.dataset.filter;
    filterBtns.forEach(b => b.setAttribute('aria-pressed', b === btn));
  });
});

/* ── Mark all as read ────────────────────────────────────── */
document.querySelector('.notif-mark-all').addEventListener('click', () => {
  list.querySelectorAll('.notif-item.is-unread').forEach(item => setRead(item, true));
});

/* ── Item interactions (delegated) ───────────────────────── */
list.addEventListener('click', event => {
  const item = event.target.closest('.notif-item');
  if (!item) return;

  // Unread dot toggles read/unread
  if (event.target.closest('.notif-item__unread')) {
    setRead(item, item.classList.contains('is-unread'));
    return;
  }

  // Accept / Decline resolves the request
  const resolveBtn = event.target.closest('[data-resolve]');
  if (resolveBtn) {
    const resolution = resolveBtn.dataset.resolve;
    item.dataset.resolution = resolution;
    item.querySelector('[data-resolved-text]').textContent =
      resolution === 'accepted' ? 'Accepted' : 'Declined';
    setRead(item, true);
    return;
  }

  // Prototype only: keep "where" links from jumping the page
  if (event.target.closest('.notif-item__where')) event.preventDefault();

  // Any other click on the item marks it read
  setRead(item, true);
});

updateCounts();
