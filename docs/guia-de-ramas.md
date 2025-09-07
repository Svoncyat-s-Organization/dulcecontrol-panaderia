## Guía de Ramas (Branches) para el Proyecto Dulce Control

En nuestro proyecto, las ramas de Git son la herramienta principal para mantener el orden y trabajar en paralelo sin interrumpirnos. Piensa en ellas como diferentes líneas de tiempo o universos de nuestro código.



---
## Ramas Principales (Las Eternas)

Estas dos ramas son la columna vertebral del proyecto y nunca se eliminan. Deben estar protegidas en GitHub.

### Rama: **`main` 🌳**
* **Propósito: Producción.** Esta rama representa la versión del código que está 100% terminada, probada y lista para ser presentada o desplegada. Es la versión "oficial" de Dulce Control: Panadería y Pastelería.
* **Regla de Oro: Nadie trabaja directamente en `main`**. La única forma en que el código llega a `main` es a través de una fusión controlada desde `develop` cuando se decide lanzar una nueva versión estable.

### Rama: **`develop` 🛠️**
* **Propósito: Desarrollo e Integración.** Esta es la rama principal de trabajo. Contiene la última versión del código en la que todo el equipo está colaborando. Todas las nuevas funcionalidades y correcciones se fusionan aquí.
* **Regla de Oro: Nadie trabaja directamente en `develop`**. Esta rama es la base desde la cual se crean todas las ramas de trabajo.

---
## Ramas de Trabajo (Las Temporales)

Estas ramas tienen un ciclo de vida corto: se crean para una tarea específica, se fusionan a `develop` mediante un Pull Request, y luego se eliminan.

 **`feature/...` ✨**
* **Propósito: Nuevas Funcionalidades.** Se usa para desarrollar cualquier característica nueva para Dulce Control. Es el tipo de rama que más usaremos.
* **Se crea desde:** `develop`.
* **Se fusiona a:** `develop`.
* **Ejemplos:**
    * `feature/user-login-form`
    * `feature/product-search-api`
    * `feature/shopping-cart-logic`

 **`fix/...` 🐛**
* **Propósito: Corrección de Errores (Bugs).** Se usa cuando se encuentra un error en la rama `develop` que necesita ser arreglado.
* **Se crea desde:** `develop`.
* **Se fusiona a:** `develop`.
* **Ejemplos:**
    * `fix/login-button-not-working`
    * `fix/incorrect-price-calculation`

 **`chore/...` 🧹**
* **Propósito: Tareas y Mantenimiento.** Se usa para cambios que no son una nueva funcionalidad ni un bug, como actualizar documentación, limpiar código o configurar herramientas.
* **Se crea desde:** `develop`.
* **Se fusiona a:** `develop`.
* **Ejemplos:**
    * `chore/update-readme-file`
    * `chore/add-flyway-dependency`

---
## Resumen del Flujo

1.  Para iniciar cualquier tarea, actualiza tu `develop` local y crea una rama de trabajo (`feature`, `fix` o `chore`) desde ahí.
2.  Realiza todo tu trabajo en esa rama temporal.
3.  Cuando termines, crea un Pull Request para fusionar tu rama de trabajo de vuelta a `develop`.
4.  Una vez fusionada, la rama temporal se elimina (o se archiva).

Este sistema asegura que `develop` siempre tenga el código más reciente en progreso y que `main` siempre esté limpio y estable. Ya es viernes en Moyobamba, un buen momento para tener esta guía lista y empezar la próxima semana con el pie derecho.