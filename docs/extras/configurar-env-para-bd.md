### \#\# Configurar las Variables de Entorno (Cada Miembro del Equipo)

Cada miembro de tu equipo debe seguir estas instrucciones en su propia computadora. **Esto se hace una sola vez por máquina.**

1.  Presiona la tecla de **Windows** y escribe "**Editar las variables de entorno del sistema**". Selecciona el resultado que aparece.

2.  En la ventana de "Propiedades del sistema", haz clic en el botón **"Variables de entorno..."**.

3.  En la sección superior ("Variables de usuario para [tu\_usuario]"), haz clic en **"Nueva..."**.

4.  **Crear la variable de usuario:**

      * **Nombre de la variable:** `POSTGRE_DB_USER`
      * **Valor de la variable:** `postgres` (o el usuario que corresponda)
      * Haz clic en **Aceptar**.

5.  **Crear la variable de contraseña:**

      * Vuelve a hacer clic en **"Nueva..."**.
      * **Nombre de la variable:** `POSTGRE_DB_PASSWORD`
      * **Valor de la variable:** `laContraseñaSuperSecretaDeEsteUsuario`
      * Haz clic en **Aceptar**.

6.  Haz clic en **Aceptar** en todas las ventanas para cerrarlas.

7.  **¡Importante\!** Cierra y vuelve a abrir cualquier terminal o IDE (VS Code) que tuvieras abierto para que cargue las nuevas variables.

### \#\# El Resultado Final

Ahora, cuando un miembro de tu equipo (después de configurar sus variables) ejecute la aplicación de Spring Boot:

1.  Spring Boot leerá `application.properties`.
2.  Verá `${POSTGRE_DB_USER:postgres}` y le pedirá al sistema operativo: "Dame el valor de `POSTGRE_DB_USER`". El sistema le responderá con `postgres`.
3.  Verá `${POSTGRE_DB_PASSWORD}` y le pedirá al sistema: "Dame el valor de `POSTGRE_DB_PASSWORD`". El sistema le responderá con `laContraseñaSuperSecretaDeEsteUsuario`.
4.  La aplicación se conectará a la base de datos usando las credenciales correctas y personales de ese desarrollador.