# V3 – Tablas Core de Organización y Acceso (2025-10-08)

**Completado**

- Se crearon 8 tablas fundamentales para la gestión de usuarios y seguridad:
  1. **sede**: Sucursales o puntos de venta (con validación de teléfono).
  2. **rol**: Roles del sistema (admin, cajero, panadero, etc.).
  3. **permiso**: Permisos granulares con códigos únicos.
  4. **rol_permiso**: Asignación de permisos a roles (N:M).
  5. **usuario**: Usuarios con email case-insensitive y hash bcrypt.
  6. **usuario_rol**: Asignación de roles a usuarios (N:M).
  7. **usuario_sede**: Control de acceso por sede (N:M).
  8. **usuario_recuperacion**: Tokens para reseteo de contraseña.

**Mejoras aplicadas**

- Uso de **CITEXT** para emails (búsquedas case-insensitive automáticas).
- Validación de formato de teléfono con regex PostgreSQL.
- Validación de longitud mínima de hash (60 chars) para garantizar bcrypt.
- Índice GIN con trigramas en email para búsquedas rápidas.
- Índice parcial en tokens no usados para optimizar recuperación.
- Triggers automáticos para `actualizado_en` en todas las tablas principales.
- ON DELETE CASCADE en relaciones para limpieza automática.
- ON DELETE RESTRICT en usuario_rol para evitar eliminar roles en uso.

**Modelo de seguridad**

- Un usuario puede tener múltiples roles.
- Un rol puede tener múltiples permisos.
- Un usuario puede acceder a múltiples sedes.
- Separación clara entre autenticación (usuario) y autorización (roles/permisos).

**Siguiente**

- V4: Crear tablas de catálogos (productos, categorías, insumos, recetas).
