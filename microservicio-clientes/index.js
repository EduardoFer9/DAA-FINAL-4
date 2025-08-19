require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Listar todos
app.get('/clientes', (req, res) => {
  db.query('SELECT * FROM clientes', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Buscar por id
app.get('/clientes/:id', (req, res) => {
  db.query('SELECT * FROM clientes WHERE id=?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows[0]) return res.status(404).json({ message: 'No encontrado' });
    res.json(rows[0]);
  });
});

// Buscar por nombre/email (query: q)
app.get('/clientes-search', (req, res) => {
  const q = `%${req.query.q || ''}%`;
  db.query(
    'SELECT * FROM clientes WHERE nombre LIKE ? OR email LIKE ?',
    [q, q],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Crear
app.post('/clientes', (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) return res.status(400).json({ message: 'Faltan datos' });
  db.query('INSERT INTO clientes (nombre, email) VALUES (?,?)', [nombre, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, nombre, email });
  });
});

// Actualizar
app.put('/clientes/:id', (req, res) => {
  const { nombre, email } = req.body;
  db.query('UPDATE clientes SET nombre=?, email=? WHERE id=?', [nombre, email, req.params.id], (err, r) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Actualizado' });
  });
});

// Eliminar
app.delete('/clientes/:id', (req, res) => {
  db.query('DELETE FROM clientes WHERE id=?', [req.params.id], (err, r) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Eliminado' });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Clientes MS en http://localhost:${PORT}`));