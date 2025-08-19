require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
});

// Endpoints que consumen otros microservicios
app.get('/externo/clientes', async (req, res) => {
  try {
    const r = await axios.get(`${process.env.CLIENTES_URL}/clientes`);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.get('/externo/productos', async (req, res) => {
  try {
    const r = await axios.get(`${process.env.PRODUCTOS_URL}/productos`);
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Listar ventas
app.get('/ventas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ventas ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener venta + detalle
app.get('/ventas/:id', async (req, res) => {
  try {
    const [venta] = await pool.query('SELECT * FROM ventas WHERE id=?', [req.params.id]);
    if (!venta[0]) return res.status(404).json({ message: 'No encontrada' });
    const [det] = await pool.query('SELECT * FROM detalle_venta WHERE venta_id=?', [req.params.id]);
    res.json({ venta: venta[0], detalle: det });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Crear venta (con items)
app.post('/ventas', async (req, res) => {
  const { cliente_id, items } = req.body; 
  // items: [{ producto_id, cantidad, precio_unitario }]
  if (!cliente_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Calcular total
    const total = items.reduce((acc, it) => acc + Number(it.cantidad) * Number(it.precio_unitario), 0);

    const [rVenta] = await conn.query(
      'INSERT INTO ventas (cliente_id, total) VALUES (?, ?)',
      [cliente_id, total]
    );
    const venta_id = rVenta.insertId;

    for (const it of items) {
      await conn.query(
        'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?,?,?,?)',
        [venta_id, it.producto_id, it.cantidad, it.precio_unitario]
      );
      // (opcional) descontar stock en productos_db vía MS productos
      // await axios.put(`${process.env.PRODUCTOS_URL}/productos/${it.producto_id}`, {...})
    }

    await conn.commit();
    res.status(201).json({ id: venta_id, cliente_id, total, items });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

// Eliminar venta (borra detalle también)
app.delete('/ventas/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM detalle_venta WHERE venta_id=?', [req.params.id]);
    await conn.query('DELETE FROM ventas WHERE id=?', [req.params.id]);
    await conn.commit();
    res.json({ message: 'Venta eliminada' });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ error: e.message });
  } finally {
    conn.release();
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Ventas MS en http://localhost:${PORT}`));