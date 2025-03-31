const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());

const FILE_PATH = "buecher.json";

function readBooks() {
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  } catch (error) {
    return [];
  }
}

function writeBooks(books) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(books, null, 2));
}

app.get("/books", (req, res) => {
  res.json(readBooks());
});

app.post("/books", (req, res) => {
  const { titel, autor } = req.body;

  if (!titel || !autor) {
    return res.status(400).send("Titel und Autor sind erforderlich.");
  }

  const books = readBooks();
  const newBook = { id: books.length + 1, titel, autor };
  writeBooks([...books, newBook]);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const { titel, autor } = req.body;
  const books = readBooks();
  const id = parseInt(req.params.id);
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) return res.status(404).send("Buch nicht gefunden");

  if (!titel || !autor) {
    return res.status(400).send("Titel und Autor sind erforderlich.");
  }

  books[index] = { ...books[index], ...req.body };
  writeBooks(books);
  res.json(books[index]);
});

app.delete("/books/:id", (req, res) => {
  const books = readBooks();
  const id = parseInt(req.params.id);
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) return res.status(404).send("Buch nicht gefunden");

  const updatedBooks = books.filter((book) => book.id !== id);
  writeBooks(updatedBooks);
  res.status(204).send();
});

app.get("/books/search", (req, res) => {
  const books = readBooks();
  const title = req.query.titel;

  if (!title) {
    return res.status(400).send("Suchparameter 'titel' ist erforderlich.");
  }

  const results = books.filter((book) => book.titel.toLowerCase().includes(title.toLowerCase()));
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});