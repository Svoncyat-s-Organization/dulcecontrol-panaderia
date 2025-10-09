# V1 – Esquema Base y Extensiones (2025-10-08)

**Completado**

- Se creó el esquema `dulce_control` para aislar todas las tablas y funciones del sistema.
- Se configuró `search_path` para priorizar el esquema personalizado sobre `public`.
- Se activaron 3 extensiones PostgreSQL:
  - **citext**: Permite campos de texto case-insensitive (emails, códigos).
  - **pg_trgm**: Habilita búsqueda por similitud usando trigramas para autocompletado.
  - **btree_gist**: Soporta índices avanzados para rangos y restricciones de exclusión.

**Mejoras aplicadas**

- Separación del esquema monolítico en versiones modulares para Flyway.
- Uso de extensiones nativas de PostgreSQL para optimización desde la base.

**Siguiente**

- V2: Implementar funciones PL/pgSQL para automatización (triggers, validaciones).
