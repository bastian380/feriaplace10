-- FeriaPlace - esquema de base de datos
CREATE DATABASE IF NOT EXISTS feriaplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE feriaplace;

CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('comerciante', 'administrador') NOT NULL DEFAULT 'comerciante',
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Puestos del mapa de la feria (referencia visual; el comerciante NO elige uno directamente)
CREATE TABLE IF NOT EXISTS puesto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  zona VARCHAR(80) NOT NULL,
  tamano ENUM('pequeno', 'mediano', 'grande') NOT NULL DEFAULT 'mediano',
  estado ENUM('disponible', 'ocupado') NOT NULL DEFAULT 'disponible'
);

-- Solicitudes de puesto enviadas por comerciantes
CREATE TABLE IF NOT EXISTS solicitud (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  zona_preferida VARCHAR(80) NULL,
  tamano_preferido ENUM('pequeno', 'mediano', 'grande') NULL,
  rubro VARCHAR(120) NOT NULL,
  comentario VARCHAR(500) NULL,
  estado ENUM('pendiente', 'confirmada', 'rechazada') NOT NULL DEFAULT 'pendiente',
  puesto_id INT NULL,
  comentario_admin VARCHAR(500) NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resuelto_en DATETIME NULL,
  CONSTRAINT fk_solicitud_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  CONSTRAINT fk_solicitud_puesto FOREIGN KEY (puesto_id) REFERENCES puesto(id)
);
