require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./db');

const ZONAS = [
  { prefijo: 'A', nombre: 'Zona A - Comida', cantidad: 6, tamano: 'mediano' },
  { prefijo: 'B', nombre: 'Zona B - Artesanía', cantidad: 6, tamano: 'pequeno' },
  { prefijo: 'C', nombre: 'Zona C - Ropa y accesorios', cantidad: 4, tamano: 'grande' },
];

async function seedPuestos() {
  const [existentes] = await pool.query('SELECT COUNT(*) AS total FROM puesto');
  if (existentes[0].total > 0) {
    console.log('Los puestos ya estaban creados, se omite.');
    return;
  }
  for (const zona of ZONAS) {
    for (let i = 1; i <= zona.cantidad; i++) {
      const codigo = `${zona.prefijo}${i}`;
      await pool.query(
        'INSERT INTO puesto (codigo, zona, tamano) VALUES (?, ?, ?)',
        [codigo, zona.nombre, zona.tamano]
      );
    }
  }
  console.log('Puestos del mapa de la feria creados.');
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const [existentes] = await pool.query('SELECT id FROM usuario WHERE email = ?', [email]);
  if (existentes.length > 0) {
    console.log('El usuario administrador ya existía, se omite.');
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO usuario (nombre, email, password_hash, rol) VALUES (?, ?, ?, ?)',
    ['Administrador FeriaPlace', email, hash, 'administrador']
  );
  console.log(`Usuario administrador creado: ${email}`);
}

(async () => {
  try {
    await seedPuestos();
    await seedAdmin();
  } catch (err) {
    console.error('Error al poblar datos iniciales:', err);
  } finally {
    await pool.end();
  }
})();
