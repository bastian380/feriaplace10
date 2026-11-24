document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje');
  mensaje.innerHTML = '';
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    const datos = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    guardarSesion(datos);
    window.location.href = datos.usuario.rol === 'administrador' ? 'admin.html' : 'solicitar.html';
  } catch (err) {
    mensaje.innerHTML = `<div class="mensaje error">${err.message}</div>`;
  }
});
