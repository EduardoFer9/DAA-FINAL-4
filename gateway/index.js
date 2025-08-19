require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Clientes
app.get('/clientes', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.CLIENTES_URL}/clientes`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Productos
app.get('/productos', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.PRODUCTOS_URL}/productos`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ventas
app.get('/ventas', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.VENTAS_URL}/ventas`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API Gateway en http://localhost:${PORT}`));