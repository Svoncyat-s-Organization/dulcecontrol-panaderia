-- BASE DE DATOS OFICIAL PARA PEGASUS ECOMMERCE
-- Unificada y usada en este proyecto. Vista fragmentada en /db/migraciones/

-- ============================================================================
-- V1: Esquema principal y utilidades base
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS pegasus;
SET search_path = pegasus, public;

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE OR REPLACE FUNCTION pegasus.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.actualizado_en := NOW();
  RETURN NEW;
END $$;

-- ============================================================================
-- V2: Configuraciones globales
-- ============================================================================

CREATE TABLE IF NOT EXISTS configuraciones (
  id              BIGSERIAL PRIMARY KEY,
  clave           TEXT NOT NULL UNIQUE,
  valor           JSONB NOT NULL,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_configuraciones_updated
BEFORE UPDATE ON configuraciones
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

-- ============================================================================
-- V3: Seguridad, RBAC, auditoría y webhooks salientes
-- ============================================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id              BIGSERIAL PRIMARY KEY,
  correo          CITEXT NOT NULL,
  hash_contrasena TEXT NOT NULL,
  nombres         TEXT NOT NULL,
  apellidos       TEXT NOT NULL,
  telefono        TEXT NULL,
  tipo_doc        TEXT NULL CHECK (tipo_doc IN('DNI','RUC','CE')),
  numero_doc      TEXT NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  eliminado_en    TIMESTAMPTZ NULL
);

CREATE OR REPLACE TRIGGER trg_usuarios_updated
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_numerodoc_activo
  ON usuarios (numero_doc) WHERE eliminado_en IS NULL AND numero_doc IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_usuarios_correo_activo
  ON usuarios (lower(correo)) WHERE eliminado_en IS NULL;

CREATE TABLE IF NOT EXISTS roles (
  id              BIGSERIAL PRIMARY KEY,
  codigo          TEXT NOT NULL UNIQUE,
  nombre          TEXT NOT NULL,
  descripcion     TEXT NULL
);

CREATE TABLE IF NOT EXISTS permisos (
  id              BIGSERIAL PRIMARY KEY,
  codigo          TEXT NOT NULL UNIQUE,
  descripcion     TEXT NULL
);

CREATE TABLE IF NOT EXISTS roles_permisos (
  rol_id          BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permiso_id      BIGINT NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS usuarios_roles (
  usuario_id      BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  rol_id          BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE IF NOT EXISTS bitacora_auditoria (
  id                BIGSERIAL PRIMARY KEY,
  actor_usuario_id  BIGINT NULL REFERENCES usuarios(id),
  entidad           TEXT NOT NULL,
  entidad_id        BIGINT NULL,
  accion            TEXT NOT NULL,
  detalle           JSONB NULL,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clientes_api (
  id              BIGSERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL,
  clave_api       TEXT NOT NULL UNIQUE,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suscripciones_webhook (
  id              BIGSERIAL PRIMARY KEY,
  url_destino     TEXT NOT NULL,
  codigo_evento   TEXT NOT NULL,
  secreto         TEXT NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_suscripcion_url_evento
  ON suscripciones_webhook (url_destino, codigo_evento);

CREATE TABLE IF NOT EXISTS entregas_webhook (
  id                BIGSERIAL PRIMARY KEY,
  suscripcion_id    BIGINT NOT NULL REFERENCES suscripciones_webhook(id) ON DELETE CASCADE,
  codigo_evento     TEXT NOT NULL,
  carga             JSONB NOT NULL,
  estado            TEXT NOT NULL CHECK (estado IN('pendiente','exitoso','fallido')),
  conteo_intentos   INT  NOT NULL DEFAULT 0,
  ultimo_error      TEXT NULL,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  entregado_en      TIMESTAMPTZ NULL
);

-- ============================================================================
-- V4: Clientes, direcciones y locaciones
-- ============================================================================

CREATE TABLE IF NOT EXISTS clientes (
  id              BIGSERIAL PRIMARY KEY,
  correo          CITEXT NOT NULL,
  hash_contrasena TEXT NOT NULL,
  nombres         TEXT NULL,
  apellidos       TEXT NULL,
  razon_social    TEXT NULL,
  telefono        TEXT NULL,
  tipo_doc        TEXT NULL CHECK (tipo_doc IN('DNI','RUC','CE')),
  numero_doc      TEXT NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  eliminado_en    TIMESTAMPTZ NULL
);


CREATE TABLE IF NOT EXISTS ubigeo_departamentos (
  id            BIGSERIAL PRIMARY KEY,
  nombre        TEXT NOT NULL,
  codigo_ubigeo CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ubigeo_provincias (
  id              BIGSERIAL PRIMARY KEY,
  departamento_id BIGINT NOT NULL REFERENCES ubigeo_departamentos(id) ON DELETE RESTRICT,
  nombre          TEXT NOT NULL,
  codigo_ubigeo   CHAR(4) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ubigeo_distritos (
  id            BIGSERIAL PRIMARY KEY,
  provincia_id  BIGINT NOT NULL REFERENCES ubigeo_provincias(id) ON DELETE RESTRICT,
  nombre        TEXT NOT NULL,
  codigo_ubigeo CHAR(6) NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_ubigeo_provincias_dpto_id ON ubigeo_provincias(departamento_id);
CREATE INDEX IF NOT EXISTS idx_ubigeo_distritos_prov_id ON ubigeo_distritos(provincia_id);

CREATE OR REPLACE TRIGGER trg_clientes_updated
BEFORE UPDATE ON clientes
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS uq_clientes_correo_activo
  ON clientes (lower(correo)) WHERE eliminado_en IS NULL;

CREATE TABLE IF NOT EXISTS direcciones_cliente (
  id                      BIGSERIAL PRIMARY KEY,
  cliente_id              BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  etiqueta                TEXT NULL,
  nombres                 TEXT NULL,
  apellidos               TEXT NULL,
  razon_social            TEXT NULL,
  tipo_documento          TEXT NULL CHECK (tipo_documento IN('DNI','RUC','CE')),
  numero_documento        TEXT NULL,
  telefono                TEXT NOT NULL,
  linea1                  TEXT NOT NULL,
  linea2                  TEXT NULL,
  distrito_id             BIGINT NULL REFERENCES ubigeo_distritos(id) ON DELETE SET NULL,
  codigo_postal           TEXT NULL,
  codigo_pais             CHAR(2) NOT NULL DEFAULT 'PE',
  por_defecto_facturacion BOOLEAN NOT NULL DEFAULT FALSE,
  por_defecto_envio       BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direcciones_cliente_cliente ON direcciones_cliente(cliente_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_direccion_cliente_linea1
  ON direcciones_cliente (cliente_id, linea1);

CREATE UNIQUE INDEX IF NOT EXISTS uq_dir_default_facturacion
  ON direcciones_cliente(cliente_id) WHERE por_defecto_facturacion;

CREATE UNIQUE INDEX IF NOT EXISTS uq_dir_default_envio
  ON direcciones_cliente(cliente_id) WHERE por_defecto_envio;

-- Trigger/función para validar que para direcciones en Perú se suministre un distrito
CREATE OR REPLACE FUNCTION pegasus.check_distrito_if_peru()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.codigo_pais = 'PE' THEN
    IF NEW.distrito_id IS NULL THEN
      RAISE EXCEPTION 'Para direcciones en Perú (codigo_pais=PE) distrito_id no puede ser nulo';
    END IF;
  ELSE
    -- Forzar NULL si no es Perú para evitar mezcla accidental
    NEW.distrito_id := NULL;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_check_distrito_on_direcciones_cliente ON direcciones_cliente;
CREATE TRIGGER trg_check_distrito_on_direcciones_cliente
BEFORE INSERT OR UPDATE ON direcciones_cliente
FOR EACH ROW EXECUTE FUNCTION pegasus.check_distrito_if_peru();

CREATE INDEX IF NOT EXISTS idx_direcciones_cliente_distrito ON direcciones_cliente(distrito_id);

-- ============================================================================
-- V5: Catálogo (marcas, categorías, productos, variantes y atributos EAV)
-- ============================================================================

CREATE TABLE IF NOT EXISTS marcas (
  id              BIGSERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL UNIQUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  activo          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE OR REPLACE TRIGGER trg_marcas_updated
BEFORE UPDATE ON marcas
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

CREATE TABLE IF NOT EXISTS categorias (
  id              BIGSERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL UNIQUE,
  slug            TEXT NOT NULL,
  descripcion     TEXT NULL,
  padre_id        BIGINT NULL REFERENCES categorias(id),
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categorias_padre ON categorias(padre_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_categorias_slug_lower ON categorias (lower(slug));

CREATE OR REPLACE TRIGGER trg_categorias_updated
BEFORE UPDATE ON categorias
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

CREATE TABLE IF NOT EXISTS productos (
  id                  BIGSERIAL PRIMARY KEY,
  codigo_producto     TEXT NOT NULL UNIQUE,
  nombre              TEXT NOT NULL,
  slug                TEXT NOT NULL,
  marca_id            BIGINT NULL REFERENCES marcas(id),
  categoria_id        BIGINT NOT NULL REFERENCES categorias(id),
  descripcion_corta   TEXT NULL,
  descripcion         TEXT NULL,
  meta_titulo         TEXT NULL,
  meta_descripcion    TEXT NULL,
  activo              BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  eliminado_en        TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_productos_categoria_activo ON productos(categoria_id, activo);
CREATE INDEX IF NOT EXISTS idx_productos_nombre_trgm_gin ON productos USING GIN (nombre gin_trgm_ops);
CREATE UNIQUE INDEX IF NOT EXISTS uq_productos_slug_lower ON productos (lower(slug));

CREATE OR REPLACE TRIGGER trg_productos_updated
BEFORE UPDATE ON productos
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

CREATE TABLE IF NOT EXISTS imagenes_producto (
  id              BIGSERIAL PRIMARY KEY,
  producto_id     BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  es_principal    BOOLEAN NOT NULL DEFAULT FALSE,
  orden           INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_imagenes_producto_producto ON imagenes_producto(producto_id, es_principal);

CREATE UNIQUE INDEX IF NOT EXISTS uq_producto_url
  ON imagenes_producto (producto_id, url);

CREATE TABLE IF NOT EXISTS variantes (
  id              BIGSERIAL PRIMARY KEY,
  producto_id     BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  sku             TEXT NOT NULL UNIQUE,
  codigo_barras   TEXT NULL,
  precio_regular  NUMERIC(12,2) NOT NULL,
  precio_oferta   NUMERIC(12,2) NULL,
  moneda          CHAR(3) NOT NULL DEFAULT 'PEN',
  peso_gramos     INT NULL CHECK (peso_gramos IS NULL OR peso_gramos >= 0),
  largo_mm        NUMERIC(12,2) NULL,
  ancho_mm        NUMERIC(12,2) NULL,
  alto_mm         NUMERIC(12,2) NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_variante_precios CHECK (
    precio_regular >= 0 AND
    (precio_oferta IS NULL OR precio_oferta >= 0) AND
    (precio_oferta IS NULL OR precio_oferta <= precio_regular)
  )
);

CREATE INDEX IF NOT EXISTS idx_variedades_producto ON variantes(producto_id, activo);

CREATE OR REPLACE TRIGGER trg_variantes_updated
BEFORE UPDATE ON variantes
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

CREATE TABLE IF NOT EXISTS imagenes_variante (
  id              BIGSERIAL PRIMARY KEY,
  variante_id     BIGINT NOT NULL REFERENCES variantes(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  es_principal    BOOLEAN NOT NULL DEFAULT FALSE,
  orden           INT NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_variante_url
  ON imagenes_variante (variante_id, url);

CREATE INDEX IF NOT EXISTS idx_imagenes_variante_var ON imagenes_variante(variante_id, es_principal);

CREATE UNIQUE INDEX IF NOT EXISTS uq_producto_imagen_principal ON imagenes_producto(producto_id) WHERE es_principal;
CREATE UNIQUE INDEX IF NOT EXISTS uq_variante_imagen_principal ON imagenes_variante(variante_id) WHERE es_principal;

CREATE TABLE IF NOT EXISTS definiciones_atributo (
  id              BIGSERIAL PRIMARY KEY,
  codigo          TEXT NOT NULL UNIQUE,
  nombre          TEXT NOT NULL,
  tipo_dato       TEXT NOT NULL CHECK (tipo_dato IN('text','number','boolean','date','list')),
  alcance         TEXT NOT NULL CHECK (alcance IN('producto','variante')),
  obligatorio     BOOLEAN NOT NULL DEFAULT FALSE,
  opciones        JSONB NULL,
  unidad          TEXT NULL,
  validacion      JSONB NULL
);

CREATE TABLE IF NOT EXISTS atributos_categoria (
  categoria_id    BIGINT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  atributo_id     BIGINT NOT NULL REFERENCES definiciones_atributo(id) ON DELETE CASCADE,
  obligatorio     BOOLEAN NOT NULL DEFAULT FALSE,
  orden           INT NOT NULL DEFAULT 0,
  PRIMARY KEY (categoria_id, atributo_id)
);

CREATE TABLE IF NOT EXISTS valores_atributo_producto (
  producto_id     BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  atributo_id     BIGINT NOT NULL REFERENCES definiciones_atributo(id) ON DELETE CASCADE,
  valor_texto     TEXT NULL,
  valor_numero    NUMERIC(18,4) NULL,
  valor_booleano  BOOLEAN NULL,
  valor_fecha     DATE NULL,
  valor_lista     TEXT NULL,
  PRIMARY KEY (producto_id, atributo_id),
  CONSTRAINT chk_vap_un_solo_valor CHECK (
    (
      (CASE WHEN valor_texto    IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN valor_numero   IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN valor_booleano IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN valor_fecha    IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN valor_lista    IS NOT NULL THEN 1 ELSE 0 END)
    ) = 1
  )
);

CREATE TABLE IF NOT EXISTS valores_atributo_variante (
  variante_id     BIGINT NOT NULL REFERENCES variantes(id) ON DELETE CASCADE,
  atributo_id     BIGINT NOT NULL REFERENCES definiciones_atributo(id) ON DELETE CASCADE,
  valor_texto     TEXT NULL,
  valor_numero    NUMERIC(18,4) NULL,
  valor_booleano  BOOLEAN NULL,
  valor_fecha     DATE NULL,
  valor_lista     TEXT NULL,
  PRIMARY KEY (variante_id, atributo_id),
  CONSTRAINT chk_vav_un_solo_valor CHECK (
    (
      (CASE WHEN valor_texto    IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN valor_numero   IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN valor_booleano IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN valor_fecha    IS NOT NULL THEN 1 ELSE 0 END) +
      (CASE WHEN valor_lista    IS NOT NULL THEN 1 ELSE 0 END)
    ) = 1
  )
);

CREATE OR REPLACE FUNCTION pegasus.validate_attr_value()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE t TEXT; opts JSONB;
BEGIN
  SELECT tipo_dato, opciones INTO t, opts
  FROM definiciones_atributo
  WHERE id = NEW.atributo_id;

  IF t='text'    AND NEW.valor_texto    IS NULL THEN RAISE EXCEPTION 'Valor text requerido'; END IF;
  IF t='number'  AND NEW.valor_numero   IS NULL THEN RAISE EXCEPTION 'Valor number requerido'; END IF;
  IF t='boolean' AND NEW.valor_booleano IS NULL THEN RAISE EXCEPTION 'Valor boolean requerido'; END IF;
  IF t='date'    AND NEW.valor_fecha    IS NULL THEN RAISE EXCEPTION 'Valor date requerido'; END IF;
  IF t='list'    AND NEW.valor_lista    IS NULL THEN RAISE EXCEPTION 'Valor list requerido'; END IF;

  IF t='list' AND opts ? 'values' THEN
    IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements_text(opts->'values') v WHERE v = NEW.valor_lista) THEN
      RAISE EXCEPTION 'Valor "%" no esta en options', NEW.valor_lista;
    END IF;
  END IF;

  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_vap_validate
BEFORE INSERT OR UPDATE ON valores_atributo_producto
FOR EACH ROW EXECUTE FUNCTION pegasus.validate_attr_value();

CREATE OR REPLACE TRIGGER trg_vav_validate
BEFORE INSERT OR UPDATE ON valores_atributo_variante
FOR EACH ROW EXECUTE FUNCTION pegasus.validate_attr_value();

CREATE INDEX IF NOT EXISTS idx_vap_attr_texto    ON valores_atributo_producto (atributo_id, valor_texto)    WHERE valor_texto    IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vap_attr_numero   ON valores_atributo_producto (atributo_id, valor_numero)   WHERE valor_numero   IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vap_attr_booleano ON valores_atributo_producto (atributo_id, valor_booleano) WHERE valor_booleano IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vap_attr_fecha    ON valores_atributo_producto (atributo_id, valor_fecha)    WHERE valor_fecha    IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_vav_attr_texto    ON valores_atributo_variante (atributo_id, valor_texto)    WHERE valor_texto    IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vav_attr_numero   ON valores_atributo_variante (atributo_id, valor_numero)   WHERE valor_numero   IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vav_attr_booleano ON valores_atributo_variante (atributo_id, valor_booleano) WHERE valor_booleano IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vav_attr_fecha    ON valores_atributo_variante (atributo_id, valor_fecha)    WHERE valor_fecha    IS NOT NULL;

-- ============================================================================
-- V6: Listas de precios, impuestos, promociones y cupones
-- ============================================================================

CREATE TABLE IF NOT EXISTS listas_precios (
  id              BIGSERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL,
  moneda          CHAR(3) NOT NULL DEFAULT 'PEN',
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  inicia_en       TIMESTAMPTZ NULL,
  finaliza_en     TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_listas_precios_nombre
  ON listas_precios (nombre);

CREATE TABLE IF NOT EXISTS items_lista_precios (
  id                BIGSERIAL PRIMARY KEY,
  lista_precio_id   BIGINT NOT NULL REFERENCES listas_precios(id) ON DELETE CASCADE,
  variante_id       BIGINT NOT NULL REFERENCES variantes(id) ON DELETE CASCADE,
  precio            NUMERIC(12,2) NOT NULL,
  UNIQUE (lista_precio_id, variante_id),
  CONSTRAINT chk_item_lista_precio CHECK (precio >= 0)
);

CREATE INDEX IF NOT EXISTS idx_ilp_variante ON items_lista_precios(variante_id, lista_precio_id);

CREATE TABLE IF NOT EXISTS tasas_impuesto (
  id              BIGSERIAL PRIMARY KEY,
  codigo_pais     CHAR(2) NOT NULL,
  -- Referencia a departamento/provincia via ubigeo; usar departamento_id para reglas nacionales
  departamento_id BIGINT NULL REFERENCES ubigeo_departamentos(id) ON DELETE SET NULL,
  categoria_id    BIGINT NULL REFERENCES categorias(id),
  tasa            NUMERIC(5,4) NOT NULL CHECK (tasa >= 0),
  inicia_en       TIMESTAMPTZ NULL,
  finaliza_en     TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_tasas_imp_lookup ON tasas_impuesto(codigo_pais, departamento_id, categoria_id);

-- Asegurar idempotencia al (re)crear la constraint de no solapamiento
ALTER TABLE tasas_impuesto DROP CONSTRAINT IF EXISTS ex_tasas_imp_sin_solape;
ALTER TABLE tasas_impuesto
  ADD CONSTRAINT ex_tasas_imp_sin_solape
  EXCLUDE USING gist (
    (codigo_pais) WITH =,
    (departamento_id) WITH =,
    ((COALESCE(categoria_id, 0))) WITH =,
    (tstzrange(inicia_en, finaliza_en, '[]')) WITH &&
  );

CREATE TABLE IF NOT EXISTS promociones (
  id              BIGSERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL,
  activo          BOOLEAN NOT NULL DEFAULT FALSE,
  inicia_en       TIMESTAMPTZ NULL,
  finaliza_en     TIMESTAMPTZ NULL,
  condiciones     JSONB NULL,
  acciones        JSONB NULL
);

CREATE TABLE IF NOT EXISTS cupones (
  id                  BIGSERIAL PRIMARY KEY,
  promocion_id        BIGINT NULL REFERENCES promociones(id) ON DELETE SET NULL,
  codigo              TEXT NOT NULL UNIQUE,
  tipo_descuento      TEXT NOT NULL CHECK (tipo_descuento IN('porcentaje','fijo')),
  valor_descuento     NUMERIC(12,2) NOT NULL,
  moneda              CHAR(3) NULL,
  max_redenciones     INT NULL,
  limite_por_cliente  INT NULL,
  inicia_en           TIMESTAMPTZ NULL,
  finaliza_en         TIMESTAMPTZ NULL,
  activo              BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS redenciones_cupon (
  id              BIGSERIAL PRIMARY KEY,
  cupon_id        BIGINT NOT NULL REFERENCES cupones(id) ON DELETE CASCADE,
  cliente_id      BIGINT NULL REFERENCES clientes(id) ON DELETE SET NULL,
  pedido_id       BIGINT NULL,
  redimido_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redenciones_cupon_cupon ON redenciones_cupon(cupon_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_redencion_por_pedido ON redenciones_cupon(cupon_id, pedido_id) WHERE pedido_id IS NOT NULL;

CREATE OR REPLACE FUNCTION pegasus.guard_coupon_limits()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  used_global INT;
  used_by_customer INT;
  validation_ts TIMESTAMPTZ;
BEGIN
  -- Usar la fecha de redención del INSERT; si no viene, usar la fecha actual.
  IF NEW.redimido_en IS NOT NULL THEN
    validation_ts := NEW.redimido_en;
  ELSE
    validation_ts := NOW();
    NEW.redimido_en := validation_ts; -- Asignar la fecha actual si era nula
  END IF;

  -- Validar contra la 'validation_ts' (no contra NOW())
  PERFORM 1 FROM cupones c
   WHERE c.id = NEW.cupon_id
     AND c.activo
     AND (c.inicia_en IS NULL OR c.inicia_en <= validation_ts)
     AND (c.finaliza_en IS NULL OR c.finaliza_en >= validation_ts);
  IF NOT FOUND THEN
    -- Añadimos la fecha al error para facilitar la depuración
    RAISE EXCEPTION 'Cupon inactivo o fuera de rango (Fecha de validacion: %)', validation_ts;
  END IF;

  SELECT COUNT(*) INTO used_global FROM redenciones_cupon WHERE cupon_id = NEW.cupon_id;
  SELECT COUNT(*) INTO used_by_customer FROM redenciones_cupon
    WHERE cupon_id = NEW.cupon_id AND cliente_id = NEW.cliente_id;

  IF (SELECT max_redenciones FROM cupones WHERE id=NEW.cupon_id) IS NOT NULL
      AND used_global >= (SELECT max_redenciones FROM cupones WHERE id=NEW.cupon_id) THEN
    RAISE EXCEPTION 'Limite global de redenciones alcanzado';
  END IF;

  IF NEW.cliente_id IS NOT NULL
      AND (SELECT limite_por_cliente FROM cupones WHERE id=NEW.cupon_id) IS NOT NULL
      AND used_by_customer >= (SELECT limite_por_cliente FROM cupones WHERE id=NEW.cupon_id) THEN
    RAISE EXCEPTION 'Limite por cliente alcanzado';
  END IF;

  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_cupon_limits
BEFORE INSERT ON redenciones_cupon
FOR EACH ROW EXECUTE FUNCTION pegasus.guard_coupon_limits();

-- ============================================================================
-- V7: Inventario (almacenes, existencias, reservas, lotes, movimientos)
-- ============================================================================

CREATE TABLE IF NOT EXISTS almacenes (
  id              BIGSERIAL PRIMARY KEY,
  codigo          TEXT NOT NULL UNIQUE,
  nombre          TEXT NOT NULL,
  linea1          TEXT NULL,
  distrito_id     BIGINT NULL REFERENCES ubigeo_distritos(id) ON DELETE SET NULL,
  codigo_pais     CHAR(2) NULL,
  codigo_postal   TEXT NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS existencias (
  id              BIGSERIAL PRIMARY KEY,
  variante_id     BIGINT NOT NULL REFERENCES variantes(id) ON DELETE CASCADE,
  almacen_id      BIGINT NOT NULL REFERENCES almacenes(id) ON DELETE CASCADE,
  cantidad        INT NOT NULL DEFAULT 0,
  UNIQUE (variante_id, almacen_id),
  CHECK (cantidad >= 0)
);

CREATE INDEX IF NOT EXISTS idx_existencias_variante ON existencias(variante_id);
CREATE INDEX IF NOT EXISTS idx_existencias_almacen  ON existencias(almacen_id);

CREATE INDEX IF NOT EXISTS idx_almacenes_distrito ON almacenes(distrito_id);

CREATE TABLE IF NOT EXISTS reservas_stock (
  id              BIGSERIAL PRIMARY KEY,
  variante_id     BIGINT NOT NULL REFERENCES variantes(id) ON DELETE CASCADE,
  almacen_id      BIGINT NOT NULL REFERENCES almacenes(id) ON DELETE CASCADE,
  pedido_id       BIGINT NULL,
  cantidad        INT NOT NULL CHECK (cantidad > 0),
  estado          TEXT NOT NULL CHECK (estado IN('activo','liberado','consumido','expirado')),
  expira_en       TIMESTAMPTZ NULL,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservas_lookup ON reservas_stock(variante_id, almacen_id, estado);

CREATE UNIQUE INDEX IF NOT EXISTS uq_reserva_semantica
  ON reservas_stock(pedido_id, variante_id, almacen_id)
  WHERE estado='activo' AND pedido_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS lotes_stock (
  id                BIGSERIAL PRIMARY KEY,
  variante_id       BIGINT NOT NULL REFERENCES variantes(id) ON DELETE CASCADE,
  almacen_id        BIGINT NOT NULL REFERENCES almacenes(id) ON DELETE CASCADE,
  numero_lote       TEXT NULL,
  fecha_vencimiento DATE NULL,
  cantidad          INT NOT NULL DEFAULT 0 CHECK (cantidad >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_lote_stock ON lotes_stock(variante_id, almacen_id, numero_lote, fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_lotes_var_wh ON lotes_stock(variante_id, almacen_id);

CREATE TABLE IF NOT EXISTS movimientos_stock (
  id                BIGSERIAL PRIMARY KEY,
  variante_id       BIGINT NOT NULL REFERENCES variantes(id),
  almacen_id        BIGINT NOT NULL REFERENCES almacenes(id),
  cambio_cantidad   INT NOT NULL,
  tipo_movimiento   TEXT NOT NULL CHECK (tipo_movimiento IN(
                'recepcion_compra','venta','ajuste_positivo','ajuste_negativo',
                'rma_entrada','rma_salida','transferencia_entrada','transferencia_salida'
                     )),
  tabla_referencia  TEXT NULL,
  referencia_id     BIGINT NULL,
  creado_por        BIGINT NULL REFERENCES usuarios(id),
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  nota              TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_movimientos_ref ON movimientos_stock(tabla_referencia, referencia_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_movimiento_stock_unico
  ON movimientos_stock (variante_id, almacen_id, tipo_movimiento, creado_en);

CREATE OR REPLACE VIEW v_stock_disponible AS
SELECT
  s.variante_id,
  s.almacen_id,
  s.cantidad
    - COALESCE( (SELECT SUM(cantidad) FROM reservas_stock r
                 WHERE r.variante_id=s.variante_id AND r.almacen_id=s.almacen_id
                   AND r.estado = 'activo'), 0) AS cantidad_disponible
FROM existencias s;

CREATE OR REPLACE FUNCTION pegasus.guard_stock_nonnegative()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE current_qty INT;
BEGIN
  INSERT INTO existencias(variante_id, almacen_id, cantidad)
  VALUES(NEW.variante_id, NEW.almacen_id, 0)
  ON CONFLICT (variante_id, almacen_id) DO NOTHING;

  SELECT cantidad INTO current_qty
  FROM existencias
  WHERE variante_id=NEW.variante_id AND almacen_id=NEW.almacen_id
  FOR UPDATE;

  IF current_qty + NEW.cambio_cantidad < 0 THEN
    RAISE EXCEPTION 'Movimiento dejaria stock negativo';
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_mov_guard_nonneg
BEFORE INSERT ON movimientos_stock
FOR EACH ROW EXECUTE FUNCTION pegasus.guard_stock_nonnegative();

CREATE OR REPLACE FUNCTION pegasus.apply_stock_movement()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO existencias(variante_id, almacen_id, cantidad)
  VALUES(NEW.variante_id, NEW.almacen_id, 0)
  ON CONFLICT (variante_id, almacen_id) DO NOTHING;

  UPDATE existencias
  SET cantidad = cantidad + NEW.cambio_cantidad
  WHERE variante_id=NEW.variante_id AND almacen_id=NEW.almacen_id;

  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_mov_apply
AFTER INSERT ON movimientos_stock
FOR EACH ROW EXECUTE FUNCTION pegasus.apply_stock_movement();

-- ============================================================================
-- V8: Pedidos, direcciones, ítems y recalculo de totales
-- ============================================================================

CREATE TABLE IF NOT EXISTS pedidos (
  id              BIGSERIAL PRIMARY KEY,
  numero_pedido   TEXT NOT NULL UNIQUE,
  cliente_id      BIGINT NOT NULL REFERENCES pegasus.clientes(id),
  moneda          CHAR(3) NOT NULL DEFAULT 'PEN',
  subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
  descuento       NUMERIC(12,2) NOT NULL DEFAULT 0,
  impuesto        NUMERIC(12,2) NOT NULL DEFAULT 0,
  monto_envio     NUMERIC(12,2) NOT NULL DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL DEFAULT 0,
  estado          TEXT NOT NULL CHECK (estado IN(
                        'creado','pago_pendiente','pagado','preparando',
                        'parcialmente_enviado','enviado','entregado',
                        'cancelado','devuelto','cerrado'
                     )),
  realizado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notas_cliente   TEXT NULL,
  cupon_id        BIGINT NULL REFERENCES pegasus.cupones(id) ON DELETE SET NULL,
  CONSTRAINT chk_pedido_totales_nonneg CHECK (
    subtotal >= 0 AND descuento >= 0 AND impuesto >= 0 AND
    monto_envio >= 0 AND total >= 0
  )
);

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id, realizado_en DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado  ON pedidos(estado);

CREATE OR REPLACE TRIGGER trg_pedidos_updated
BEFORE UPDATE ON pegasus.pedidos
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

CREATE TABLE IF NOT EXISTS direcciones_pedido (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pegasus.pedidos(id) ON DELETE CASCADE,
  tipo_direccion  TEXT NOT NULL CHECK (tipo_direccion IN('facturacion','envio')),
  nombres         TEXT NULL,
  apellidos       TEXT NULL,
  razon_social    TEXT NULL,
  tipo_documento  TEXT NULL CHECK (tipo_documento IN('DNI','RUC','CE')),
  numero_documento TEXT NULL,
  telefono        TEXT NOT NULL,
  linea1          TEXT NOT NULL,
  linea2          TEXT NULL,
  distrito        TEXT NULL,
  provincia       TEXT NOT NULL,
  departamento    TEXT NULL,
  codigo_postal   TEXT NULL,
  codigo_pais     CHAR(2) NOT NULL DEFAULT 'PE',
  ubigeo          CHAR(6) NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_pedido_tipo_dir ON direcciones_pedido(pedido_id, tipo_direccion);

CREATE TABLE IF NOT EXISTS items_pedido (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pegasus.pedidos(id) ON DELETE CASCADE,
  producto_id     BIGINT NOT NULL REFERENCES pegasus.productos(id),
  variante_id     BIGINT NOT NULL REFERENCES pegasus.variantes(id),
  cantidad        INT NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL,
  descuento       NUMERIC(12,2) NOT NULL DEFAULT 0,
  impuesto        NUMERIC(12,2) NOT NULL DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL,
  CONSTRAINT chk_item_pedido_total CHECK (
    total = (cantidad * precio_unitario) - descuento + impuesto
  )
);

CREATE INDEX IF NOT EXISTS idx_items_pedido_pedido ON items_pedido(pedido_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_item_pedido_variante ON items_pedido(pedido_id, variante_id);

CREATE TABLE IF NOT EXISTS historial_estado_pedido (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pegasus.pedidos(id) ON DELETE CASCADE,
  estado          TEXT NOT NULL CHECK (estado IN(
                        'creado','pago_pendiente','pagado','preparando','parcialmente_enviado',
                        'enviado','entregado','cancelado','devuelto','cerrado'
                     )),
  cambiado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cambiado_por    BIGINT NULL REFERENCES pegasus.usuarios(id),
  comentario      TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_hist_pedido ON historial_estado_pedido(pedido_id, cambiado_en);

CREATE TABLE IF NOT EXISTS notas_pedido (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pegasus.pedidos(id) ON DELETE CASCADE,
  es_interna      BOOLEAN NOT NULL DEFAULT TRUE,
  nota            TEXT NOT NULL,
  creado_por      BIGINT NULL REFERENCES pegasus.usuarios(id),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION pegasus.guard_item_variante_pertenece_producto()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_prod BIGINT;
BEGIN
  SELECT producto_id INTO v_prod FROM pegasus.variantes WHERE id=NEW.variante_id;
  IF v_prod IS NULL OR v_prod <> NEW.producto_id THEN
    RAISE EXCEPTION 'La variante no pertenece al producto indicado en items_pedido';
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_item_variante_guard
BEFORE INSERT OR UPDATE ON pegasus.items_pedido
FOR EACH ROW EXECUTE FUNCTION pegasus.guard_item_variante_pertenece_producto();

CREATE OR REPLACE FUNCTION pegasus.recalc_pedido_totales(p_pedido_id BIGINT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE pegasus.pedidos o
  SET subtotal      = COALESCE(s.subtotal,0),
      descuento     = COALESCE(s.descuento,0),
      impuesto      = COALESCE(s.impuesto,0),
      total         = COALESCE(s.subtotal,0) - COALESCE(s.descuento,0) + COALESCE(s.impuesto,0) + o.monto_envio,
      actualizado_en= NOW()
  FROM (
    SELECT pedido_id,
           SUM(cantidad*precio_unitario) AS subtotal,
           SUM(descuento)                AS descuento,
           SUM(impuesto)                 AS impuesto
    FROM pegasus.items_pedido
    WHERE pedido_id = p_pedido_id
    GROUP BY pedido_id
  ) s
  WHERE o.id = p_pedido_id;
END $$;

CREATE OR REPLACE FUNCTION pegasus.hook_items_pedido_recalc()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pegasus.recalc_pedido_totales(CASE WHEN TG_OP='DELETE' THEN OLD.pedido_id ELSE NEW.pedido_id END);
  RETURN NULL;
END $$;

CREATE OR REPLACE TRIGGER trg_items_pedido_recalc_aiud
AFTER INSERT OR UPDATE OR DELETE ON pegasus.items_pedido
FOR EACH ROW EXECUTE FUNCTION pegasus.hook_items_pedido_recalc();

CREATE OR REPLACE FUNCTION pegasus.hook_pedidos_recalc_envio()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.monto_envio IS DISTINCT FROM OLD.monto_envio THEN
    PERFORM pegasus.recalc_pedido_totales(NEW.id);
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_pedidos_recalc_envio
AFTER UPDATE OF monto_envio ON pegasus.pedidos
FOR EACH ROW EXECUTE FUNCTION pegasus.hook_pedidos_recalc_envio();

ALTER TABLE pegasus.redenciones_cupon
  ADD CONSTRAINT fk_redenciones_pedidos
  FOREIGN KEY (pedido_id) REFERENCES pegasus.pedidos(id) ON DELETE SET NULL;

-- ============================================================================
-- V9: Envíos y logística (transportistas, zonas, envíos, paquetes, items, eventos)
-- ============================================================================

CREATE TABLE IF NOT EXISTS transportistas (
  id              BIGSERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS servicios_transportista (
  id                      BIGSERIAL PRIMARY KEY,
  transportista_id        BIGINT NOT NULL REFERENCES transportistas(id) ON DELETE CASCADE,
  nombre                  TEXT NOT NULL,
  codigo_servicio         TEXT NOT NULL,
  dias_transito           INT NULL,
  UNIQUE (transportista_id, codigo_servicio)
);

CREATE TABLE IF NOT EXISTS zonas_envio (
  id              BIGSERIAL PRIMARY KEY,
  nombre          TEXT NOT NULL,
  paises          TEXT[] NULL
);

CREATE TABLE IF NOT EXISTS zonas_envio_departamentos (
  zona_envio_id   BIGINT NOT NULL REFERENCES zonas_envio(id) ON DELETE CASCADE,
  departamento_id BIGINT NOT NULL REFERENCES ubigeo_departamentos(id) ON DELETE CASCADE,
  PRIMARY KEY (zona_envio_id, departamento_id)
);

CREATE TABLE IF NOT EXISTS guias_remision (
  id                      BIGSERIAL PRIMARY KEY,
  -- Vínculo a la venta, si aplica
  pedido_id               BIGINT NULL REFERENCES pedidos(id) ON DELETE SET NULL, 
  -- Serie y Número de la Guía (T001-0001)
  serie                   TEXT NOT NULL,
  numero                  BIGINT NOT NULL,
  fecha_emision           DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Datos del Traslado
  -- Código SUNAT: '01'=Venta, '04'=Transformación, '18'=Importación, etc.
  motivo_traslado_sunat   CHAR(2) NOT NULL, 
  -- '01'=Transporte Público, '02'=Transporte Privado
  modalidad_traslado_sunat CHAR(2) NOT NULL,
  fecha_inicio_traslado   TIMESTAMPTZ NOT NULL,
  
  -- Peso total de la carga (SUNAT lo exige)
  peso_bruto_total_kg     NUMERIC(10,2) NOT NULL,

  -- Destinatario (puede ser tu cliente u otra dirección)
  destinatario_tipo_doc   TEXT NOT NULL,
  destinatario_num_doc    TEXT NOT NULL,
  destinatario_razon_social TEXT NOT NULL,
  
  -- Datos del Transportista (si es transporte público, modalidad '01')
  transportista_id        BIGINT NULL REFERENCES transportistas(id), -- Tu tabla 'transportistas'
  transportista_ruc       TEXT NULL,
  transportista_nombre    TEXT NULL,

  -- Datos del Conductor (si es transporte privado, modalidad '02' o público)
  conductor_tipo_doc      TEXT NULL, -- DNI
  conductor_num_doc       TEXT NULL,
  conductor_nombres       TEXT NULL,
  conductor_apellidos     TEXT NULL,
  conductor_licencia      TEXT NULL,
  
  -- Datos del Vehículo (si es transporte privado, modalidad '02' o público)
  vehiculo_placa          TEXT NULL,

  -- Dirección de Partida (Tu almacén)
  partida_almacen_id      BIGINT NULL REFERENCES almacenes(id),
  partida_ubigeo          CHAR(6) NOT NULL,
  partida_linea1          TEXT NOT NULL,

  -- Dirección de Llegada (Dirección del cliente)
  llegada_distrito_id     BIGINT NULL REFERENCES ubigeo_distritos(id),
  llegada_ubigeo          CHAR(6) NOT NULL,
  llegada_linea1          TEXT NOT NULL,

  -- Estado de la Guía
  estado_sunat            TEXT NULL, -- 'ACEPTADO', 'RECHAZADO'
  cdr_sunat               BYTEA NULL,
  
  UNIQUE(serie, numero)
);

CREATE TABLE IF NOT EXISTS guias_remision_items (
  id                  BIGSERIAL PRIMARY KEY,
  guia_remision_id    BIGINT NOT NULL REFERENCES guias_remision(id) ON DELETE CASCADE,
  item_pedido_id      BIGINT NULL REFERENCES items_pedido(id) ON DELETE SET NULL, 
  variante_id         BIGINT NOT NULL REFERENCES variantes(id),
  descripcion         TEXT NOT NULL,
  cantidad            INT NOT NULL CHECK (cantidad > 0)
);

CREATE INDEX IF NOT EXISTS idx_gre_pedido ON guias_remision(pedido_id);
CREATE INDEX IF NOT EXISTS idx_gre_estado ON guias_remision(estado_sunat);
CREATE INDEX IF NOT EXISTS idx_gre_items_gre ON guias_remision_items(guia_remision_id);

CREATE TABLE IF NOT EXISTS guias_remision_eventos (
  id                BIGSERIAL PRIMARY KEY,
  guia_remision_id  BIGINT NOT NULL REFERENCES guias_remision(id) ON DELETE CASCADE,
  codigo_evento     TEXT NOT NULL,
  estado_sunat      TEXT NULL,
  descripcion       TEXT NULL,
  registrado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gre_eventos_gre ON guias_remision_eventos(guia_remision_id, registrado_en DESC);
CREATE INDEX IF NOT EXISTS idx_gre_eventos_codigo ON guias_remision_eventos(guia_remision_id, codigo_evento, registrado_en DESC);

CREATE TABLE IF NOT EXISTS tarifas_envio (
  id                        BIGSERIAL PRIMARY KEY,
  zona_id                   BIGINT NOT NULL REFERENCES zonas_envio(id) ON DELETE CASCADE,
  servicio_transportista_id BIGINT NOT NULL REFERENCES servicios_transportista(id) ON DELETE CASCADE,
  peso_min_g                INT NULL,
  peso_max_g                INT NULL,
  precio_base               NUMERIC(12,2) NOT NULL,
  precio_por_kg             NUMERIC(12,2) NULL,
  moneda                    CHAR(3) NOT NULL DEFAULT 'PEN',
  CONSTRAINT chk_tarifas_envio_nonneg CHECK (precio_base >= 0 AND (precio_por_kg IS NULL OR precio_por_kg >= 0)),
  CONSTRAINT chk_tarifas_envio_rango CHECK (
    (peso_min_g IS NULL OR peso_min_g >= 0) AND
    (peso_max_g IS NULL OR peso_max_g >= 0) AND
    (peso_min_g IS NULL OR peso_max_g IS NULL OR peso_min_g <= peso_max_g)
  )
);

ALTER TABLE tarifas_envio
  ADD CONSTRAINT ex_tarifas_envio_sin_solape
  EXCLUDE USING gist (
    zona_id WITH =,
    servicio_transportista_id WITH =,
    int4range(COALESCE(peso_min_g,0), COALESCE(peso_max_g,2147483647), '[]') WITH &&
  );

CREATE TABLE IF NOT EXISTS envios (
  id                        BIGSERIAL PRIMARY KEY,
  pedido_id                 BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  transportista_id          BIGINT NULL REFERENCES transportistas(id),
  servicio_transportista_id BIGINT NULL REFERENCES servicios_transportista(id),
  numero_seguimiento        TEXT NULL,
  estado                    TEXT NOT NULL CHECK (estado IN('creado','despachado','en_transito','entregado','incidencia')),
  enviado_en                TIMESTAMPTZ NULL,
  entregado_en              TIMESTAMPTZ NULL,
  creado_en                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  almacen_origen_id         BIGINT NULL REFERENCES almacenes(id)
);

CREATE INDEX IF NOT EXISTS idx_envios_pedido   ON envios(pedido_id, estado);
CREATE INDEX IF NOT EXISTS idx_envios_tracking ON envios(numero_seguimiento);
CREATE INDEX IF NOT EXISTS idx_envios_origen   ON envios(almacen_origen_id);

CREATE TABLE IF NOT EXISTS paquetes_envio (
  id                BIGSERIAL PRIMARY KEY,
  envio_id          BIGINT NOT NULL REFERENCES envios(id) ON DELETE CASCADE,
  numero_seguimiento TEXT NULL,
  peso_gramos       INT NULL,
  largo_mm          NUMERIC(12,2) NULL,
  ancho_mm          NUMERIC(12,2) NULL,
  alto_mm           NUMERIC(12,2) NULL,
  estado            TEXT NOT NULL DEFAULT 'creado'
);

CREATE INDEX IF NOT EXISTS idx_paquetes_envio ON paquetes_envio(envio_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_paquete_tracking_por_envio
  ON paquetes_envio (envio_id, numero_seguimiento)
  WHERE numero_seguimiento IS NOT NULL;

CREATE TABLE IF NOT EXISTS items_envio (
  id              BIGSERIAL PRIMARY KEY,
  envio_id        BIGINT NOT NULL REFERENCES envios(id) ON DELETE CASCADE,
  paquete_id      BIGINT NULL REFERENCES paquetes_envio(id) ON DELETE CASCADE,
  item_pedido_id  BIGINT NOT NULL REFERENCES items_pedido(id) ON DELETE CASCADE,
  variante_id     BIGINT NOT NULL REFERENCES variantes(id),
  cantidad        INT NOT NULL CHECK (cantidad > 0)
);

CREATE INDEX IF NOT EXISTS idx_items_envio_envio ON items_envio(envio_id);

CREATE TABLE IF NOT EXISTS eventos_envio (
  id              BIGSERIAL PRIMARY KEY,
  envio_id        BIGINT NOT NULL REFERENCES envios(id) ON DELETE CASCADE,
  codigo_evento   TEXT NOT NULL,
  detalle         TEXT NULL,
  ubicacion       TEXT NULL,
  evento_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventos_envio ON eventos_envio(envio_id, evento_en);

CREATE OR REPLACE FUNCTION pegasus.guard_envio_no_exceder()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cantidad_ordenada INT; cantidad_enviada INT;
BEGIN
  SELECT cantidad INTO cantidad_ordenada FROM items_pedido WHERE id=NEW.item_pedido_id;
  SELECT COALESCE(SUM(cantidad),0) INTO cantidad_enviada FROM items_envio WHERE item_pedido_id=NEW.item_pedido_id;
  IF cantidad_enviada + NEW.cantidad > cantidad_ordenada THEN
    RAISE EXCEPTION 'Cantidad enviada excede lo pedido';
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_envio_qty_guard
BEFORE INSERT ON items_envio
FOR EACH ROW EXECUTE FUNCTION pegasus.guard_envio_no_exceder();

CREATE OR REPLACE FUNCTION pegasus.guard_item_envio_consistencia()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE oi_pedido BIGINT; oi_variante BIGINT; sh_pedido BIGINT;
BEGIN
  SELECT pedido_id, variante_id INTO oi_pedido, oi_variante
  FROM items_pedido WHERE id = NEW.item_pedido_id;

  SELECT pedido_id INTO sh_pedido
  FROM envios WHERE id = NEW.envio_id;

  IF oi_pedido IS NULL OR sh_pedido IS NULL THEN
    RAISE EXCEPTION 'item_envio inconsistente: item_pedido o envio inexistente';
  END IF;

  IF sh_pedido <> oi_pedido THEN
    RAISE EXCEPTION 'envios.pedido_id (%) != items_pedido.pedido_id (%)', sh_pedido, oi_pedido;
  END IF;

  IF NEW.variante_id <> oi_variante THEN
    RAISE EXCEPTION 'items_envio.variante_id no coincide con items_pedido.variante_id';
  END IF;

  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_item_envio_consistencia
BEFORE INSERT OR UPDATE ON items_envio
FOR EACH ROW EXECUTE FUNCTION pegasus.guard_item_envio_consistencia();

CREATE OR REPLACE FUNCTION pegasus.consume_reservations(
  p_pedido BIGINT, p_variante BIGINT, p_wh BIGINT, p_qty INT
) RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE remaining INT := p_qty;
DECLARE rec RECORD;
BEGIN
  FOR rec IN
    SELECT id, cantidad FROM reservas_stock
    WHERE variante_id=p_variante AND almacen_id=p_wh
      AND (pedido_id = p_pedido OR p_pedido IS NULL)
      AND estado='activo'
    ORDER BY expira_en NULLS LAST, id
  LOOP
    EXIT WHEN remaining <= 0;
    IF rec.cantidad <= remaining THEN
      UPDATE reservas_stock SET estado='consumido' WHERE id=rec.id;
      remaining := remaining - rec.cantidad;
    ELSE
      UPDATE reservas_stock SET cantidad = cantidad - remaining WHERE id=rec.id;
      INSERT INTO reservas_stock(variante_id, almacen_id, pedido_id, cantidad, estado, expira_en, creado_en)
      SELECT p_variante, p_wh, p_pedido, remaining, 'consumido', expira_en, NOW()
      FROM reservas_stock WHERE id=rec.id;
      remaining := 0;
    END IF;
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION pegasus.apply_sale_on_item_envio()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE wh BIGINT; ord BIGINT;
BEGIN
  SELECT almacen_origen_id, pedido_id INTO wh, ord FROM envios WHERE id=NEW.envio_id;
  IF wh IS NULL THEN
    RAISE EXCEPTION 'Envio % no tiene almacen_origen_id', NEW.envio_id;
  END IF;

  INSERT INTO movimientos_stock(variante_id, almacen_id, cambio_cantidad, tipo_movimiento, tabla_referencia, referencia_id, nota)
  VALUES(NEW.variante_id, wh, -NEW.cantidad, 'venta', 'envios', NEW.envio_id, 'Auto: envio');

  PERFORM pegasus.consume_reservations(ord, NEW.variante_id, wh, NEW.cantidad);

  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_item_envio_apply_sale
AFTER INSERT ON items_envio
FOR EACH ROW EXECUTE FUNCTION pegasus.apply_sale_on_item_envio();

-- ============================================================================
-- V10: Pagos multi-proveedor
-- ============================================================================

CREATE TABLE IF NOT EXISTS proveedores_pago (
  id              BIGSERIAL PRIMARY KEY,
  codigo          TEXT NOT NULL UNIQUE,
  nombre          TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cuentas_pago (
  id              BIGSERIAL PRIMARY KEY,
  proveedor_id    BIGINT NOT NULL REFERENCES proveedores_pago(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  config          JSONB NULL,
  moneda          CHAR(3) NULL,
  codigo_pais     CHAR(2) NULL,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (proveedor_id, nombre)
);

CREATE TABLE IF NOT EXISTS metodos_pago (
  id                BIGSERIAL PRIMARY KEY,
  cuenta_id         BIGINT NOT NULL REFERENCES cuentas_pago(id) ON DELETE CASCADE,
  nombre            TEXT NOT NULL,
  codigo_metodo     TEXT NOT NULL,
  activo            BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT chk_metodo_codigo CHECK (codigo_metodo IN('tarjeta','paypal','transferencia_bancaria','yape','plin'))
);

CREATE TABLE IF NOT EXISTS transacciones_pago (
  id                BIGSERIAL PRIMARY KEY,
  pedido_id         BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  metodo_pago_id    BIGINT NOT NULL REFERENCES metodos_pago(id),
  ref_externa       TEXT NULL,
  clave_idempotencia TEXT NULL,
  estado            TEXT NOT NULL CHECK (estado IN('iniciado','autorizado','capturado','fallido','cancelado','reembolso_parcial','reembolso_total')),
  monto             NUMERIC(12,2) NOT NULL,
  monto_capturado   NUMERIC(12,2) NULL,
  moneda            CHAR(3) NOT NULL DEFAULT 'PEN',
  metadatos         JSONB NULL,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_tx_montos CHECK (monto > 0 AND (monto_capturado IS NULL OR (monto_capturado >= 0 AND monto_capturado <= monto)))
);

CREATE INDEX IF NOT EXISTS idx_tx_pago_pedido     ON transacciones_pago(pedido_id, estado);
CREATE INDEX IF NOT EXISTS idx_tx_pago_ref_externa ON transacciones_pago(ref_externa);

CREATE UNIQUE INDEX IF NOT EXISTS uq_tx_idemp_por_metodo
  ON transacciones_pago (metodo_pago_id, clave_idempotencia)
  WHERE clave_idempotencia IS NOT NULL;

CREATE TABLE IF NOT EXISTS cargos_pago (
  id                BIGSERIAL PRIMARY KEY,
  transaccion_pago_id BIGINT NOT NULL REFERENCES transacciones_pago(id) ON DELETE CASCADE,
  cargo_id          TEXT NOT NULL UNIQUE,
  monto_capturado   NUMERIC(12,2) NULL,
  estado            TEXT NOT NULL CHECK (estado IN('exitoso','pendiente','fallido','reembolsado')),
  url_recibo        TEXT NULL,
  marca_tarjeta     TEXT NULL,
  ultimos4_tarjeta  TEXT NULL,
  nivel_riesgo      TEXT NULL,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS eventos_proveedor_pago (
  id              BIGSERIAL PRIMARY KEY,
  proveedor_id    BIGINT NOT NULL REFERENCES proveedores_pago(id) ON DELETE CASCADE,
  cuenta_id       BIGINT NULL REFERENCES cuentas_pago(id) ON DELETE SET NULL,
  evento_id       TEXT NOT NULL,
  tipo_evento     TEXT NOT NULL,
  carga           JSONB NOT NULL,
  estado          TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN('pendiente','procesado','fallido')),
  ultimo_error    TEXT NULL,
  recibido_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  procesado_en    TIMESTAMPTZ NULL,
  UNIQUE (proveedor_id, evento_id)
);

CREATE TABLE IF NOT EXISTS disputas_pago (
  id                  BIGSERIAL PRIMARY KEY,
  transaccion_pago_id BIGINT NOT NULL REFERENCES transacciones_pago(id) ON DELETE CASCADE,
  disputa_id          TEXT NOT NULL UNIQUE,
  monto               NUMERIC(12,2) NOT NULL,
  motivo              TEXT NULL,
  estado              TEXT NOT NULL CHECK (estado IN('requiere_respuesta','en_revision','ganado','perdido')),
  evidencia_vencimiento_en TIMESTAMPTZ NULL,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cerrado_en          TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS reembolsos (
  id                  BIGSERIAL PRIMARY KEY,
  transaccion_pago_id BIGINT NOT NULL REFERENCES transacciones_pago(id) ON DELETE CASCADE,
  monto               NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  motivo              TEXT NULL,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION pegasus.guard_reembolsos_no_exceder()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cap NUMERIC; total NUMERIC;
BEGIN
  SELECT COALESCE(monto_capturado, monto) INTO cap FROM transacciones_pago WHERE id=NEW.transaccion_pago_id;
  SELECT COALESCE(SUM(monto),0) INTO total FROM reembolsos WHERE transaccion_pago_id=NEW.transaccion_pago_id;
  IF total + NEW.monto > cap THEN
    RAISE EXCEPTION 'Suma de reembolsos (%, +%) excede monto capturado %', total, NEW.monto, cap;
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_reembolsos_guard
BEFORE INSERT ON reembolsos
FOR EACH ROW EXECUTE FUNCTION pegasus.guard_reembolsos_no_exceder();

-- ============================================================================
-- V11: RMA / devoluciones del cliente
-- ============================================================================

CREATE TABLE IF NOT EXISTS solicitudes_devolucion (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  cliente_id      BIGINT NOT NULL REFERENCES clientes(id),
  codigo_motivo   TEXT NOT NULL,
  descripcion     TEXT NULL,
  estado          TEXT NOT NULL CHECK (estado IN('recibido','autorizado','devolucion_en_transito','recibido_en_almacen','inspeccionado','aprobado','rechazado','resuelto')),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_solicitudes_dev_updated
BEFORE UPDATE ON solicitudes_devolucion
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

CREATE TABLE IF NOT EXISTS items_devolucion (
  id                    BIGSERIAL PRIMARY KEY,
  solicitud_devolucion_id BIGINT NOT NULL REFERENCES solicitudes_devolucion(id) ON DELETE CASCADE,
  item_pedido_id       BIGINT NOT NULL REFERENCES items_pedido(id),
  variante_id          BIGINT NOT NULL REFERENCES variantes(id),
  cantidad             INT NOT NULL CHECK (cantidad > 0),
  nota_condicion       TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_items_devolucion_req ON items_devolucion(solicitud_devolucion_id);

CREATE OR REPLACE FUNCTION pegasus.guard_rma_variante_match()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_id BIGINT;
BEGIN
  SELECT variante_id INTO v_id FROM items_pedido WHERE id=NEW.item_pedido_id;
  IF v_id IS NULL OR v_id <> NEW.variante_id THEN
    RAISE EXCEPTION 'La variante del RMA no coincide con la del pedido';
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_rma_item_variante_guard
BEFORE INSERT OR UPDATE ON items_devolucion
FOR EACH ROW EXECUTE FUNCTION pegasus.guard_rma_variante_match();

CREATE OR REPLACE FUNCTION pegasus.guard_rma_no_exceder_pedido()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cantidad_ordenada INT; cantidad_ya INT;
BEGIN
  SELECT cantidad INTO cantidad_ordenada FROM items_pedido WHERE id = NEW.item_pedido_id;

  SELECT COALESCE(SUM(cantidad),0) INTO cantidad_ya
  FROM items_devolucion
  WHERE item_pedido_id = NEW.item_pedido_id
    AND (TG_OP = 'INSERT' OR id <> NEW.id);

  IF cantidad_ordenada IS NULL THEN
    RAISE EXCEPTION 'item_pedido % no existe', NEW.item_pedido_id;
  END IF;

  IF cantidad_ya + NEW.cantidad > cantidad_ordenada THEN
    RAISE EXCEPTION 'RMA excede lo pedido: % + % > %', cantidad_ya, NEW.cantidad, cantidad_ordenada;
  END IF;

  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_rma_no_exceder_pedido
BEFORE INSERT OR UPDATE ON items_devolucion
FOR EACH ROW EXECUTE FUNCTION pegasus.guard_rma_no_exceder_pedido();

CREATE TABLE IF NOT EXISTS inspecciones_rma (
  id                    BIGSERIAL PRIMARY KEY,
  solicitud_devolucion_id BIGINT NOT NULL REFERENCES solicitudes_devolucion(id) ON DELETE CASCADE,
  inspeccionado_por     BIGINT NULL REFERENCES usuarios(id),
  resultado             TEXT NOT NULL CHECK (resultado IN('aprobado','rechazado','aprobado_parcial')),
  notas                 TEXT NULL,
  inspeccionado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resoluciones_rma (
  id                      BIGSERIAL PRIMARY KEY,
  solicitud_devolucion_id BIGINT NOT NULL REFERENCES solicitudes_devolucion(id) ON DELETE CASCADE,
  tipo_resolucion         TEXT NOT NULL CHECK (tipo_resolucion IN('reembolso','reemplazo')),
  monto_reembolso         NUMERIC(12,2) NULL,
  variante_reemplazo_id   BIGINT NULL REFERENCES variantes(id),
  reponer                 BOOLEAN NOT NULL DEFAULT FALSE,
  resuelto_en             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS envios_devolucion (
  id                      BIGSERIAL PRIMARY KEY,
  solicitud_devolucion_id BIGINT NOT NULL REFERENCES solicitudes_devolucion(id) ON DELETE CASCADE,
  transportista_id        BIGINT NULL REFERENCES transportistas(id),
  numero_seguimiento      TEXT NULL,
  estado                  TEXT NOT NULL CHECK (estado IN('etiqueta_creada','en_transito','recibido','incidencia')),
  creado_en               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  almacen_id              BIGINT NULL REFERENCES almacenes(id)
);

CREATE INDEX IF NOT EXISTS idx_envios_devolucion_wh ON envios_devolucion(almacen_id);

CREATE OR REPLACE FUNCTION pegasus.apply_rma_in_on_received()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.estado='recibido' AND (OLD.estado IS DISTINCT FROM 'recibido') THEN
    IF NEW.almacen_id IS NULL THEN
      RAISE EXCEPTION 'envio_devolucion % sin almacen_id', NEW.id;
    END IF;

    INSERT INTO movimientos_stock(variante_id, almacen_id, cambio_cantidad, tipo_movimiento, tabla_referencia, referencia_id, nota)
  SELECT ri.variante_id, NEW.almacen_id, ri.cantidad, 'rma_entrada', 'envios_devolucion', NEW.id, 'Auto: RMA recibido'
    FROM items_devolucion ri
    WHERE ri.solicitud_devolucion_id = NEW.solicitud_devolucion_id;
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_rma_in_on_received
AFTER UPDATE ON envios_devolucion
FOR EACH ROW EXECUTE FUNCTION pegasus.apply_rma_in_on_received();

-- ============================================================================
-- V12: Compras y abastecimiento (proveedores, OC, recepciones, devoluciones)
-- ============================================================================

CREATE TABLE IF NOT EXISTS proveedores (
  id              BIGSERIAL PRIMARY KEY,
  ruc             TEXT NOT NULL UNIQUE,
  nombre          TEXT NOT NULL,
  correo          CITEXT NULL,
  telefono        TEXT NULL,
  tipo_origen     TEXT NOT NULL CHECK (tipo_origen IN('local','regional','nacional','internacional')),
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ordenes_compra (
  id              BIGSERIAL PRIMARY KEY,
  proveedor_id    BIGINT NOT NULL REFERENCES proveedores(id),
  fecha_emision   DATE NOT NULL,
  moneda          CHAR(3) NOT NULL DEFAULT 'PEN',
  total_bruto     NUMERIC(12,2) NOT NULL,
  estado          TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN('pendiente','aprobado', 'recibido','cancelado')),
  notas           TEXT NULL,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items_orden_compra (
  id                  BIGSERIAL PRIMARY KEY,
  orden_compra_id     BIGINT NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  variante_id         BIGINT NOT NULL REFERENCES variantes(id),
  cantidad_pedida     INT NOT NULL CHECK (cantidad_pedida > 0),
  costo_unitario      NUMERIC(12,2) NOT NULL,
  subtotal            NUMERIC(12,2) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_item_oc ON items_orden_compra(orden_compra_id, variante_id);

CREATE TABLE IF NOT EXISTS recepciones_mercancia (
  id                BIGSERIAL PRIMARY KEY,
  orden_compra_id   BIGINT NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
  recibido_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recibido_por      BIGINT NULL REFERENCES usuarios(id),
  notas             TEXT NULL
);

CREATE TABLE IF NOT EXISTS items_recepcion_mercancia (
  id                    BIGSERIAL PRIMARY KEY,
  recepcion_mercancia_id BIGINT NOT NULL REFERENCES recepciones_mercancia(id) ON DELETE CASCADE,
  item_orden_compra_id  BIGINT NOT NULL REFERENCES items_orden_compra(id),
  almacen_id            BIGINT NOT NULL REFERENCES almacenes(id),
  cantidad_recibida     INT NOT NULL CHECK (cantidad_recibida >= 0),
  numero_lote           TEXT NULL,
  fecha_vencimiento     DATE NULL
);

CREATE OR REPLACE FUNCTION pegasus.apply_gr_on_receipt_item()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_variante BIGINT;
BEGIN
  SELECT variante_id INTO v_variante FROM items_orden_compra WHERE id=NEW.item_orden_compra_id;
  IF v_variante IS NULL THEN
    RAISE EXCEPTION 'item_orden_compra % sin variante', NEW.item_orden_compra_id;
  END IF;

  INSERT INTO movimientos_stock(variante_id, almacen_id, cambio_cantidad, tipo_movimiento, tabla_referencia, referencia_id, nota)
  VALUES(v_variante, NEW.almacen_id, NEW.cantidad_recibida, 'recepcion_compra', 'recepciones_mercancia', NEW.recepcion_mercancia_id, 'Auto: recepcion OC');

  IF NEW.numero_lote IS NOT NULL OR NEW.fecha_vencimiento IS NOT NULL THEN
    INSERT INTO lotes_stock(variante_id, almacen_id, numero_lote, fecha_vencimiento, cantidad)
    VALUES(v_variante, NEW.almacen_id, NEW.numero_lote, NEW.fecha_vencimiento, NEW.cantidad_recibida)
    ON CONFLICT (variante_id, almacen_id, numero_lote, fecha_vencimiento)
    DO UPDATE SET cantidad = lotes_stock.cantidad + EXCLUDED.cantidad;
  END IF;

  RETURN NEW;
END $$;

CREATE OR REPLACE TRIGGER trg_rm_item_apply_in
AFTER INSERT ON items_recepcion_mercancia
FOR EACH ROW EXECUTE FUNCTION pegasus.apply_gr_on_receipt_item();

CREATE TABLE IF NOT EXISTS devoluciones_proveedor (
  id                  BIGSERIAL PRIMARY KEY,
  proveedor_id        BIGINT NOT NULL REFERENCES proveedores(id),
  orden_compra_id     BIGINT NULL REFERENCES ordenes_compra(id) ON DELETE SET NULL,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  motivo              TEXT NOT NULL,
  estado              TEXT NOT NULL CHECK (estado IN('pendiente','enviado','confirmado','cancelado'))
);

CREATE TABLE IF NOT EXISTS items_devolucion_proveedor (
  id                      BIGSERIAL PRIMARY KEY,
  devolucion_proveedor_id BIGINT NOT NULL REFERENCES devoluciones_proveedor(id) ON DELETE CASCADE,
  variante_id             BIGINT NOT NULL REFERENCES variantes(id),
  cantidad                INT NOT NULL CHECK (cantidad > 0),
  notas                   TEXT NULL
);

-- ============================================================================
-- V13: Facturación y comprobantes (SUNAT)
-- ============================================================================

CREATE TABLE IF NOT EXISTS series_comprobante (
  id              BIGSERIAL PRIMARY KEY,
  tipo_doc        TEXT NOT NULL,
  codigo_serie    TEXT NOT NULL,
  UNIQUE (tipo_doc, codigo_serie),
  CONSTRAINT chk_series_tipo_doc CHECK (tipo_doc IN('boleta','factura','nota_credito','nota_debito'))
);

CREATE TABLE IF NOT EXISTS comprobantes (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NULL REFERENCES pedidos(id),
  resolucion_rma_id BIGINT NULL REFERENCES resoluciones_rma(id) ON DELETE SET NULL,
  serie_id        BIGINT NOT NULL REFERENCES series_comprobante(id),
  numero          BIGINT NOT NULL,
  comprobante_referencia_id BIGINT NULL REFERENCES comprobantes(id) ON DELETE SET NULL,
  motivo_nota_sunat TEXT NULL,
  fecha_emision   DATE NOT NULL DEFAULT CURRENT_DATE,
  cliente_id      BIGINT NOT NULL REFERENCES clientes(id),
  moneda          CHAR(3) NOT NULL DEFAULT 'PEN',
  subtotal        NUMERIC(12,2) NOT NULL,
  descuento_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  impuesto_total  NUMERIC(12,2) NOT NULL DEFAULT 0,
  total           NUMERIC(12,2) NOT NULL,
  estado          TEXT NOT NULL DEFAULT 'emitido' CHECK (estado IN('emitido','anulado')),
  estado_sunat    TEXT NULL,
  hash_xml_sunat  TEXT NULL,
  cdr_sunat       BYTEA NULL,
  UNIQUE (serie_id, numero)
);

CREATE TABLE IF NOT EXISTS items_comprobante (
  id                BIGSERIAL PRIMARY KEY,
  comprobante_id    BIGINT NOT NULL REFERENCES comprobantes(id) ON DELETE CASCADE,
  item_pedido_id    BIGINT NULL REFERENCES items_pedido(id),
  descripcion       TEXT NOT NULL,
  cantidad          INT NOT NULL CHECK (cantidad > 0),
  precio_unitario   NUMERIC(12,2) NOT NULL,
  impuesto          NUMERIC(12,2) NOT NULL DEFAULT 0,
  tipo_afectacion   TEXT NOT NULL DEFAULT '10' CHECK (tipo_afectacion IN('10','20','30','40')), -- 10 = Gravado, 20 = Exonerado , 30 = Inafecto , 40 = Exportación'
  total             NUMERIC(12,2) NOT NULL,
  CONSTRAINT chk_item_comprobante_total CHECK (total = (cantidad * precio_unitario) + impuesto)
);

CREATE INDEX IF NOT EXISTS idx_items_comprobante ON items_comprobante(comprobante_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_comprobante_unica_por_rma
  ON comprobantes(resolucion_rma_id) WHERE resolucion_rma_id IS NOT NULL;

CREATE OR REPLACE FUNCTION pegasus.recalc_comprobante_totales(p_comprobante_id BIGINT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  UPDATE comprobantes i
  SET subtotal    = COALESCE(s.subtotal,0),
      impuesto_total = COALESCE(s.impuesto,0),
      total      = COALESCE(s.subtotal,0) - i.descuento_total + COALESCE(s.impuesto,0)
  FROM (
    SELECT comprobante_id,
           SUM(cantidad*precio_unitario) AS subtotal,
           SUM(impuesto)                 AS impuesto
    FROM items_comprobante
    WHERE comprobante_id = p_comprobante_id
    GROUP BY comprobante_id
  ) s
  WHERE i.id = p_comprobante_id;
END $$;

CREATE OR REPLACE FUNCTION pegasus.hook_items_comprobante_recalc()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  PERFORM pegasus.recalc_comprobante_totales(CASE WHEN TG_OP='DELETE' THEN OLD.comprobante_id ELSE NEW.comprobante_id END);
  RETURN NULL;
END $$;

CREATE OR REPLACE TRIGGER trg_items_comprobante_recalc_aiud
AFTER INSERT OR UPDATE OR DELETE ON items_comprobante
FOR EACH ROW EXECUTE FUNCTION pegasus.hook_items_comprobante_recalc();

-- ============================================================================
-- V14: CMS y páginas informativas
-- ============================================================================

CREATE TABLE IF NOT EXISTS paginas_cms (
  id              BIGSERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  titulo          TEXT NOT NULL,
  contenido_html  TEXT NOT NULL,
  publicado       BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_paginas_cms_updated
BEFORE UPDATE ON paginas_cms
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();
-- ============================================================================
-- V15: Soporte al cliente (tickets y mensajes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tickets_soporte (
  id              BIGSERIAL PRIMARY KEY,
  cliente_id      BIGINT NULL REFERENCES clientes(id) ON DELETE SET NULL,
  pedido_id       BIGINT NULL REFERENCES pedidos(id) ON DELETE SET NULL,
  asunto          TEXT NOT NULL,
  estado          TEXT NOT NULL CHECK (estado IN('abierto','pendiente','resuelto','cerrado')),
  prioridad       TEXT NULL CHECK (prioridad IN('baja','normal','alta','urgente')),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_tickets_soporte_updated
BEFORE UPDATE ON tickets_soporte
FOR EACH ROW EXECUTE FUNCTION pegasus.set_updated_at();

CREATE TABLE IF NOT EXISTS mensajes_soporte (
  id                 BIGSERIAL PRIMARY KEY,
  ticket_id          BIGINT NOT NULL REFERENCES tickets_soporte(id) ON DELETE CASCADE,
  autor_usuario_id   BIGINT NULL REFERENCES usuarios(id),
  autor_cliente_id   BIGINT NULL REFERENCES clientes(id),
  mensaje            TEXT NOT NULL,
  creado_en          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ( ((autor_usuario_id IS NOT NULL)::int + (autor_cliente_id IS NOT NULL)::int) = 1 )
);

CREATE INDEX IF NOT EXISTS idx_mensajes_soporte_ticket ON mensajes_soporte(ticket_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_soporte_ticket_creado ON mensajes_soporte (ticket_id, creado_en);

-- ============================================================================
-- V16: Reglas de atributos obligatorios y enlaces finales
-- ============================================================================

CREATE OR REPLACE FUNCTION pegasus.require_product_attrs()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE missing_count INT;
BEGIN
  SELECT COUNT(*) INTO missing_count
  FROM atributos_categoria ca
  JOIN definiciones_atributo ad ON ad.id = ca.atributo_id AND ad.alcance='producto'
  WHERE ca.categoria_id = NEW.categoria_id AND ca.obligatorio = TRUE
    AND NOT EXISTS (SELECT 1 FROM valores_atributo_producto vap
                    WHERE vap.producto_id = NEW.id AND vap.atributo_id = ca.atributo_id);
  IF missing_count > 0 THEN
    RAISE EXCEPTION 'Faltan atributos obligatorios de producto para la categoria %', NEW.categoria_id;
  END IF;
  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION pegasus.require_variant_attrs()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cat_id BIGINT; missing_count INT;
BEGIN
  SELECT categoria_id INTO cat_id FROM productos WHERE id = NEW.producto_id;
  SELECT COUNT(*) INTO missing_count
  FROM atributos_categoria ca
  JOIN definiciones_atributo ad ON ad.id = ca.atributo_id AND ad.alcance='variante'
  WHERE ca.categoria_id = cat_id AND ca.obligatorio = TRUE
    AND NOT EXISTS (SELECT 1 FROM valores_atributo_variante vav
                    WHERE vav.variante_id = NEW.id AND vav.atributo_id = ca.atributo_id);
  IF missing_count > 0 THEN
    RAISE EXCEPTION 'Faltan atributos obligatorios de variante para la categoria %', cat_id;
  END IF;
  RETURN NEW;
END $$;

CREATE CONSTRAINT TRIGGER trg_producto_require_attrs
AFTER INSERT OR UPDATE OF categoria_id ON productos
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION pegasus.require_product_attrs();

CREATE CONSTRAINT TRIGGER trg_variante_require_attrs
AFTER INSERT ON variantes
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION pegasus.require_variant_attrs();

ALTER TABLE reservas_stock
  ADD CONSTRAINT fk_reservas_pedido
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_reservas_pedido ON reservas_stock(pedido_id);
CREATE INDEX IF NOT EXISTS idx_reembolsos_tx            ON reembolsos(transaccion_pago_id);
CREATE INDEX IF NOT EXISTS idx_cargos_pago_tx           ON cargos_pago(transaccion_pago_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_dev_pedido   ON solicitudes_devolucion(pedido_id);
CREATE INDEX IF NOT EXISTS idx_resoluciones_rma_req     ON resoluciones_rma(solicitud_devolucion_id);
CREATE INDEX IF NOT EXISTS idx_envios_devolucion_req    ON envios_devolucion(solicitud_devolucion_id);
CREATE INDEX IF NOT EXISTS idx_recepciones_oc           ON recepciones_mercancia(orden_compra_id);
CREATE INDEX IF NOT EXISTS idx_items_rm_rm              ON items_recepcion_mercancia(recepcion_mercancia_id);
