
---

## 📘 Learning Circle (MVP)

**Learning Circle** is a private group-based learning tracker that helps friends stay consistent and accountable while learning together.
Users can create groups, track learning progress, set deadlines, and view each other’s progress in a controlled and private environment.

This project is built as a **full-stack web application** using **Node.js, Express, MongoDB, and EJS**, focusing on clean architecture, security, and real-world usability.

---

## 🚀 Features

### 👤 Authentication

* User registration & login
* Secure password hashing using bcrypt
* Session-based authentication

### 👥 Groups

* Create private learning groups
* Join groups using invite codes
* Admin-controlled

### 📊 Learning Progress Tracking

* Add learning topics with resources
* Set deadlines for accountability

### 🔐 Security & Data Integrity

* Role-based access control (admin vs member)
* Joi validation for all user inputs
* Centralized error handling
* Cascade cleanup of dependent data

### 🎨 User Experience

* Confirmation prompts for destructive actions
* Responsive UI using **Bootstrap + Custom CSS**

### 📩 Feedback

* Report bug link
* Suggestions link

---

## 🛠 Tech Stack

**Frontend**

* EJS (Server-side rendering)
* Bootstrap (utility styling)
* Custom CSS

**Backend**

* Node.js
* Express.js
* MongoDB & Mongoose
* Joi (validation)
* bcrypt (password hashing)
* express-session

---

## 📂 Project Structure

```
learning-circle/
├── models/
├── routes/
├── middleware/
├── views/
│   ├── auth/
│   ├── dashboard/
│   ├── groups/
│   ├── progress/
│   └── partials/
├── public/
│   ├── css/
│   └── js/
├── utils/
└── app.js
```

---

## ⚙️ Installation & Setup

```bash
git clone <repo-url>
cd learning-circle
npm install
```

Set up MongoDB locally or via MongoDB Atlas.

```bash
node app.js
```

App runs at:
👉 `http://localhost:3000`

---

## 📌 Purpose of the Project

This project was built to:

* Gain real-world full-stack development experience
* Practice secure backend architecture
* Build a meaningful product for peer learning
* Understand data relationships and system design decisions

---

## 👨‍💻 Author

**T. S. Ganesh Vamsi**
Computer Science & Engineering Student (2027)

* GitHub: [https://github.com/GaneshVamsi72](https://github.com/GaneshVamsi72)
* LinkedIn: [https://linkedin.com/in/GaneshVamsi](https://www.linkedin.com/in/sri-ganesh-vamsi-tummalapalli-81a3412b9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)
* Email: [ganeshvamsi0@gmail.com](mailto:ganeshvamsi0@gmail.com)

---