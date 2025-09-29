# Iron Will - Streak Counter

**Iron Will** is a simple web-based streak counter that helps users track their continuous days of activity, show their progress, and assign ranks based on their consistency. The counter persists even after closing the browser using `localStorage`. Additionally, it features a motivational **quote system** to keep users inspired every day.  

> This project was developed with the help of AI assistance.<br>
> To Use this Webapp [Click Here](https://nahid-mahbub.github.io/Iron-Will/)

---

## 🛠 Features

1. **Day Counter**
   - Tracks the number of consecutive days since the user started.
   - Stores the start date in the browser's `localStorage`.
   - Automatically calculates and displays the streak on each visit.

2. **Reset Button**
   - Allows the user to reset their streak.
   - Clears the stored start date and restarts the counter.

3. **Rank System**
   - Dynamically shows a rank based on the current streak:
     - **0–6 days → Novice**
     - **7–29 days → Disciplined**
     - **30–89 days → Iron Knight**
     - **90+ days → Iron Will Legend**

4. **Motivational Quote System**
   - Displays a new motivational quote each day.
   - Helps users stay inspired and maintain consistency.
   - Quotes are stored locally to ensure they persist across visits.

---

## 💻 Technologies Used

- HTML  
- CSS  
- JavaScript (Vanilla)  
- `localStorage` for persistent data  

---

## 🚀 How to Use

1. Clone or download the repository.
2. Open `index.html` in your browser.
3. Click **Start** to begin your streak.
4. Your streak will update automatically each day.
5. Click **Reset** to start over.
6. Read the daily motivational quote to stay inspired.
7. Use this link: [Click Here](https://nahid-mahbub.github.io/Iron-Will/)

---

## 📈 Rank System Logic

The rank updates dynamically based on the number of days counted. Example thresholds:

| Days       | Rank               |
|------------|------------------|
| 0–6        | Novice            |
| 7–29       | Disciplined       |
| 30–89      | Iron Knight       |
| 90+        | Iron Will Legend  |

---

## 💡 Motivational Quote System

- Quotes rotate daily.
- Can be customized by editing the quote list in the JavaScript file.
- Encourages users to maintain their streak.

---

## 🔧 Future Improvements

- Streak history to show past counts and achievements.
- Share your streak and quote on social media.
- Add notifications or reminders for streak maintenance.

---

## ⚡ License

This project is open-source and free to use.

---

**Iron Will** helps you stay consistent, track your progress, and motivates you daily to achieve greatness. Start your streak today!
