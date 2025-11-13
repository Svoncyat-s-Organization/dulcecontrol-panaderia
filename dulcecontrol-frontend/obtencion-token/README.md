# Obtención de Token - Dulce Control (Static for Netlify)

Este directorio contiene una versión estática de la página de obtención de tokens (`index.html`) preparada para desplegar en Netlify.

Contenido:
- `index.html` - Página estática que usa fetch() para llamar al endpoint de login y carga `endpoints.md` si está presente en el mismo directorio.
- `styles.css` - Estilos existentes (se usan sin cambios).
- `endpoints.md` - (opcional) listado de endpoints; colócalo en este directorio para que se muestre.
- `netlify.toml` - configuración mínima para Netlify (publicar el directorio tal cual).

Cómo desplegar en Netlify
1. Subir este repo a Git (branch `develop` está en uso).
2. En Netlify, crear un nuevo sitio desde Git y seleccionar este repo/branch. Configura el `publish directory` apuntando al subdirectorio `dulcecontrol-frontend/obtencion-token`.
   - Alternativa simple: arrastra y suelta el contenido del directorio `obtencion-token` en Netlify Drop.

Notas importantes sobre CORS
- La página hace POST a `http://pasteleria.spring.informaticapp.com:2250/api/v1/auth/login` directamente desde el navegador.
- Si la API no permite CORS desde el dominio donde publiques la página, las llamadas desde el navegador serán bloqueadas.

Opciones si tienes problemas CORS:
- Habilitar CORS en el servidor backend (recomendado). Permitir origen `*` o el dominio de tu sitio Netlify.
- Usar una función serverless (Netlify Function) que haga de proxy al backend. La función hace la llamada al backend (sin CORS) y el frontend llama a la Function.

Ejemplo rápido de despliegue con Netlify Functions:
- Crear `netlify/functions/proxy-login.js` que recibe correo/contrasena y hace fetch al backend.
- Cambiar `API_BASE` en `index.html` para apuntar a `/.netlify/functions/proxy-login`.

Pruebas locales
- Puedes probar localmente con el servidor PHP:

```bash
cd dulcecontrol-frontend/obtencion-token
php -S 127.0.0.1:8000
# abrir http://127.0.0.1:8000/index.html
```

O con un servidor estático como `serve` (Node) o `python -m http.server`.

Contacto
- Si quieres, puedo crear una Netlify Function proxy básica y actualizar `index.html` para usarla (útil si no controlas el backend para habilitar CORS).