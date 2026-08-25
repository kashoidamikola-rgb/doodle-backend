const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./leaderboard.db', (err) => {
  if (err) console.error("Tietokantavirhe:", err.message);
  else console.log("Yhdistetty SQLite-tietokantaan.");
});

db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get('/api/scores', (req, res) => {
  const query = `SELECT username, score FROM scores ORDER BY score DESC LIMIT 5`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/scores', (req, res) => {
  const { username, score } = req.body;
  if (!username || score === undefined) {
    return res.status(400).json({ error: "Nimi ja pisteet vaaditaan!" });
  }

  const query = `INSERT INTO scores (username, score) VALUES (?, ?)`;
  db.run(query, [username, score], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tulos tallennettu!", id: this.lastID });
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend pyörii portissa ${PORT}`);
});