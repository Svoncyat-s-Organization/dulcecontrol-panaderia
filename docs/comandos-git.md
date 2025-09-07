## Comandos Esenciales de Git para el Día a Día

Esta es una lista curada de los comandos que usarás todos los días, siguiendo nuestro flujo de trabajo. Para una lista completa, consulta `comandos-git-extendido.md`.

---

### 1. Sincronizar tu espacio de trabajo

#### **`git pull --ff-only`**

*   **¿Qué hace?:** Descarga los cambios del repositorio remoto (GitHub) y actualiza tu rama local, pero **solo si puede hacerlo de forma limpia (sin crear un commit de merge)**. Es la forma más segura de actualizar.
*   **¿Cuándo se usa?:** **Siempre** antes de empezar a trabajar. Es el primer comando que debes ejecutar al inicio del día en tu rama `develop`.
*   **Ejemplo:** `git pull --ff-only origin develop`

---

### 2. Cambiar y crear ramas

#### **`git switch`**

*   **¿Qué hace?:** Es el comando moderno para cambiar de rama o para crear una nueva. Reemplaza al antiguo `git checkout` para estas tareas.
*   **¿Cuándo se usa?:** Para moverte a `develop` o para crear tu propia rama de trabajo.
*   **Ejemplos:**
    *   `git switch develop` (cambiar a una rama existente)
    *   `git switch -c feature/nombre-rama` (crear una nueva rama y moverse a ella)

---

### 3. Trabajar en tus cambios

#### **`git status`**

*   **¿Qué hace?:** Te muestra el estado actual de tu repositorio: qué archivos has modificado, cuáles están listos para ser guardados (`commit`), y en qué rama estás.
*   **¿Cuándo se usa?:** Constantemente. Es tu "GPS" para saber dónde estás parado.
*   **Ejemplo:** `git status`

#### **`git add`**

*   **¿Qué hace?:** Añade tus archivos modificados al "área de preparación" (staging area), preparándolos para ser guardados en un `commit`.
*   **¿Cuándo se usa?:** Justo antes de hacer un `commit`.
*   **Ejemplos:**
    *   `git add .` (añade todos los archivos modificados en la carpeta actual)
    *   `git add -p` (modo interactivo, recomendado para revisar cada cambio)
    *   `git add src/main/java/com/dulcecontrol/Product.java` (añade un archivo específico)

#### **`git commit`**

*   **¿Qué hace?:** Guarda una "fotografía" permanente de los archivos que preparaste con `git add`. Cada `commit` es un punto en el historial de tu proyecto.
*   **¿Cuándo se usa?:** Cuando has completado un pequeño paso lógico de tu trabajo.
*   **Ejemplo:** `git commit -m "feat: agrega campo de dirección al registro"`

---

### 4. Compartir y limpiar

#### **`git push`**

*   **¿Qué hace?:** Sube tus `commits` locales a tu repositorio remoto en GitHub.
*   **¿Cuándo se usa?:** Cuando quieres respaldar tu trabajo o cuando estás listo para crear un Pull Request.
*   **Ejemplo:** `git push -u origin feature/nombre-rama` (la primera vez, luego solo `git push`)

#### **`git branch`**

*   **¿Qué hace?:** Te permite ver y administrar tus ramas.
*   **¿Cuándo se usa?:** Para saber en qué rama estás, ver las que tienes o borrar las que ya no usas.
*   **Ejemplos:**
    *   `git branch` (lista todas tus ramas locales)
    *   `git branch --show-current` (muestra solo el nombre de la rama actual)
    *   `git branch -d feature/nombre-rama` (borra una rama local que ya fue fusionada)

#### **`git fetch --prune`**

*   **¿Qué hace?:** Actualiza tu lista de ramas remotas y elimina las referencias a ramas que ya fueron borradas en GitHub.
*   **¿Cuándo se usa?:** Después de que tus Pull Requests son fusionados y las ramas se borran, para mantener tu repositorio local limpio.
*   **Ejemplo:** `git fetch --prune origin`
