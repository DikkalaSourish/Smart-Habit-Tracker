# 🧠 Smart Habit Tracker

A full-stack web application designed to help users create, manage, and track their daily habits consistently.

The project focuses on making habit tracking simple by allowing users to maintain their habits and monitor their progress through a web-based interface.

> 🚧 **Project Status:** Currently under development. The application is presently configured for local execution, with plans for further enhancement and cloud deployment.

---

## ✨ Features

* 👤 User registration and login
* 📝 Create and manage habits
* 📅 Track daily habits
* 💾 Store user and habit data using MongoDB
* 🔐 Backend-based authentication
* 🔄 Persistent data storage
* 🌐 Web-based user interface

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Development Tools

* Git
* GitHub
* Visual Studio Code

---

## 🏗️ Project Architecture

```text
                  Smart Habit Tracker
                         │
                         ▼
                 ┌─────────────────┐
                 │    Frontend     │
                 │ HTML / CSS / JS │
                 └────────┬────────┘
                          │
                          │ HTTP Requests
                          ▼
                 ┌─────────────────┐
                 │     Backend     │
                 │ Node.js/Express │
                 └────────┬────────┘
                          │
                          │ Database Queries
                          ▼
                 ┌─────────────────┐
                 │   MongoDB Atlas  │
                 │     habitDB      │
                 └─────────────────┘
```

---

## 📂 Project Structure

```text
Smart Habit Tracker/
│
├── Backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── Frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── Lab Report/
│   ├── THINKERING LAB_SOURISH _ UPDATED.pdf
│   ├── TINKERING LAB REPORT.docx
│   ├── The-Smart-Habit-Tracker-Cultivating-Consistency.pptx
│   └── ...
│
└── .gitignore
```

---

## 🚀 Running the Project Locally

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
```

### 2. Navigate to the project

```bash
cd "Smart Habit Tracker"
```

### 3. Install backend dependencies

```bash
cd Backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `Backend` folder.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

> Never commit your `.env` file or expose your MongoDB credentials publicly.

### 5. Start the backend

```bash
node server.js
```

The backend runs locally on:

```text
http://localhost:5000
```

### 6. Open the frontend

Open:

```text
Frontend/index.html
```

in a web browser.

> The current version is configured for local development, so the frontend is opened directly from the local machine.

---

## 🗄️ Database

The project uses **MongoDB Atlas** for storing application data.

Current database:

```text
Database: habitDB
```

The backend connects to MongoDB using a connection string stored in the `.env` file.

---

## 🔐 Environment Variables

The project uses environment variables to keep sensitive configuration outside the source code.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

The `.env` file is excluded from Git using `.gitignore`.

---

## 📸 Project Screenshots

Screenshots of the application can be added here as the project UI evolves.

Example:

```markdown
![Smart Habit Tracker Dashboard](screenshots/dashboard.png)
```

---

## 🔮 Future Enhancements

The project is planned to evolve beyond the current version.

Potential improvements include:

* 📊 Habit progress analytics
* 🔥 Streak tracking
* 📅 Calendar-based habit tracking
* 🔔 Habit reminders and notifications
* 🎯 Daily and weekly goals
* 👤 Improved user profiles
* 📱 Responsive mobile-friendly interface
* 🌙 Dark mode
