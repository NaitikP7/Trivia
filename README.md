# 🎯 Trivia Tournament

A full-stack trivia quiz platform where users can participate in tournaments, answer questions, track scores, and compete on a leaderboard.

## 🚀 Features

- 📝 Multiple trivia categories
- ⏱️ Timed quiz questions
- 🏆 Tournament-based gameplay
- 📊 Real-time score tracking
- 👥 User participation and rankings
- 📱 Responsive user interface
- 🔄 Dynamic question management

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- REST APIs

## 📂 Project Structure

```text
Trivia/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/trivia-tournament.git
cd trivia-tournament
```

### Backend Setup

```bash
cd backend
npm install
```

Start the backend server:

```bash
node --watch server.js
```

Backend runs on:

```text
http://localhost:3001
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## 🎮 How to Play

1. Open the application.
2. Join or start a trivia tournament.
3. Answer questions before the timer expires.
4. Earn points for correct answers.
5. Compete against other players on the leaderboard.
6. Finish with the highest score to win the tournament.

## 🔌 API Overview

Example endpoints:

```http
GET    /api/questions
POST   /api/submit-answer
GET    /api/leaderboard
POST   /api/tournament/start
```

## 📸 Screenshots

Add screenshots of:

- Home Page
- Quiz Screen
- Tournament Lobby
- Leaderboard
- Results Page

## 🧪 Future Enhancements

- User authentication
- Multiplayer real-time tournaments
- Question difficulty levels
- Admin dashboard
- Custom tournament creation
- Achievement system

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to your branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed as a full-stack Trivia Tournament application using React, Vite, Node.js, and Express.
