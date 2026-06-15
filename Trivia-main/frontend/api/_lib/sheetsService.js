import { google } from 'googleapis';

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
export async function getPlayers() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Players!A2:F',
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
    range: 'Results!A:I',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });

  return { success: true };
}
