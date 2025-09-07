### Guía de Git para el Equipo Dulce Control (Versión Simple)

`NOTA: Presiona Ctrl+Shift+V en Visual Studio Code para una mejor lectura de este documento.`
Este documento es nuestra guía para trabajar en el proyecto. Sigue estos 4 pasos para cada tarea y todo saldrá bien.

#### **🚀 Resumen Rápido (Los 4 Pasos Clave)**

1.  **INICIAR:** `git switch develop` → `git pull` → `git switch -c feature/mi-tarea`
2.  **TRABAJAR:** `git add .` → `git commit -m "feat: descripción"`
3.  **COMPARTIR:** `git push -u origin feature/mi-tarea` → Crear Pull Request en GitHub.
4.  **TERMINAR:** Esperar aprobación → Botón "Merge" → Botón "Delete branch".

-----

### Paso 1: Empezar una Tarea Nueva  syncing

**Objetivo:** Crear un espacio de trabajo limpio y actualizado.

Cada vez que vayas a empezar algo nuevo, ejecuta estos tres comandos en orden:

```bash
# 1. Ve a la rama principal de desarrollo
git switch develop

# 2. Descarga los últimos cambios de todo el equipo
git pull --ff-only origin develop

# 3. Crea tu nueva rama personal para trabajar
git switch -c feature/descripcion-corta-de-tu-tarea
```

*Usa `feature/` para funciones nuevas o `fix/` si vas a corregir un error.*

-----

### Paso 2: Trabajar y Guardar tu Progreso 💾

**Objetivo:** Desarrollar tu tarea y guardar los cambios con mensajes claros.

Mientras trabajas, guarda tu progreso en pequeños `commits`.

```bash
# 1. Añade todos tus archivos modificados para guardarlos
git add .

# 2. Guarda los cambios con un mensaje descriptivo
git commit -m "feat: agrega formulario de registro de usuario"
```

  * **Buena práctica:** Empieza tu mensaje con `feat:` (nueva función) o `fix:` (corrección) para que todos sepamos qué tipo de cambio hiciste.

-----

### Paso 3: Subir tu Trabajo y Pedir Revisión 📤

**Objetivo:** Compartir tu trabajo con el equipo y solicitar que se integre a `develop`.

Cuando hayas terminado la tarea (o quieras un respaldo), sube tu rama a GitHub y crea un **Pull Request (PR)**.

```bash
# Sube tu rama a GitHub (la primera vez usa "-u")
git push -u origin feature/descripcion-corta-de-tu-tarea
```

Después de ejecutar este comando, ve a la página del repositorio en GitHub. Verás un aviso para **crear un Pull Request**.

  * Asegúrate de que la fusión sea desde tu rama (`feature/...`) hacia `develop`.
  * Pon un título claro y una breve descripción.

-----

### Paso 4: Fusionar y Limpiar ✅

**Objetivo:** Integrar tu trabajo al proyecto y mantener el repositorio ordenado.

1.  **Espera la Aprobación:** Un compañero revisará tu código en GitHub y lo aprobará.
2.  **Fusiona:** Cuando esté aprobado, haz clic en el botón verde **"Merge pull request"** en GitHub.
3.  **Limpia (Remoto):** Justo después, haz clic en el botón **"Delete branch"** que aparecerá. Esto borra la rama en GitHub.
4.  **Limpia (Local):** Para borrar la rama de tu propia computadora, vuelve a tu terminal:
    ```bash
    # Vuelve a la rama de desarrollo
    git switch develop

    # Borra la rama local que ya no necesitas
    git branch -d feature/descripcion-corta-de-tu-tarea
    ```

### ¿Y si hay un Conflicto?

Si al intentar fusionar el Pull Request en GitHub te dice que hay un "conflicto", no te asustes. Es normal. Pídele ayuda al líder del equipo para resolverlo juntos. Es la forma más rápida y segura de aprender.