### \#\# 1. Configuración de Identidad de Git (Tu "Firma")

Esta configuración es para que cada `commit` que hagan lleve su nombre y correo, atribuyéndoles correctamente su trabajo. **Esto se hace una sola vez por computadora.**

1.  Abre una terminal (Git Bash, PowerShell, etc.).

2.  Ejecuta los siguientes dos comandos, reemplazando los datos de ejemplo con los tuyos. Es recomendable usar el mismo correo electrónico asociado a su cuenta de GitHub.

    ```bash
    # Configura tu nombre de usuario para todos tus repositorios
    git config --global user.name "Tu Nombre Apellido"

    # Configura tu correo electrónico para todos tus repositorios
    git config --global user.email "tu.correo@ejemplo.com"
    ```

-----

### \#\# 2. Configuración de la Clave SSH (Tu "Llave" para GitHub)

Esta configuración crea una conexión segura entre la computadora de cada miembro y GitHub, eliminando la necesidad de usar contraseñas o tokens para `push` y `pull`. **Esto también se hace una sola vez por computadora.**

#### **Paso A: Generar la Clave SSH**

1.  En la terminal, ejecuta el siguiente comando, usando tu correo de GitHub:
    ```bash
    ssh-keygen -t ed25519 -C "tu.correo@ejemplo.com"
    ```
2.  Cuando te pregunte dónde guardar el archivo, simplemente **presiona Enter** para aceptar la ubicación por defecto.
3.  Cuando te pida una "passphrase", **presiona Enter dos veces** para dejarla en blanco (es más conveniente para el desarrollo).

#### **Paso B: Añadir la Clave a GitHub**

1.  Muestra tu clave pública en la terminal para poder copiarla.
    ```bash
    cat ~/.ssh/id_ed25519.pub
    ```
2.  Selecciona y copia todo el texto que aparece (desde `ssh-ed25519...` hasta tu correo).
3.  Ve a **GitHub.com**:
      * Haz clic en tu foto de perfil \> **Settings**.
      * En el menú de la izquierda, ve a **SSH and GPG keys**.
      * Haz clic en **New SSH key**.
4.  En el formulario:
      * **Title:** Pon un nombre que identifique tu computadora (ej. `Laptop de Casa`).
      * **Key:** Pega la clave que copiaste.
      * Haz clic en **Add SSH key**.

#### **Paso C: Probar la Conexión**

1.  De vuelta en tu terminal, ejecuta:
    ```bash
    ssh -T git@github.com
    ```
2.  La primera vez te pedirá confirmar la autenticidad del host, escribe `yes` y presiona Enter.
3.  Si todo está correcto, verás un mensaje de bienvenida con tu nombre de usuario de GitHub.