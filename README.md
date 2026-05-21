# Iron Will - Streak Counter

**Iron Will** is a simple yet powerful web-based streak counter that helps users track their continuous days of activity, monitor progress, and stay motivated with daily inspiration. The app uses `localStorage` to preserve streaks, history, notes, and settings even after closing the browser.

Now upgraded with a smarter **history management system**, **backup/import support**, **session notes**, and improved data handling for a better user experience.

> This project was developed with the help of AI assistance.  
> To use this web app [Click Here](https://nahid-mahbub.github.io/Iron-Will/)

---

# 🛠 Features

## 1. 📅 Day Counter
- Tracks the number of consecutive days since the user started.
- Automatically calculates the streak every time the app is opened.
- Stores streak data securely in the browser using `localStorage`.

---

## 2. 🔄 Reset & Clear Data System
- Reset your current streak anytime.
- New **Clear Cache / Reset All Data** system:
  - Removes streak data
  - Clears saved history
  - Deletes session notes
  - Resets the app to a fresh state

---

## 3. 🏆 Rank System

The app dynamically assigns ranks based on consistency:

| Days | Rank |
|------|------|
| 0–6 | Novice |
| 7–29 | Disciplined |
| 30–89 | Iron Knight |
| 90+ | Iron Will Legend |

Ranks update automatically as the streak grows.

---

## 4. 💡 Motivational Quote System
- Displays motivational quotes daily.
- Keeps users inspired and consistent.
- Quotes persist locally between visits.
- Easily customizable from the JavaScript source.

---

## 5. 📜 Advanced History System

The upgraded history system now includes:

✅ Bigger and smarter history tracking  
✅ History limit increased to **500 entries**  
✅ Better and cleaner timestamps  
✅ Improved storage handling  

Users can now keep long-term streak records without quickly losing old data.

---

## 6. 💾 Backup & Restore System

### Save History as JSON
- Export streak history as a `.json` backup file.
- Useful for transferring data between devices or keeping backups.

### Import History from Backup
- Restore saved history instantly from exported JSON files.
- Makes data recovery simple and reliable.

---

## 7. 📝 Session Notes Support
- Add personal notes for each session or streak period.
- Helps users track thoughts, goals, challenges, or achievements during their journey.

---

# 💻 Technologies Used

- HTML  
- CSS  
- JavaScript (Vanilla)  
- `localStorage` for persistent storage  

---

# 🚀 How to Use

1. Clone or download the repository.
2. Open `index.html` in your browser.
3. Click **Start** to begin your streak.
4. Your streak updates automatically every day.
5. Read the motivational quote for daily inspiration.
6. Add optional session notes to track your progress.
7. Export your data anytime using the JSON backup system.
8. Import backup files when needed.
9. Use **Reset** or **Clear Cache** if you want a fresh start.

## 🌐 Live Demo
[Click Here](https://nahid-mahbub.github.io/Iron-Will/)

---

# 📈 Rank System Logic

| Days | Rank |
|------|------|
| 0–6 | Novice |
| 7–29 | Disciplined |
| 30–89 | Iron Knight |
| 90+ | Iron Will Legend |

---

# 💾 Data Persistence

All data is stored locally in the browser using `localStorage`, including:
- Current streak
- History entries
- Motivational quote data
- Session notes
- Backup-related information

No external database or server is required.

---

# 🔧 Future Improvements

- Achievement badges system
- Social sharing support
- Reminder notifications
- Cloud sync support
- Dark/Light theme toggle
- Analytics dashboard for streak insights

---

# ⚡ License

This project is open-source and free to use.

---

# 🌟 Final Words

**Iron Will** is designed to help users build discipline, stay consistent, and visualize progress over time. Whether you're building habits, studying daily, working out, or improving yourself — Iron Will keeps you accountable and motivated every single day.
