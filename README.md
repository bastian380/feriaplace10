# FeriaPlace

Sistema de gestión de puestos de feria. Un comerciante envía una solicitud indicando
sus preferencias (zona, tamaño, rubro); el administrador revisa las solicitudes
pendientes y asigna el puesto real del mapa, agilizando el proceso en vez de que
cada comerciante reserve un lugar específico.

## Ya quedó instalado y probado en este equipo

En esta sesión se instalaron y configuraron automáticamente:

- **Node.js LTS** (`C:\Program Files\nodejs`)
- **MySQL Server 8.4** (`C:\Program Files\MySQL\MySQL Server 8.4`), instalado como
  **servicio de Windows** (`MySQL84`, arranque automático), con:
  - Base de datos `feriaplace` ya creada (`database/schema.sql`)
  - Usuario de aplicación `feriaplace_app` con permisos solo sobre `feriaplace`
  - Mapa de puestos y usuario administrador ya sembrados (`npm run seed`)
- Dependencias del backend instaladas (`backend/node_modules`)
- El flujo completo probado en el navegador: registro, login, solicitud, asignación
  del administrador y mapa reflejando el puesto ocupado.

Credenciales de prueba creadas:

- **Administrador**: `admin@feriaplace.cl` / `Admin123!`
- **Comerciante de prueba**: `juan@ejemplo.cl` / `123456` (ya tiene una solicitud
  confirmada con el puesto A1)

Las credenciales reales de la base de datos están en `backend/.env` (no se sube a git).

## Cómo volver a levantarlo

MySQL corre como **servicio de Windows** (`MySQL84`, arranque automático), así que
**se inicia solo cada vez que enciendes el PC**. Solo necesitas levantar el backend:

### 1. Iniciar el servidor de la aplicación

```powershell
cd "C:\Users\basti\Desktop\proyecto\backend"
npm start
```

Verás: `FeriaPlace corriendo en http://localhost:4000`

### 2. Abrir la aplicación

Ve a [http://localhost:4000](http://localhost:4000) en tu navegador.

## Estructura del proyecto

```
proyecto/
├── database/
│   └── schema.sql          # Tablas: usuario, puesto, solicitud
├── backend/
│   ├── src/
│   │   ├── index.js        # Servidor Express (sirve API + frontend)
│   │   ├── db.js           # Conexión a MySQL
│   │   ├── seed.js         # Crea el mapa de puestos y el admin inicial
│   │   ├── middleware/auth.js
│   │   └── routes/
│   │       ├── auth.js         # Registro / login
│   │       ├── puestos.js      # Mapa de puestos (lectura)
│   │       └── solicitudes.js  # Crear, listar, asignar y rechazar solicitudes
│   ├── .env                # Credenciales reales (no compartir)
│   └── package.json
└── public/                 # Frontend (HTML + JS plano, sin frameworks)
    ├── login.html / registro.html
    ├── mapa.html            # Vista de referencia del mapa (solo lectura)
    ├── solicitar.html       # Formulario de solicitud (comerciante)
    ├── mis-solicitudes.html # Estado de mis solicitudes (comerciante)
    └── admin.html           # Panel de asignación (administrador)
```

## Flujo de negocio

1. El comerciante se registra y crea una cuenta (rol `comerciante` por defecto).
2. Ve el mapa como referencia (no puede elegir un puesto ahí).
3. Envía una **solicitud** con: rubro, zona preferida (opcional), tamaño preferido
   (opcional) y un comentario (opcional).
4. El **administrador** ve todas las solicitudes pendientes en su panel, junto a la
   lista de puestos actualmente disponibles.
5. El administrador elige un puesto libre y lo **asigna** (o rechaza la solicitud
   con un motivo). Esto queda protegido con una transacción en la base de datos
   para evitar que dos solicitudes se asignen al mismo puesto al mismo tiempo.
6. El comerciante ve en "Mis solicitudes" el estado (`pendiente`, `confirmada`,
   `rechazada`) y el puesto asignado si corresponde.

## Crear más usuarios

- Cualquier persona puede crear su propia cuenta de **comerciante** desde
  `registro.html`.
- Para crear otro **administrador**, la forma más simple es conectarse a MySQL y
  actualizar el rol de un usuario ya registrado:

```sql
UPDATE usuario SET rol = 'administrador' WHERE email = 'correo@ejemplo.cl';
```

(No se agregó un formulario de "crear administrador" en la interfaz a propósito,
para que no cualquiera pueda auto-asignarse ese rol.)

## Si algo falla

- **"Error de conexión" al cargar cualquier página**: revisa que MySQL esté
  corriendo (`Get-Process mysqld`) y que el backend esté corriendo (`npm start`
  dentro de `backend/`).
- **Error de la base de datos al iniciar el backend**: revisa que
  `backend/.env` tenga las credenciales correctas (`DB_USER`, `DB_PASSWORD`,
  `DB_NAME`).
- Si necesitas reinstalar dependencias: `cd backend` y `npm install`.
- Si necesitas volver a poblar el mapa de puestos o el administrador (por ejemplo,
  en una base de datos nueva): `npm run seed` dentro de `backend/`.
