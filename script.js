const daysEl = document.getElementById('days');
const hmsEl = document.getElementById('hms');
const resetBtn = document.getElementById('resetBtn');
const fgCircle = document.querySelector('.fg');
const quoteBox = document.getElementById('quoteDisplay');
const rankBadge = document.getElementById('rankBadge');
const progressText = document.getElementById('progressText');

const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistory = document.getElementById('closeHistory');
const historyList = document.getElementById('historyList');

const rankBtn = document.getElementById('rankBtn');
const rankModal = document.getElementById('rankModal');
const closeRank = document.getElementById('closeRank');
const rankList = document.getElementById('rankList');

const circumference = 2 * Math.PI * 90;

/* ===== Improved Rank Data ===== */
const ranks = [
  { name: 'Novice',      min: 0,   max: 6,   emoji: '🌱', color: '#95a5a6' },
  { name: 'Apprentice',  min: 7,   max: 20,  emoji: '💪', color: '#3498db' },
  { name: 'Disciplined', min: 21,  max: 49,  emoji: '🔥', color: '#e67e22' },
  { name: 'Iron Knight', min: 50,  max: 99,  emoji: '⚔️', color: '#9b59b6' },
  { name: 'Iron Master', min: 100, max: 199, emoji: '🛡️', color: '#e74c3c' },
  { name: 'Iron Legend', min: 200, max: Infinity, emoji: '👑', color: '#f1c40f' }
];

/* ===== Enhanced Quotes ===== */
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

function setStartDate() {
  if (!getStartDate()) {
    setStorageItem('ironWillStart', new Date().toISOString());
  }
}

function findRank(days) {
  return ranks.find(r => days >= r.min && days <= r.max);
}

function nextRankTarget(r) {
  return r.max === Infinity ? Infinity : r.max + 1;
}

/* ===== Enhanced Counter Update ===== */
function updateCounter() {
  const start = new Date(getStartDate());
  const now = new Date();
  const diff = now - start;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  daysEl.textContent = `${days} day${days !== 1 ? 's' : ''}`;
  hmsEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Enhanced Progress Ring
  const rank = findRank(days);
  const target = nextRankTarget(rank);
  let progress = 0;

  if (target !== Infinity) {
    progress = (days - rank.min) / (target - rank.min);
    if (progress > 1) progress = 1;
  } else {
    progress = 1;
  }

  fgCircle.style.strokeDashoffset = circumference * (1 - progress);

  // Update rank badge
  rankBadge.textContent = `${rank.emoji} ${rank.name}`;

  // Update progress text
  if (target !== Infinity) {
    const remaining = target - days;
    const nextRank = ranks.find(r => r.min === target);
    progressText.textContent = `${remaining} days to ${nextRank ? nextRank.name : 'next rank'}`;
  } else {
    progressText.textContent = 'Maximum rank achieved! 👑';
  }

  // Enhanced Daily Quote
  updateQuote(days);
}

function updateQuote(days) {
  const quoteIndex = days % quotes.length;
  const quote = quotes[quoteIndex];
  quoteBox.innerHTML = `
    "${quote.text}"
    <footer>- ${quote.author}</footer>
  `;
}

/* ===== Enhanced History ===== */
function addHistoryEntry(days) {
  const history = getStorageItem('ironWillHistory', []);
  const rank = findRank(days);
  history.push({
    date: new Date().toLocaleString(),
    days: days,
    rank: rank.name,
    emoji: rank.emoji
  });
  setStorageItem('ironWillHistory', history);
}

/* ===== Improved Reset with Confirmation ===== */
function resetCounter() {
  if (confirm('Are you sure you want to reset your progress? This will save your current streak to history.')) {
    const start = new Date(getStartDate());
    const days = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
    addHistoryEntry(days);
    setStorageItem('ironWillStart', new Date().toISOString());
    updateCounter();
  }
}

/* ===== Enhanced History Display ===== */
function showHistory() {
  const history = getStorageItem('ironWillHistory', []);
  historyList.innerHTML = history.length
    ? history.reverse().map(h => `
        <li>
          <div>
            <strong>${h.emoji} ${h.days} day${h.days !== 1 ? 's' : ''}</strong>
            <br>
            <span style="color: ${ranks.find(r => r.name === h.rank)?.color || '#21f373'};">
              ${h.rank}
            </span>
          </div>
          <div class="history-date">${h.date}</div>
        </li>
      `).join('')
    : '<li style="text-align: center; color: #666;">No history yet. Start your journey!</li>';
  historyModal.style.display = 'block';
}

/* ===== Enhanced Rank Display ===== */
function showRank() {
  const days = Math.floor((new Date() - new Date(getStartDate())) / (1000 * 60 * 60 * 24));
  const current = findRank(days);
  
  rankList.innerHTML = ranks.map(r => `
    <li class="${r.name === current.name ? 'current' : ''}" style="border-left-color: ${r.color};">
      ${r.emoji} <strong>${r.name}</strong> — ${r.min}${r.max !== Infinity ? '–' + r.max : '+'} days
      ${r.name === current.name ? ' <span style="color: #21f373;">(Current)</span>' : ''}
    </li>
  `).join('');
  
  rankModal.style.display = 'block';
}

/* ===== Event Listeners ===== */
resetBtn.addEventListener('click', resetCounter);
historyBtn.addEventListener('click', showHistory);
rankBtn.addEventListener('click', showRank);
closeHistory.addEventListener('click', () => historyModal.style.display = 'none');
closeRank.addEventListener('click', () => rankModal.style.display = 'none');

window.addEventListener('click', e => {
  if (e.target === historyModal) historyModal.style.display = 'none';
  if (e.target === rankModal) rankModal.style.display = 'none';
});

/* ===== Keyboard Support ===== */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    historyModal.style.display = 'none';
    rankModal.style.display = 'none';
  }
});

/* ===== Initialize ===== */
setStartDate();
setInterval(updateCounter, 1000);
updateCounter();