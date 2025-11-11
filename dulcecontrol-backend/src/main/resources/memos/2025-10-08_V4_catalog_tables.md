# V4 – Tablas de Catálogos (2025-10-08)

**Completado**

- Se crearon 9 tablas para gestión de catálogos y maestros:
  1. **categoria_producto**: Categorías de productos (panes, pasteles, etc.).
  2. **producto**: Catálogo completo con código único, precio, slug para web.
  3. **producto_imagen**: Galería de imágenes por producto con orden.
  4. **insumo**: Materias primas con costo de referencia.
  5. **receta**: Una receta por producto para planificación.
  6. **receta_item**: Ingredientes de cada receta con cantidades.
  7. **inventario_producto**: Stock actual y mínimo por sede.
  8. **inventario_config**: Stock ideal para planificación de producción.
  9. **cliente**: Registro de clientes con email case-insensitive.

**Mejoras aplicadas**

- **Índices trigram** en nombres de producto, insumo y cliente para búsqueda rápida.
- **Índice parcial** para detectar productos con stock bajo.
- **Slug único** en productos para URLs amigables en e-commerce.
- **Validaciones de precios y stocks** no negativos.
- **ON DELETE CASCADE** en imágenes y recetas (datos dependientes).
- **ON DELETE RESTRICT** en receta_item para evitar eliminar insumos en uso.
- **ON DELETE SET NULL** en categoría de producto (mantiene producto si se elimina categoría).
- Separación clara entre **inventario real** (stock actual) y **objetivo** (stock ideal).

**Modelo de datos**

- Un producto puede tener múltiples imágenes ordenadas.
- Un producto tiene máximo una receta.
- Una receta puede tener múltiples ingredientes (insumos).
- El inventario se gestiona por sede-producto (llave compuesta).
- Clientes pueden tener email opcional para pedidos anónimos.

**Siguiente**

- V5: Crear tablas operacionales de POS (caja, ventas, items, pagos).
