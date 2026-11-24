# Prende la VERSION ORIGINAL de FeriaPlace: su propia base de datos en el puerto 3308 y la app en http://localhost:4001
# No toca el proyecto actual (puerto 4000, MySQL en 3306) ni la copia de pruebas (4100 / 3307).
# Uso: clic derecho > Ejecutar con PowerShell.
$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
$mysqlBase = 'C:\Program Files\MySQL\MySQL Server 8.4'

function PuertoOcupado($puerto) {
  return [bool](netstat -ano | Select-String 'LISTENING' | Select-String ":$puerto ")
}

if (-not (PuertoOcupado 3308)) {
  Write-Host 'Prendiendo la base de datos de la version original (puerto 3308)...'
  Start-Process -WindowStyle Hidden -FilePath "$mysqlBase\bin\mysqld.exe" -ArgumentList @(
    '--no-defaults', "--basedir=`"$mysqlBase`"", "--datadir=`"$raiz\mysql-datos`"",
    '--port=3308', '--bind-address=127.0.0.1', '--mysqlx=OFF'
  )
  for ($i = 0; $i -lt 30 -and -not (PuertoOcupado 3308); $i++) { Start-Sleep -Seconds 1 }
}
if (-not (PuertoOcupado 3308)) { Write-Host 'No se pudo prender la base de datos de la version original.'; exit 1 }

if (PuertoOcupado 4001) { Write-Host 'La version original ya estaba prendida: http://localhost:4001'; Start-Process 'http://localhost:4001'; exit 0 }

Set-Location "$raiz\backend"
Start-Process 'http://localhost:4001'
Write-Host 'Version original de FeriaPlace en http://localhost:4001 (deja esta ventana abierta; Ctrl + C para apagar)'
node src/index.js
