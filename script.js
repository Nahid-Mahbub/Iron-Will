const daysEl       = document.getElementById('days');
const hmsEl        = document.getElementById('hms');
const resetBtn     = document.getElementById('resetBtn');
const fgCircle     = document.querySelector('.fg');
const quoteBox     = document.getElementById('quoteDisplay');
const rankBadge    = document.getElementById('rankBadge');
const progressText = document.getElementById('progressText');

const historyBtn   = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistory = document.getElementById('closeHistory');
const historyList  = document.getElementById('historyList');

const rankBtn   = document.getElementById('rankBtn');
const rankModal = document.getElementById('rankModal');
const closeRank = document.getElementById('closeRank');
const rankList  = document.getElementById('rankList');

/* ===== Reset Modal ===== */
const resetModal       = document.getElementById('resetModal');
const closeReset       = document.getElementById('closeReset');
const resetNote        = document.getElementById('resetNote');
const resetCancelBtn   = document.getElementById('resetCancelBtn');
const resetConfirmBtn  = document.getElementById('resetConfirmBtn');
const resetStreakPreview = document.getElementById('resetStreakPreview');

/* ===== History Actions ===== */
const exportHistoryBtn  = document.getElementById('exportHistoryBtn');
const importHistoryFile = document.getElementById('importHistoryFile');
const clearDataBtn      = document.getElementById('clearDataBtn');

/* ===== Start Date Picker Elements ===== */
const dateToggleBtn    = document.getElementById('dateToggleBtn');
const datePanel        = document.getElementById('datePanel');
const datePanelClose   = document.getElementById('datePanelClose');
const startDateInput   = document.getElementById('startDateInput');
const setStartDateBtn  = document.getElementById('setStartDateBtn');
const currentStartText = document.getElementById('currentStartText');

const circumference = 2 * Math.PI * 90;
const MAX_HISTORY   = 500;

/* ===== Rank Data ===== */
const ranks = [
  { name: 'Novice',      min: 0,   max: 6,        emoji: '🌱', color: '#95a5a6' },
  { name: 'Apprentice',  min: 7,   max: 20,       emoji: '💪', color: '#3498db' },
  { name: 'Disciplined', min: 21,  max: 49,       emoji: '🔥', color: '#e67e22' },
  { name: 'Iron Knight', min: 50,  max: 99,       emoji: '⚔️', color: '#9b59b6' },
  { name: 'Iron Master', min: 100, max: 199,      emoji: '🛡️', color: '#e74c3c' },
  { name: 'Iron Legend', min: 200, max: Infinity, emoji: '👑', color: '#f1c40f' }
];

/* ===== Quotes ===== */
const quotes = [
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements.", author: "John Maxwell" },
  { text: "Strength grows in the moments when you think you can't go on but you keep going anyway.", author: "Unknown" },
  { text: "What you do every day matters more than what you do once in a while.", author: "Gretchen Rubin" },
  { text: "Consistency is harder when no one is clapping for you.", author: "Anonymous" },
  { text: "A river cuts through rock not because of its power, but because of its persistence.", author: "Jim Watkins" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" }
];

/* ===== Storage Utilities ===== */
function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Could not save to localStorage');
  }
}

function getStartDate() {
  return getStorageItem('ironWillStart');
}

function setStartDate(isoString = null) {
  if (isoString) {
    setStorageItem('ironWillStart', isoString);
  } else if (!getStartDate()) {
    setStorageItem('ironWillStart', new Date().toISOString());
  }
}

function findRank(days) {
  return ranks.find(r => days >= r.min && days <= r.max);
}

function nextRankTarget(r) {
  return r.max === Infinity ? Infinity : r.max + 1;
}

/* ===== Timestamp Formatter ===== */
function formatTimestamp(dateStr) {
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleString(undefined, {
      year:   'numeric',
      month:  'short',
      day:    'numeric',
      hour:   '2-digit',
      minute: '2-digit'
    });
  }
  return dateStr; // legacy locale strings fall through unchanged
}

/* ===== Toast ===== */
let toastTimer = null;
function showToast(msg, duration = 3200) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ===== Counter Update ===== */
function updateCounter() {
  const start = new Date(getStartDate());
  const now   = new Date();
  const diff  = now - start;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs  = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  daysEl.textContent = `${days} day${days !== 1 ? 's' : ''}`;
  hmsEl.textContent  = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  // Progress ring
  const rank   = findRank(days);
  const target = nextRankTarget(rank);
  let progress = 0;

  if (target !== Infinity) {
    progress = (days - rank.min) / (target - rank.min);
    if (progress > 1) progress = 1;
  } else {
    progress = 1;
  }

  fgCircle.style.strokeDashoffset = circumference * (1 - progress);

  // Rank badge
  rankBadge.textContent = `${rank.emoji} ${rank.name}`;

  // Progress text
  if (target !== Infinity) {
    const remaining = target - days;
    const nextRank  = ranks.find(r => r.min === target);
    progressText.textContent = `${remaining} day${remaining !== 1 ? 's' : ''} to ${nextRank ? nextRank.name : 'next rank'}`;
  } else {
    progressText.textContent = 'Maximum rank achieved! 👑';
  }

  updateQuote(days);
}

function updateQuote(days) {
  const quote = quotes[days % quotes.length];
  quoteBox.innerHTML = `"${quote.text}"<footer>- ${quote.author}</footer>`;
}

/* ===== History — Add Entry ===== */
function addHistoryEntry(days, note = '') {
  let history = getStorageItem('ironWillHistory', []);
  const rank  = findRank(days);

  history.push({
    date:  new Date().toISOString(),
    days:  days,
    rank:  rank.name,
    emoji: rank.emoji,
    note:  note.trim()
  });

  // Trim to MAX_HISTORY most recent entries
  if (history.length > MAX_HISTORY) {
    history = history.slice(-MAX_HISTORY);
  }

  setStorageItem('ironWillHistory', history);
}

/* ===== Reset — Custom Modal Flow ===== */
function openResetModal() {
  const start = new Date(getStartDate());
  const days  = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
  const rank  = findRank(days);
  resetStreakPreview.innerHTML =
    `<span class="preview-days">${rank.emoji} ${days} day${days !== 1 ? 's' : ''}</span>` +
    `<span class="preview-rank" style="color:${rank.color}">${rank.name}</span>`;
  resetNote.value = '';
  resetModal.style.display = 'block';
}

function closeResetModal() {
  resetModal.style.display = 'none';
}

function confirmReset() {
  const start = new Date(getStartDate());
  const days  = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
  const note  = resetNote.value;

  addHistoryEntry(days, note);
  setStartDate(new Date().toISOString());
  syncDatePickerInput();
  updateCounter();
  closeResetModal();
  showToast(`✓ Streak of ${days} day${days !== 1 ? 's' : ''} saved to history.`);
}

/* ===== History Display ===== */
function showHistory() {
  const history = getStorageItem('ironWillHistory', []);
  historyList.innerHTML = history.length
    ? history.slice().reverse().map(h => `
        <li>
          <div class="history-main">
            <strong>${h.emoji} ${h.days} day${h.days !== 1 ? 's' : ''}</strong>
            <span class="history-rank" style="color:${ranks.find(r => r.name === h.rank)?.color || '#21f373'};">
              ${h.rank}
            </span>
            ${h.note ? `<div class="history-note">"${h.note}"</div>` : ''}
          </div>
          <div class="history-date">${formatTimestamp(h.date)}</div>
        </li>`).join('')
    : '<li style="text-align:center;color:#666;padding:20px;">No history yet. Start your journey!</li>';
  historyModal.style.display = 'block';
}

/* ===== Export History as JSON ===== */
function exportHistoryJSON() {
  const history = getStorageItem('ironWillHistory', []);
  if (!history.length) {
    showToast('⚠️ No history to export yet.');
    return;
  }
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const ts   = new Date().toISOString().slice(0, 10);
  a.href     = url;
  a.download = `iron-will-history-${ts}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`✓ Exported ${history.length} entries.`);
}

/* ===== Import History from JSON ===== */
function importHistoryJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error('Not an array');

      const valid = imported.filter(h =>
        typeof h.days === 'number' && typeof h.rank === 'string'
      );
      if (!valid.length) {
        showToast('⚠️ No valid entries found in file.');
        return;
      }

      const existing = getStorageItem('ironWillHistory', []);
      const merged   = [...existing, ...valid];

      // Deduplicate by date + days combo
      const seen   = new Set();
      const deduped = merged.filter(h => {
        const key = `${h.date}_${h.days}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Sort chronologically
      deduped.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Trim to cap
      const trimmed = deduped.slice(-MAX_HISTORY);
      setStorageItem('ironWillHistory', trimmed);

      showHistory(); // refresh modal
      showToast(`✓ Imported ${valid.length} entries. Total: ${trimmed.length}.`);
    } catch {
      showToast('⚠️ Import failed — invalid JSON file.');
    }
    // Reset file input so same file can be re-imported if needed
    importHistoryFile.value = '';
  };
  reader.readAsText(file);
}

/* ===== Clear All Data ===== */
function clearAllData() {
  // Two-step: ask via modal first (already in History modal context)
  if (!confirm('⚠️ This will permanently delete your streak AND all history.\n\nThis cannot be undone. Continue?')) return;

  localStorage.removeItem('ironWillStart');
  localStorage.removeItem('ironWillHistory');

  setStartDate();          // re-init with now
  syncDatePickerInput();
  updateCounter();
  historyModal.style.display = 'none';
  showToast('🗑 All data cleared. Fresh start!');
}

/* ===== Rank Display ===== */
function showRank() {
  const days    = Math.floor((new Date() - new Date(getStartDate())) / (1000 * 60 * 60 * 24));
  const current = findRank(days);
  rankList.innerHTML = ranks.map(r => `
    <li class="${r.name === current.name ? 'current' : ''}" style="border-left-color:${r.color};">
      ${r.emoji} <strong>${r.name}</strong> — ${r.min}${r.max !== Infinity ? '–' + r.max : '+'} days
      ${r.name === current.name ? '<span style="color:#21f373;"> (Current)</span>' : ''}
    </li>`).join('');
  rankModal.style.display = 'block';
}

/* ===================================================
   ===== START DATE PICKER LOGIC =====
   =================================================== */
function syncDatePickerInput() {
  const saved = getStartDate();
  if (!saved) return;

  const d   = new Date(saved);
  const pad = n => String(n).padStart(2, '0');
  const localISO = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  startDateInput.value = localISO;

  currentStartText.textContent = d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function capDateInputToNow() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const localISO = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  startDateInput.max = localISO;
}

function toggleDatePanel() {
  const isOpen = datePanel.classList.contains('open');
  isOpen ? closeDatePanel() : (capDateInputToNow(), datePanel.classList.add('open'), dateToggleBtn.classList.add('active'));
}

function closeDatePanel() {
  datePanel.classList.remove('open');
  dateToggleBtn.classList.remove('active');
}

function applyStartDate() {
  const raw = startDateInput.value;
  if (!raw) { alert('⚠️ Please choose a date and time first.'); return; }

  const chosen = new Date(raw);
  const now    = new Date();

  if (chosen > now) {
    alert('⚠️ The start date cannot be in the future.\nPlease pick a past or current date.');
    startDateInput.value = '';
    return;
  }
  if (isNaN(chosen.getTime())) { alert('⚠️ Invalid date. Please try again.'); return; }

  setStartDate(chosen.toISOString());
  syncDatePickerInput();
  updateCounter();

  setStartDateBtn.textContent = '✓ Saved!';
  setStartDateBtn.classList.add('saved');
  setTimeout(() => {
    setStartDateBtn.textContent = 'Set Start Date';
    setStartDateBtn.classList.remove('saved');
    closeDatePanel();
  }, 1400);
}

/* ===== Event Listeners ===== */
resetBtn.addEventListener('click', openResetModal);
closeReset.addEventListener('click', closeResetModal);
resetCancelBtn.addEventListener('click', closeResetModal);
resetConfirmBtn.addEventListener('click', confirmReset);

historyBtn.addEventListener('click', showHistory);
rankBtn.addEventListener('click', showRank);

closeHistory.addEventListener('click', () => historyModal.style.display = 'none');
closeRank.addEventListener('click',    () => rankModal.style.display    = 'none');

exportHistoryBtn.addEventListener('click', exportHistoryJSON);
importHistoryFile.addEventListener('change', e => importHistoryJSON(e.target.files[0]));
clearDataBtn.addEventListener('click', clearAllData);

window.addEventListener('click', e => {
  if (e.target === historyModal) historyModal.style.display = 'none';
  if (e.target === rankModal)    rankModal.style.display    = 'none';
  if (e.target === resetModal)   closeResetModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    historyModal.style.display = 'none';
    rankModal.style.display    = 'none';
    closeResetModal();
    closeDatePanel();
  }
});

dateToggleBtn.addEventListener('click', e => { e.stopPropagation(); toggleDatePanel(); });
datePanelClose.addEventListener('click', closeDatePanel);
setStartDateBtn.addEventListener('click', applyStartDate);

document.addEventListener('click', e => {
  const corner = document.getElementById('datePickerCorner');
  if (!corner.contains(e.target)) closeDatePanel();
});

/* ===== Initialize ===== */
setStartDate();
syncDatePickerInput();
setInterval(() => { capDateInputToNow(); updateCounter(); }, 1000);
updateCounter();
