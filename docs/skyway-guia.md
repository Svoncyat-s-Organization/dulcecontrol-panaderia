### Guía Esencial de Flyway para Dulce Control - Panadería y Pastelería

Flyway es el **gestor del historial de nuestra base de datos**. Su único propósito es garantizar que la **estructura** de la base de datos sea la misma para todos los miembros del equipo y en todos los entornos (desarrollo, producción).

#### **Conceptos Clave**

* **Fuente Única de Verdad:** La carpeta `src/main/resources/db/migration` en nuestro proyecto backend es la única fuente de verdad sobre cómo debe ser la estructura de la base de datos.
* **Archivos de Migración:** Cada cambio en la estructura de la base de datos se realiza **añadiendo un nuevo archivo SQL** a esa carpeta. Nunca se modifican o eliminan archivos antiguos.
* **Convención de Nombres:** El nombre de cada archivo es crucial y debe seguir el formato `V<VERSION>__<DESCRIPCION>.sql`.
    * `V1__create_initial_tables.sql`
    * `V2__add_image_url_to_products.sql`
    * `V3__...`
* **Ejecución Automática:** Flyway se ejecuta automáticamente cada vez que iniciamos la aplicación de Spring Boot. Compara los archivos de migración del proyecto con su tabla de historial (`flyway_schema_history`) en la base de datos y aplica solo los cambios nuevos.

#### **¿Por Qué lo Usamos?**

1.  **Consistencia:** Garantiza que el "patio de juegos" (la BD local) de cada desarrollador tenga la misma estructura actualizada, eliminando los errores de tipo "en mi máquina sí funciona".
2.  **Automatización:** Elimina la necesidad de pasar scripts SQL manualmente por chat o correo. El versionado de la base de datos es parte del código.
3.  **Seguridad:** Permite hacer cambios complejos en la base de datos de manera ordenada y replicable, reduciendo el riesgo de errores en producción.