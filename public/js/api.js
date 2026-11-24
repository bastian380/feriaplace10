const API_BASE = '/api';

function obtenerSesion() {
  const raw = localStorage.getItem('feriaplace_sesion');
  return raw ? JSON.parse(raw) : null;
}

function guardarSesion(sesion) {
  localStorage.setItem('feriaplace_sesion', JSON.stringify(sesion));
}

function cerrarSesion() {
  localStorage.removeItem('feriaplace_sesion');
  window.location.href = 'login.html';
}

async function apiFetch(ruta, opciones = {}) {
  const sesion = obtenerSesion();
  const headers = { 'Content-Type': 'application/json', ...(opciones.headers || {}) };
  if (sesion?.token) {
    headers.Authorization = `Bearer ${sesion.token}`;
  }
  const respuesta = await fetch(API_BASE + ruta, { ...opciones, headers });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(datos.error || 'Error inesperado del servidor');
  }
  return datos;
}

function requerirSesion(rolesPermitidos) {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = 'login.html';
    return null;
  }
  if (rolesPermitidos && !rolesPermitidos.includes(sesion.usuario.rol)) {
    window.location.href = sesion.usuario.rol === 'administrador' ? 'admin.html' : 'solicitar.html';
    return null;
  }
  return sesion;
}

function pintarNavegacion() {
  const sesion = obtenerSesion();
  const contenedor = document.getElementById('nav-sesion');
  if (!contenedor) return;
  if (!sesion) {
    contenedor.innerHTML = '<a href="login.html">Iniciar sesión</a><a href="registro.html">Registrarse</a>';
    return;
  }
  const enlaces = sesion.usuario.rol === 'administrador'
    ? '<a href="admin.html">Panel administrador</a>'
    : '<a href="mapa.html">Mapa</a><a href="solicitar.html">Solicitar puesto</a><a href="mis-solicitudes.html">Mis solicitudes</a>';
  contenedor.innerHTML = `${enlaces}<a href="#" id="cerrar-sesion">Salir (${sesion.usuario.nombre})</a>`;
  document.getElementById('cerrar-sesion').addEventListener('click', (e) => {
    e.preventDefault();
    cerrarSesion();
  });
}

document.addEventListener('DOMContentLoaded', pintarNavegacion);
