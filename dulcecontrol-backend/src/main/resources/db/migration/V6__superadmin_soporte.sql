-- =================================
-- TABLAS PARA EL SUPERADMINISTRADOR
-- =================================

CREATE TABLE IF NOT EXISTS tickets_soporte (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    asignado_a_id BIGINT,
    asunto VARCHAR(255) NOT NULL,
    prioridad ENUM('baja', 'media', 'alta', 'critica') NOT NULL DEFAULT 'media',
    estado ENUM('abierto', 'pendiente_cliente', 'resuelto', 'cerrado') NOT NULL DEFAULT 'abierto',
    vencimiento_sla_en DATETIME,
    primera_respuesta_en DATETIME,
    resuelto_en DATETIME,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE RESTRICT,
    FOREIGN KEY (asignado_a_id) REFERENCES usuarios_superadmin(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mensajes_ticket (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    tipo_remitente ENUM('superadmin', 'tienda', 'sistema') NOT NULL,
    autor_admin_id BIGINT,
    mensaje TEXT NOT NULL,
    es_nota_interna BOOLEAN NOT NULL DEFAULT FALSE,
    leido_en DATETIME,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets_soporte(id) ON DELETE CASCADE,
    FOREIGN KEY (autor_admin_id) REFERENCES usuarios_superadmin(id) ON DELETE SET NULL
);

-- ========================================
-- ÍNDICES SOPORTE SUPERADMINISTRADOR
-- ========================================

CREATE INDEX idx_tickets_estado_prioridad
    ON tickets_soporte(estado, prioridad, creado_en DESC);

CREATE INDEX idx_tickets_asignacion
    ON tickets_soporte(asignado_a_id, estado);

CREATE INDEX idx_mensajes_ticket_orden
    ON mensajes_ticket(ticket_id, creado_en);
