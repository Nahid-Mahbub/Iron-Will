const daysEl = document.getElementById('days');
const hmsEl = document.getElementById('hms');
const resetBtn = document.getElementById('resetBtn');
const fgCircle = document.querySelector('.fg');

const quoteBox = document.querySelector('.quote');   // <== target quote area

const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistory = document.getElementById('closeHistory');
const historyList = document.getElementById('historyList');

const rankBtn = document.getElementById('rankBtn');
const rankModal = document.getElementById('rankModal');
const closeRank = document.getElementById('closeRank');
const rankList = document.getElementById('rankList');

const circumference = 2 * Math.PI * 90;

/* ===== Rank Data ===== */
const ranks = [
  { name: 'Novice',      min: 0,  max: 6  },
  { name: 'Disciplined', min: 7,  max: 29 },
  { name: 'Iron Knight', min: 30, max: 89 },
  { name: 'Iron Legend', min: 90, max: Infinity }
];

/* ===== Daily Quotes ===== */
const quotes = [
  "Discipline is the bridge between goals and accomplishment. – Jim Rohn",
  "The future depends on what you do today. – Mahatma Gandhi",
  "Do what you can, with what you have, where you are. – Theodore Roosevelt",
  "Small disciplines repeated with consistency every day lead to great achievements. – John Maxwell",
  "Strength grows in the moments when you think you can’t go on but you keep going anyway.",
  "What you do every day matters more than what you do once in a while. – Gretchen Rubin",
  "Consistency is harder when no one is clapping for you. – Anonymous",
  "A river cuts through rock not because of its power, but because of its persistence. – Jim Watkins"
];

/* ===== Utilities ===== */
function getStartDate() { return localStorage.getItem('ironWillStart'); }
function setStartDate() {
  if (!getStartDate()) localStorage.setItem('ironWillStart', new Date().toISOString());
}
function findRank(days) {
  return ranks.find(r => days >= r.min && days <= r.max);
}
function nextRankTarget(r) {
  return r.max === Infinity ? Infinity : r.max + 1;
}

/* ===== Main Counter Update ===== */
function updateCounter() {
  const start = new Date(getStartDate());
  const now   = new Date();
  const diff  = now - start;

  const days  = Math.floor(diff / (1000*60*60*24));
  const hrs   = Math.floor((diff / (1000*60*60)) % 24);
  const mins  = Math.floor((diff / (1000*60)) % 60);
  const secs  = Math.floor((diff / 1000) % 60);

  daysEl.textContent = `${days} day${days !== 1 ? 's' : ''}`;
  hmsEl.textContent  = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

  // Progress Ring
  const rank   = findRank(days);
  const target = nextRankTarget(rank);
  let progress = 1;
  if (target !== Infinity) {
    progress = (days - rank.min) / (target - rank.min);
    if (progress > 1) progress = 1;
  }
  fgCircle.style.strokeDashoffset = circumference * (1 - progress);

  // Daily Quote (cycle through list by day index)
  const quoteIndex = days % quotes.length;
  quoteBox.innerHTML = `“${quotes[quoteIndex].split('–')[0].trim()}”<footer>– ${quotes[quoteIndex].split('–')[1] || ''}</footer>`;
}

/* ===== History ===== */
function addHistoryEntry(days) {
  const arr = JSON.parse(localStorage.getItem('ironWillHistory') || '[]');
  arr.push({ date: new Date().toLocaleString(), days });
  localStorage.setItem('ironWillHistory', JSON.stringify(arr));
}

/* ===== Reset ===== */
function resetCounter() {
  const start = new Date(getStartDate());
  const days  = Math.floor((new Date() - start) / (1000*60*60*24));
  addHistoryEntry(days);
  localStorage.setItem('ironWillStart', new Date().toISOString());
}

/* ===== Show History ===== */
function showHistory() {
  const arr = JSON.parse(localStorage.getItem('ironWillHistory') || '[]');
  historyList.innerHTML = arr.length
    ? arr.map(h => `<li>${h.date} — ${h.days} day${h.days!==1?'s':''}</li>`).join('')
    : '<li>No history yet.</li>';
  historyModal.style.display = 'block';
}

/* ===== Show Rank ===== */
function showRank() {
  const days = Math.floor((new Date() - new Date(getStartDate())) / (1000*60*60*24));
  const current = findRank(days);
  rankList.innerHTML = ranks.map(r =>
    `<li class="${r.name === current.name ? 'current' : ''}">
       ${r.name} — ${r.min}${r.max!==Infinity ? '–'+r.max : '+'} days
     </li>`
  ).join('');
  rankModal.style.display = 'block';
}

/* ===== Event Listeners ===== */
resetBtn.addEventListener('click', resetCounter);
historyBtn.addEventListener('click', showHistory);
rankBtn.addEventListener('click', showRank);
closeHistory.addEventListener('click', ()=>historyModal.style.display='none');
closeRank.addEventListener('click', ()=>rankModal.style.display='none');
window.addEventListener('click', e => {
  if (e.target === historyModal) historyModal.style.display='none';
  if (e.target === rankModal)    rankModal.style.display='none';
});

/* ===== Init ===== */
if (!getStartDate()) setStartDate();
setInterval(updateCounter, 1000);
updateCounter();
