const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Pisteet tallennetaan palvelimen muistiin
let scores = [
  { username: 'Matti', score: 1500 },
  { username: 'Maija', score: 1200 }
];

// Haetaan tulokset
app.get('/api/scores', (req, res) => {
  res.json(scores);
});

// Tallennetaan uusi tulos
app.post('/api/scores', (req, res) => {
  const { username, score } = req.body;
  if (!username || score === undefined) {
    return res.status(400).json({ error: 'Nimi ja pisteet vaaditaan' });
  }

  scores.push({ username, score });
  // Järjestetään pisteet suurimmasta pienimpään ja pidetään top 10
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 10);

  res.json({ message: 'Tulos tallennettu!', scores });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});