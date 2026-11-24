document.getElementById('form-registro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje');
  mensaje.innerHTML = '';
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    await apiFetch('/auth/registro', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password }),
    });
    mensaje.innerHTML = '<div class="mensaje exito">Cuenta creada. Ahora puedes iniciar sesión.</div>';
    document.getElementById('form-registro').reset();
  } catch (err) {
    mensaje.innerHTML = `<div class="mensaje error">${err.message}</div>`;
  }
});
