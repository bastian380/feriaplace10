const express = require('express');
const pool = require('../db');
const { verificarToken, requireRol } = require('../middleware/auth');

const router = express.Router();

const TAMANOS = ['pequeno', 'mediano', 'grande'];

// El comerciante envía una solicitud (sin elegir puesto exacto)
router.post('/', verificarToken, requireRol('comerciante'), async (req, res) => {
  const { zona_preferida, tamano_preferido, rubro, comentario } = req.body;
  if (!rubro) {
    return res.status(400).json({ error: 'El rubro es obligatorio' });
  }
  if (tamano_preferido && !TAMANOS.includes(tamano_preferido)) {
    return res.status(400).json({ error: 'Tamaño preferido inválido' });
  }
  try {
    const [resultado] = await pool.query(
      `INSERT INTO solicitud (usuario_id, zona_preferida, tamano_preferido, rubro, comentario)
       VALUES (?, ?, ?, ?, ?)`,
      [req.usuario.id, zona_preferida || null, tamano_preferido || null, rubro, comentario || null]
    );
    res.status(201).json({ id: resultado.insertId, estado: 'pendiente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar la solicitud' });
  }
});

// El comerciante ve sus propias solicitudes y su estado
router.get('/mias', verificarToken, requireRol('comerciante'), async (req, res) => {
  const [filas] = await pool.query(
    `SELECT s.id, s.zona_preferida, s.tamano_preferido, s.rubro, s.comentario, s.estado,
            s.comentario_admin, s.creado_en, s.resuelto_en,
            p.codigo AS puesto_codigo, p.zona AS puesto_zona
     FROM solicitud s
     LEFT JOIN puesto p ON p.id = s.puesto_id
     WHERE s.usuario_id = ?
     ORDER BY s.creado_en DESC`,
    [req.usuario.id]
  );
  res.json(filas);
});

// El administrador ve todas las solicitudes (opcionalmente filtradas por estado)
router.get('/', verificarToken, requireRol('administrador'), async (req, res) => {
  const { estado } = req.query;
  let sql = `SELECT s.id, s.usuario_id, u.nombre AS comerciante_nombre, u.email AS comerciante_email,
                    s.zona_preferida, s.tamano_preferido, s.rubro, s.comentario, s.estado,
                    s.comentario_admin, s.creado_en, s.resuelto_en,
                    p.codigo AS puesto_codigo
             FROM solicitud s
             JOIN usuario u ON u.id = s.usuario_id
             LEFT JOIN puesto p ON p.id = s.puesto_id`;
  const params = [];
  if (estado) {
    sql += ' WHERE s.estado = ?';
    params.push(estado);
  }
  sql += ' ORDER BY s.creado_en ASC';
  const [filas] = await pool.query(sql, params);
  res.json(filas);
});

// El administrador asigna un puesto concreto a una solicitud pendiente
router.put('/:id/asignar', verificarToken, requireRol('administrador'), async (req, res) => {
  const { id } = req.params;
  const { puesto_id } = req.body;
  if (!puesto_id) {
    return res.status(400).json({ error: 'Debes indicar el puesto a asignar' });
  }

  const conexion = await pool.getConnection();
  try {
    await conexion.beginTransaction();

    const [solicitudes] = await conexion.query(
      'SELECT * FROM solicitud WHERE id = ? FOR UPDATE',
      [id]
    );
    if (solicitudes.length === 0) {
      await conexion.rollback();
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    if (solicitudes[0].estado !== 'pendiente') {
      await conexion.rollback();
      return res.status(409).json({ error: 'La solicitud ya fue resuelta' });
    }

    const [puestos] = await conexion.query(
      "SELECT * FROM puesto WHERE id = ? AND estado = 'disponible' FOR UPDATE",
      [puesto_id]
    );
    if (puestos.length === 0) {
      await conexion.rollback();
      return res.status(409).json({ error: 'Ese puesto ya no está disponible' });
    }

    await conexion.query("UPDATE puesto SET estado = 'ocupado' WHERE id = ?", [puesto_id]);
    await conexion.query(
      `UPDATE solicitud SET estado = 'confirmada', puesto_id = ?, resuelto_en = NOW() WHERE id = ?`,
      [puesto_id, id]
    );

    await conexion.commit();
    res.json({ id: Number(id), estado: 'confirmada', puesto_id: Number(puesto_id) });
  } catch (err) {
    await conexion.rollback();
    console.error(err);
    res.status(500).json({ error: 'Error al asignar el puesto' });
  } finally {
    conexion.release();
  }
});

// El administrador rechaza una solicitud pendiente
router.put('/:id/rechazar', verificarToken, requireRol('administrador'), async (req, res) => {
  const { id } = req.params;
  const { comentario_admin } = req.body;
  const [resultado] = await pool.query(
    `UPDATE solicitud SET estado = 'rechazada', comentario_admin = ?, resuelto_en = NOW()
     WHERE id = ? AND estado = 'pendiente'`,
    [comentario_admin || null, id]
  );
  if (resultado.affectedRows === 0) {
    return res.status(409).json({ error: 'La solicitud no existe o ya fue resuelta' });
  }
  res.json({ id: Number(id), estado: 'rechazada' });
});

module.exports = router;
