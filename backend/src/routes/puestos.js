const express = require('express');
const pool = require('../db');
const { verificarToken, requireRol } = require('../middleware/auth');

const router = express.Router();

// Mapa completo de la feria (solo lectura, referencia para cualquier usuario autenticado)
router.get('/', verificarToken, async (req, res) => {
  const [puestos] = await pool.query('SELECT id, codigo, zona, tamano, estado FROM puesto ORDER BY codigo');
  res.json(puestos);
});

// Puestos libres, usado por el administrador al asignar una solicitud
router.get('/disponibles', verificarToken, requireRol('administrador'), async (req, res) => {
  const [puestos] = await pool.query(
    "SELECT id, codigo, zona, tamano FROM puesto WHERE estado = 'disponible' ORDER BY codigo"
  );
  res.json(puestos);
});

module.exports = router;
