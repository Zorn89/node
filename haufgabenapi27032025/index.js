const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let tiere = [
  { id: 1, name: "Bello", art: "Hund", alter: 3 },
  { id: 2, name: "Mieze", art: "Katze", alter: 5 },
  { id: 3, name: "Charlie", art: "Hund", alter: 2 },
  { id: 4, name: "Nemo", art: "Fisch", alter: 1 },
];

// 1. GET /tiere
app.get('/tiere', (req, res) => {
  res.json(tiere);
});


app.get('/tiere/search', (req, res) => {
  const art = req.query.art;
  const gefilterteTiere = tiere.filter(tier => tier.art.toLowerCase() === art.toLowerCase());
  res.json(gefilterteTiere);
});

// 3. GET /tiere/:id
app.get('/tiere/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const tier = tiere.find(tier => tier.id === id);
  res.json(tier || {});
});

// 4. POST /tiere
app.post('/tiere', (req, res) => {
  const neuesTier = { ...req.body, id: tiere.length + 1 };
  tiere.push(neuesTier);
  res.status(201).json(neuesTier);
});

app.listen(port, () => {
  console.log("API läuft auf http://localhost:3000");
});