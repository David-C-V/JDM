const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Base de datos
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  console.log('Conectado a SQLite');
});

db.run(`CREATE TABLE IF NOT EXISTS autos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  marca TEXT,
  modelo TEXT,
  anio INTEGER
)`);

// Rutas API
app.get('/api/autos', (req, res) => {
  db.all("SELECT * FROM autos", [], (err, rows) => {
    if (err) res.status(500).send(err.message);
    res.json(rows);
  });
});

app.get('/api/autos/:id', (req, res) => {
  db.get("SELECT * FROM autos WHERE id = ?", [req.params.id], (err, row) => {
    if (err) res.status(500).send(err.message);
    res.json(row);
  });
});

app.post('/api/autos', (req, res) => {
  const { marca, modelo, anio } = req.body;
  db.run("INSERT INTO autos (marca, modelo, anio) VALUES (?, ?, ?)", [marca, modelo, anio], function(err) {
    if (err) res.status(500).send(err.message);
    res.json({ id: this.lastID });
  });
});

app.put('/api/autos/:id', (req, res) => {
  const { marca, modelo, anio } = req.body;
  db.run("UPDATE autos SET marca = ?, modelo = ?, anio = ? WHERE id = ?", [marca, modelo, anio, req.params.id], function(err) {
    if (err) res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

app.delete('/api/autos/:id', (req, res) => {
  db.run("DELETE FROM autos WHERE id = ?", [req.params.id], function(err) {
    if (err) res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
