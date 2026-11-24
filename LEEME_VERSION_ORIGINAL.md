# Feria Place: versión original (antes de Claude)

Esta carpeta es una COPIA de tu código tal como estaba el 15 de septiembre de 2026
en la noche, antes de la primera sesión con Claude en este proyecto (24 de septiembre).
Se sacó de `Desktop\proyecto-respaldo-2026-10-07`, que guarda los archivos con esas fechas.

El código (backend/src, public, database/schema.sql) está sin ningún cambio.
Solo se cambiaron 2 líneas de configuración en `backend/.env` para que esta versión
NO toque la base de datos de tu proyecto actual:

- `PORT=4001` (tu app actual sigue en el 4000)
- `DB_NAME=feriaplace_original` (base de datos aparte)

Tu `backend/.env.respaldo` tiene la configuración original sin cambios.

## Cómo verla funcionando (una sola vez)

1. Crear la base de datos aparte. Abre MySQL como root y ejecuta el archivo
   `crear_base_original.sql` (es tu schema.sql, pero con el nombre `feriaplace_original`):

   ```powershell
   cd "C:\Users\basti\Desktop\MI PROYECTO\FeriaPlace_version_original_sin_IA"
   & "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -p -e "source crear_base_original.sql"
   ```

2. Instalar dependencias y cargar los datos iniciales:

   ```powershell
   cd backend
   npm install
   npm run seed
   ```

3. Levantar la app:

   ```powershell
   npm start
   ```

   Abre http://localhost:4001  (admin: admin@feriaplace.cl / Admin123!)

Puedes tener las dos abiertas al mismo tiempo para comparar:
- Versión actual: http://localhost:4000 (desde `Desktop\proyecto\backend`)
- Versión original: http://localhost:4001 (desde esta carpeta)


## Si no tienes la clave de root (así quedó instalada el 20-11-2026)

Como no se tenía la clave de root, esta versión usa su PROPIO MySQL, separado del tuyo:
datos en la carpeta `mysql-datos`, puerto 3308 (tu MySQL normal sigue en el 3306 sin cambios).
El `backend\.env` apunta a `DB_HOST=127.0.0.1`, `DB_PORT=3308`, `DB_NAME=feriaplace_original`.

Para abrirla otro día: clic derecho en `iniciar-original.ps1` > Ejecutar con PowerShell.
O a mano, en PowerShell:

```powershell
cd "C:\Users\basti\Desktop\MI PROYECTO\FeriaPlace_version_original_sin_IA"
Start-Process -WindowStyle Hidden "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" -ArgumentList '--no-defaults','--basedir="C:\Program Files\MySQL\MySQL Server 8.4"','--datadir="C:\Users\basti\Desktop\MI PROYECTO\FeriaPlace_version_original_sin_IA\mysql-datos"','--port=3308','--bind-address=127.0.0.1','--mysqlx=OFF'
cd backend
npm start
```

Luego abre http://localhost:4001

## Cuentas de esta versión

Además de admin@feriaplace.cl, esta versión tiene 2 cuentas propias (solo existen en la base feriaplace_original):
- admin.original@feriaplace.cl (administrador)
- comerciante.original@feriaplace.cl (comerciante)

Sus contraseñas están en `CUENTA_VERSION_ORIGINAL.txt`, en esta misma carpeta.

## Ubicación (20-11-2026)

Esta carpeta se movió a `C:\Users\basti\Desktop\MI PROYECTO\FeriaPlace_version_original_sin_IA`.
El `backend\.env` ya existe: se copió desde `C:\Users\basti\Desktop\proyecto\backend\.env` cambiando PORT=4001, DB_HOST=127.0.0.1, DB_PORT=3308 y DB_NAME=feriaplace_original.
