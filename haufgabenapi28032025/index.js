const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(express.json());

const FILE_PATH = "buecher.json";

function readBooks() {
  return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
}

function writeBooks(books) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(books, null, 2));
}

app.get("/books", (req, res) => {
  res.json(readBooks());
});

app.post("/books", (req, res) => {
  const books = readBooks();
  const newBook = { id: books.length + 1, ...req.body };
  writeBooks([...books, newBook]);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const books = readBooks();
  const id = parseInt(req.params.id);
  const index = books.findIndex((book) => book.id === id);

  if (index === -1) return res.status(404).send("Buch nicht gefunden");

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
  const title = req.query.titel.toLowerCase();
  const results = books.filter((book) => book.titel.toLowerCase().includes(title));
  res.json(results);
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});