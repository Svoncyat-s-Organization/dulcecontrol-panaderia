# Módulos Sidebar Superadministrador

#### 📊 1. Tablero Principal

_(Vista agregada mediante `COUNT()` y `SUM()` de las tablas principales)_

- **Resumen Operativo:** KPIs en tiempo real (MRR, Tiendas Activas vs. En Prueba, Tickets Abiertos).

#### 🏪 2. Gestión de Tiendas

_(Tu cartera de panaderías)_

- **Directorio de Tiendas:** Vista principal de la tabla `tiendas`.
  - _Acciones:_ Ver detalle, Suspensión manual (update `estado`), Login como cliente.
- **Monitor de Sedes:** Vista global de tabla `sedes`. Útil para ver el volumen real de ocupación de tus clientes.
- **Dominios Personalizados:** Gestión de tabla `dominios_tienda`.
  - _Uso:_ Validar si los CNAMEs de los clientes están apuntando correctamente a tu SaaS.
- **Usuarios de Clientes:** Vista de tabla `usuarios_admin`.
  - _Uso:_ Soporte técnico (ej. "¿Por qué mi contador no puede entrar?").

#### 📋 Planes y Suscripciones

_(El motor de tu modelo de negocio)_

- **Catálogo de Planes:** ABM (Alta/Baja/Modificación) directo a la tabla `planes`.
  - _Clave:_ Aquí defines los límites JSONB que tu backend debe hacer cumplir.
- **Suscripciones Activas:** Vista de tabla `suscripciones`.
  - _Uso:_ Identificar clientes en `estado: vencida` o `en_prueba`.
- **Historial de Movimientos:** Vista de `historial_suscripciones`.
  - _Uso:_ Auditoría de upgrades/downgrades y cálculo de churn.

#### ⚖️ Facturación y SUNAT

_(Tu cumplimiento fiscal y flujo de caja)_

- **Monitor de Comprobantes:** Vista central de tabla `comprobantes`.
  - _Filtros clave:_ Por `estados_sunat` (especialmente 'rechazado' u 'observado') y por `tipos_comprobante` (para ver Facturas vs Notas de Crédito usadas con `referencia_id`).
- **Pasarela de Pagos:** Vista directa de tabla `transacciones_pago`.
  - _Uso:_ Depuración de cobros fallidos (ver `mensaje_error` de Stripe/Culqi sin salir de tu plataforma).
- **Configuración de Series:** ABM de tabla `series`.
  - _Uso:_ Crear nuevas series (F002, B002) cuando una llega al límite o cambia el año si así lo decides.

#### 🎫 Centro de Soporte

_(Comunicación con clientes)_

- **Bandeja de Tickets:** Vista de `tickets_soporte` unida con `mensajes_ticket` (para ver último mensaje).
  - _Organización:_ Filtros rápidos por `prioridad_ticket` y `estados_ticket`.

#### 🛠️ Sistema y Seguridad

_(Control interno de la plataforma)_

- **Equipo Superadmin:** ABM de tabla `usuarios_superadmin`.
- **Bitácora de Auditoría:** Vista de solo lectura de `actividad_superadmin`.
  - _Uso:_ Saber quién de tu equipo suspendió una tienda por error.
