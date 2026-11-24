(() => {
  const sesion = requerirSesion(['comerciante']);
  if (!sesion) return;

  document.getElementById('form-solicitud').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje');
    mensaje.innerHTML = '';
    const cuerpo = {
      rubro: document.getElementById('rubro').value.trim(),
      zona_preferida: document.getElementById('zona').value || null,
      tamano_preferido: document.getElementById('tamano').value || null,
      comentario: document.getElementById('comentario').value.trim() || null,
    };
    try {
      await apiFetch('/solicitudes', { method: 'POST', body: JSON.stringify(cuerpo) });
      mensaje.innerHTML = '<div class="mensaje exito">Solicitud enviada. Revisa el estado en "Mis solicitudes".</div>';
      document.getElementById('form-solicitud').reset();
    } catch (err) {
      mensaje.innerHTML = `<div class="mensaje error">${err.message}</div>`;
    }
  });
})();
