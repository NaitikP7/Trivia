# Trivia Tournament Project Workflow & Architecture

This document describes the overall workflow of the 1v1 Trivia Tournament application and the specific role of each file in the project.

## 1. Overall Application Workflow
The Trivia Tournament application is a real-time multiplayer game built with a React frontend and a Node.js/Express/Socket.IO backend.
The core workflow is as follows:

1. **Authentication**: Players log in using a username and password. The backend verifies these credentials against a "Players" tab in a Google Spreadsheet.
2. **Setup**: Upon successful login, players receive a JWT token and initial match data, including which question set (A or B) they will face and their assigned opponent.
3. **Waiting Room**: The frontend connects to the Socket.IO server. If the opponent hasn't joined, the player rests in a "Waiting Room".
4. **Match Start**: Once both players in a specific `matchId` are connected, the match begins automatically.
5. **Gameplay**:
   - The backend pushes the first question to both players.
   - Players have a set amount of time (5 minutes per question) to deduce the answer and submit it.
   - Submissions are evaluated by the backend against the loaded question set. Correct answers grant 10 points. 
   - Once an answer is given correctly (or time runs out), the next question is served after a short delay.
6. **Match Conclusion**: When all questions in a set are completed, the match ends. 
7. **Score Submission**: The backend calculates the final score, correct answers, and completion time, and appends a new record to the "Result" tab in the Google Spreadsheet.

---

## 2. File and Directory Structure

### Backend (`/backend`)
Handles the server logic, real-time matchmaking, validation, and Google Sheets integration.
- `.env.example`: Template for required environment variables (Google Credentials, JWT secret).
- `package.json` / `package-lock.json`: Backend dependencies (express, socket.io, googleapis, jsonwebtoken, cors, dotenv).
- `server.js`: The main entry point. Configures Express, sets up CORS, registers API routes, and initializes the HTTP and Socket.IO servers.

#### `/backend/routes`
- `auth.js`: Exposes the `/api/login` endpoint. Verifies user credentials against the Google Sheet and issues a JWT.
- `score.js`: Exposes the `/api/score/submit` endpoint.

#### `/backend/services`
- `sheetsService.js`: Integrates with the Google Sheets API. Reads the player lists (credentials and match setups) and appends match results.

#### `/backend/socket`
- `matchHandler.js`: The core game engine. Manages Socket.IO connections, groups users into rooms based on `matchId`, controls the real-time flow of questions (timers, advancements), checks answers, tracking scores, and triggers the sheet update when the match finishes.

#### `/backend/middleware`
- `auth.js`: Verifies JWTs for protected Express HTTP routes.

#### `/backend/data`
- `questionsA.js` / `questionsB.js`: Hardcoded question banks. Depending on the user's assigned set in the Google Sheet, they will be given questions from Set A or Set B.

---

### Frontend (`/frontend`)
The React-based client interface using Vite, themed around a dark, detective/murder-mystery aesthetic.
- `index.html`: Base HTML template where the React app mounts and where Google Fonts are loaded.
- `package.json` / `package-lock.json`: Frontend UI dependencies (react, react-dom, socket.io-client) and build scripts.
- `vite.config.js`: Vite bundler configuration.
- `vercel.json`: Configuration for deploying the frontend to Vercel (rewrites to keep routing intact).
- `eslint.config.js`: Linting rules for the React code.

#### `/frontend/src`
- `main.jsx`: Mounts the React application into the DOM.
- `App.jsx`: The root component. Orchestrates the different game screens (Login, WaitingRoom, GameScreen, ResultScreen) based on the current `gameState`.
- `index.css` / `App.css`: Global stylesheets and utility classes defining the UI styling (dark theme, animations, fonts, layouts).

#### `/frontend/src/assets`
- Contains local image assets (like `murderer.png`, `paper.png`, `police straps.png`, etc.) used in the game's immersive background and UI.

#### `/frontend/src/context`
- `GameContext.jsx`: React Context provider that holds the global game state (`gameState`, `currentQuestion`, `feedback`, player info) so it can be easily accessed by child components without prop drilling.

#### `/frontend/src/services`
- `api.js`: Contains functions that make HTTP requests to the backend (e.g., the `loginUser` function).
- `socket.js`: Initializes and exports the singleton Socket.IO client instance linked to the backend URL.

#### `/frontend/src/components`
Reusable UI bricks for the application:
- **State Screens**: 
  - `Login.jsx`: The login form capturing username/password and triggering authentication.
  - `WaitingRoom.jsx`: Displayed while waiting for the opponent to connect to the match socket room.
  - `ResultScreen.jsx`: The end-game screen showing final scores and statistics.
- **Game Elements**:
  - `BackgroundScene.jsx`: Renders the immersive visual backdrop and moving elements (like police tapes).
  - `CaseFileCard.jsx`: The central container component framing the current question.
  - `QuestionDisplay.jsx`: Renders the specific question text and any real-time feedback.
  - `AnswerInput.jsx`: A styled text input for the user's deduction/answer.
  - `SubmitButton.jsx`: The button to send the answer to the server.
  - `ScoreBoard.jsx`: Displays current active points during gameplay.
  - `MatchTimer.jsx`: Shows the countdown timer for the current question via the backend deadline sync.
