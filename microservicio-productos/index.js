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

app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/productos/:id', (req, res) => {
  db.query('SELECT * FROM productos WHERE id=?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows[0]) return res.status(404).json({ message: 'No encontrado' });
    res.json(rows[0]);
  });
});

app.get('/productos-search', (req, res) => {
  const q = `%${req.query.q || ''}%`;
  db.query('SELECT * FROM productos WHERE nombre LIKE ?', [q], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/productos', (req, res) => {
  const { nombre, precio, stock } = req.body;
  if (!nombre || precio == null || stock == null) return res.status(400).json({ message: 'Faltan datos' });
  db.query(
    'INSERT INTO productos (nombre, precio, stock) VALUES (?,?,?)',
    [nombre, precio, stock],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nombre, precio, stock });
    }
  );
});

app.put('/productos/:id', (req, res) => {
  const { nombre, precio, stock } = req.body;
  db.query(
    'UPDATE productos SET nombre=?, precio=?, stock=? WHERE id=?',
    [nombre, precio, stock, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Actualizado' });
    }
  );
});

app.delete('/productos/:id', (req, res) => {
  db.query('DELETE FROM productos WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Eliminado' });
  });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Productos MS en http://localhost:${PORT}`));