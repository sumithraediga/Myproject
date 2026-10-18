# B.Tech CSE College Attendance Calculator & Predictor (AttendX)

A modern, responsive, and student-friendly **College Attendance Calculator and Future Attendance Predictor** designed for B.Tech CSE students.

---

## 🚀 Live Features

1. **Student Profile Details**:
   - Fields for Student Name, Roll Number / UID, College Name, Branch/Department, and Semester.
   - Automatically included on printable reports and auto-saved to your browser.

2. **Subject-wise Attendance Tracker**:
   - Add, edit, duplicate, and delete subjects dynamically.
   - For every subject:
     - **Subject Name** (e.g., Data Structures, Operating Systems, DBMS, CN, AI/ML).
     - **Total Classes Conducted**
     - **Classes Attended**
     - **Classes Absent**
     - **Current Attendance %** $= (\text{Attended} / \text{Total}) \times 100$
     - Smart Stepper buttons (`+` / `-`) and live input validation to automatically verify $\text{Total} = \text{Attended} + \text{Absent}$.

3. **Future Classes Simulator / Predictor**:
   - Enter **Future Classes to Attend** and **Future Classes to Miss**.
   - Live prediction formula:
     $$\text{Future Attendance \%} = \left(\frac{\text{Current Attended} + \text{Future Attended}}{\text{Current Total} + \text{Future Attended} + \text{Future Missed}}\right) \times 100$$

4. **Target Attendance Criteria (Default 75% or Customizable)**:
   - Easily switch between preset requirements (**75%**, **80%**, **85%**, **65%**) or type any custom percentage.
   - For every subject, provides direct guidance:
     - **Classes Needed**: Number of continuous classes to attend without missing any to reach the required percentage:
       $$x = \left\lceil \frac{R \cdot \text{Total} - 100 \cdot \text{Attended}}{100 - R} \right\rceil$$
     - **Safe Bunks Allowed**: Number of classes you can safely skip while maintaining $\ge R\%$:
       $$y = \left\lfloor \frac{100 \cdot \text{Attended} - R \cdot \text{Total}}{R} \right\rfloor$$

5. **Overall Attendance Dashboard**:
   - Circular progress gauges for **Current Overall Attendance** and **Predicted Overall Attendance**.
   - Net percentage delta tag (`+X.XX% Delta`).
   - Total statistics across all subjects: Total Conducted, Total Attended, Total Absent.
   - Weighted calculation: $\text{Overall \%} = (\sum \text{Attended} / \sum \text{Total Conducted}) \times 100$ (strictly not averaging subject percentages).

6. **Formula Explainer & Step-by-Step Math Inspector**:
   - Click **"Step Math"** on any subject to inspect the exact numbers plugged into each formula.
   - Built-in visual explanation of the Data Structures example.

7. **Save & Print Formal Academic Report**:
   - Built-in `@media print` styling formats a clean, official attendance summary table for college submission or saving as PDF.

8. **Zero NaN / Zero Division Protection**:
   - Safe division logic handles $0$ classes conducted cleanly without `NaN` or `Infinity`.

---

## 📖 Example Walkthrough (Data Structures)

- **Current State**:
  - Total Classes Conducted = `40`
  - Attended = `30`
  - Absent = `10`
  - Current Attendance % = $(30 / 40) \times 100 = \mathbf{75.00\%}$
- **Future Classes Planned**:
  - Will Attend = `8`
  - Will Miss = `2`
  - Future Attendance % = $(30 + 8) / (40 + 8 + 2) \times 100 = 38 / 50 \times 100 = \mathbf{76.00\%}$

---

## 🛠️ How to Run

Simply open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari) or use a local development server.

```bash
# Optional: Open with Python local server
python -m http.server 3000
# or with npx serve
npx serve .
```
