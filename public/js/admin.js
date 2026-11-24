(async () => {
  const sesion = requerirSesion(['administrador']);
  if (!sesion) return;

  const mensaje = document.getElementById('mensaje');
  const tablaPendientes = document.getElementById('tabla-pendientes');
  const tablaHistorial = document.getElementById('tabla-historial');

  async function cargarPuestosDisponibles() {
    return apiFetch('/puestos/disponibles');
  }

  async function cargarTodo() {
    mensaje.innerHTML = '';
    const [pendientes, todas, disponibles] = await Promise.all([
      apiFetch('/solicitudes?estado=pendiente'),
      apiFetch('/solicitudes'),
      cargarPuestosDisponibles(),
    ]);

    tablaPendientes.innerHTML = pendientes.length === 0
      ? '<tr><td colspan="6">No hay solicitudes pendientes.</td></tr>'
      : pendientes.map((s) => {
        const opciones = disponibles.map((p) => `<option value="${p.id}">${p.codigo} · ${p.zona} · ${p.tamano}</option>`).join('');
        return `
          <tr data-id="${s.id}">
            <td>${s.comerciante_nombre}<br><small>${s.comerciante_email}</small></td>
            <td>${s.rubro}</td>
            <td>${s.zona_preferida || '-'}</td>
            <td>${s.tamano_preferido || '-'}</td>
            <td>${s.comentario || '-'}</td>
            <td class="acciones-fila">
              <select class="select-puesto">${opciones || '<option value="">Sin puestos libres</option>'}</select>
              <button class="btn-asignar" data-id="${s.id}">Asignar</button>
              <button class="btn-rechazar secundario" data-id="${s.id}">Rechazar</button>
            </td>
          </tr>
        `;
      }).join('');

    tablaHistorial.innerHTML = todas.map((s) => `
      <tr>
        <td>${s.comerciante_nombre}</td>
        <td>${s.rubro}</td>
        <td><span class="badge ${s.estado}">${s.estado}</span></td>
        <td>${s.puesto_codigo || '-'}</td>
        <td>${s.comentario_admin || '-'}</td>
      </tr>
    `).join('');

    document.querySelectorAll('.btn-asignar').forEach((boton) => {
      boton.addEventListener('click', async () => {
        const fila = boton.closest('tr');
        const puestoId = fila.querySelector('.select-puesto').value;
        if (!puestoId) {
          mensaje.innerHTML = '<div class="mensaje error">No hay puesto disponible para asignar.</div>';
          return;
        }
        try {
          await apiFetch(`/solicitudes/${boton.dataset.id}/asignar`, {
            method: 'PUT',
            body: JSON.stringify({ puesto_id: Number(puestoId) }),
          });
          mensaje.innerHTML = '<div class="mensaje exito">Puesto asignado correctamente.</div>';
          cargarTodo();
        } catch (err) {
          mensaje.innerHTML = `<div class="mensaje error">${err.message}</div>`;
        }
      });
    });

    document.querySelectorAll('.btn-rechazar').forEach((boton) => {
      boton.addEventListener('click', async () => {
        const motivo = prompt('Motivo del rechazo (opcional):') || '';
        try {
          await apiFetch(`/solicitudes/${boton.dataset.id}/rechazar`, {
            method: 'PUT',
            body: JSON.stringify({ comentario_admin: motivo }),
          });
          mensaje.innerHTML = '<div class="mensaje exito">Solicitud rechazada.</div>';
          cargarTodo();
        } catch (err) {
          mensaje.innerHTML = `<div class="mensaje error">${err.message}</div>`;
        }
      });
    });
  }

  try {
    await cargarTodo();
  } catch (err) {
    mensaje.innerHTML = `<div class="mensaje error">${err.message}</div>`;
  }
})();
