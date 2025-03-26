const express = require("express");
const app = express();
const sillyname = require('sillyname');

app.get("/randomname", (req, res) => {
    const randomName = sillyname();
    res.send(randomName);
});

app.get("/", (req, res) => {
  res.send("Willkommen bei meiner eigenen API!");
});

app.get("/data", (req, res) => {
  res.json([
    { id: 1, name: "Max" },
    { id: 2, name: "Lena" }
  ]);
});

app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});