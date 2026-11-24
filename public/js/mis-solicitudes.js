(async () => {
  const sesion = requerirSesion(['comerciante']);
  if (!sesion) return;

  const tbody = document.getElementById('tabla-solicitudes');
  try {
    const solicitudes = await apiFetch('/solicitudes/mias');
    if (solicitudes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">Aún no has enviado solicitudes.</td></tr>';
      return;
    }
    tbody.innerHTML = solicitudes.map((s) => `
      <tr>
        <td>${s.rubro}</td>
        <td>${s.zona_preferida || '-'}</td>
        <td>${s.tamano_preferido || '-'}</td>
        <td><span class="badge ${s.estado}">${s.estado}</span></td>
        <td>${s.puesto_codigo || '-'}</td>
        <td>${s.comentario_admin || '-'}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="mensaje error">${err.message}</div></td></tr>`;
  }
})();
