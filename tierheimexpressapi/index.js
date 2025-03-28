const express = require("express");
const app = express();
const fs  = require("fs"); // File System Modul, damit können wir Dateien lesen und schreiben
app.use(express.json()); // Unsere Middleware, die uns ermöglicht den Body aus dem Request auszulesen

// Hilfsfunktion
function readFile(){
    const data = fs.readFileSync("tiere.json", "utf-8");
    return JSON.parse(data);}

function writeFile(data){
    fs.writeFileSync("tiere.json", JSON.stringify(data,null,2)); // JSON.stringify wandelt ein Javascript Objekt in eine JSON Format um
}

app.get("/tiere", (req, res) => {
    const tiere = readFile();
    res.json(tiere);
});

app.post("/tiere" , (req,res) => {
    const tiere = readFile();
    const {name, art} = req.body
    
    if(name && art){
        const newTier = {
            id: tiere.length + 1, // besser (komplexere Logik) -> tiere.length > 0 ? Math.max(...tiere.map(a => a.id)) + 1 : 1;
            name: name,
            art: art
        }
        tiere.push(newTier)
        writeFile(tiere)
        res.status(201).json(newTier)
    }
    else {
        res.send("Daten unvollständig")
    }
})


app.put("/tiere/:id", (req, res) => { // Definiert eine PUT-Route, die die Tier-ID als Parameter (:id) akzeptiert.
    const tiere = readFile(); //  Liest die vorhandenen Tiere aus der Datei.
    const id = parseInt(req.params.id); // Holt die ID aus den URL-Parametern und wandelt sie in eine Zahl um.
    const tierIndex = tiere.findIndex(tier => tier.id === id); // Sucht den Index des Tieres mit der angegebenen ID im Array.

    if (tierIndex === -1) { // Überprüft, ob das Tier gefunden wurde. Wenn nicht, wird ein 404-Fehler gesendet.
        return res.status(404).send("Tier nicht gefunden");
    }

    const { name, art } = req.body; // Holt die aktualisierten Daten (Name und Art) aus dem Request-Body.
    if (name && art) { // Überprüft, ob sowohl Name als auch Art vorhanden sind.
        tiere[tierIndex] = { ...tiere[tierIndex], name, art }; // Aktualisiert das Tierobjekt im Array mit den neuen Daten.
        writeFile(tiere); // Schreibt das aktualisierte Array zurück in die Datei.
        res.json(tiere[tierIndex]); // Sendet das aktualisierte Tier als JSON-Antwort.
    } else {
        res.send("Daten unvollständig"); // Sendet eine Fehlermeldung, wenn die Daten unvollständig sind.
    }
});

app.delete("/tiere/:id", (req, res) => { // Definiert eine DELETE-Route, die die Tier-ID als Parameter akzeptiert.
    const tiere = readFile(); // Liest die vorhandenen Tiere aus der Datei.
    const id = parseInt(req.params.id); // Holt die ID aus den URL-Parametern.
    const tierIndex = tiere.findIndex(tier => tier.id === id); // Sucht den Index des Tieres mit der angegebenen ID.

    if (tierIndex === -1) { //Überprüft, ob das Tier gefunden wurde.
        return res.status(404).send("Tier nicht gefunden");
    }

    tiere.splice(tierIndex, 1); // Entfernt das Tier aus dem Array.
    writeFile(tiere); // Schreibt das aktualisierte Array zurück in die Datei.
    res.status(204).send(); // Sendet eine 204 No Content-Antwort, da kein Inhalt zurückgegeben wird
});

app.listen(5005);