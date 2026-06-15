import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// ---------- Auth ----------
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// ---------- Read Players ----------
/**
 * Fetches all player rows from the "Players" sheet.
 * Expected columns: username | password | player_name | match_id | set | opponent
 */
export async function getPlayers() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Players!A2:F', // skip header row
  });

  const rows = res.data.values || [];

  return rows.map((row) => ({
    username: row[0]?.trim(),
    password: row[1]?.trim(),
    playerName: row[2]?.trim(),
    matchId: row[3]?.trim(),
    set: row[4]?.trim().toUpperCase(),
    opponent: row[5]?.trim(),
  }));
}

// ---------- Find a single player by username ----------
export async function findPlayer(username) {
  const players = await getPlayers();
  return players.find((p) => p.username === username) || null;
}

// ---------- Append result row ----------
/**
 * Writes a result row to the "Results" sheet.
 * Columns: username | player_name | match_id | set | score | total_questions | correct_answers | completion_time_sec | finished_at
 */
export async function appendResult(data) {
  const row = [
    data.username,
    data.playerName,
    data.matchId,
    data.set,
    data.score,
    data.totalQuestions,
    data.correctAnswers,
    data.completionTimeSec,
    data.finishedAt || new Date().toISOString(),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Result!A:I',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });

  return { success: true };
}
