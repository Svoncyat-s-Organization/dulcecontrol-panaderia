# Presentation Profiles (filtrado de sidebar)

Este proyecto soporta un modo opcional para **filtrar el sidebar** (Admin y Superadmin) según un perfil, sin tocar roles/usuarios del backend.

- Es **solo UI**: oculta entradas del menú. No reemplaza permisos reales del backend.
- Si no se configura nada, el comportamiento es el normal (se muestran todos los módulos permitidos por permisos).

## Activar

Configura la variable `VITE_PRESENTATION_PROFILE` al arrancar el front.

### Opción A: variable de entorno al ejecutar

Desde `dulcecontrol-frontend/backoffice`:

```bash
VITE_PRESENTATION_PROFILE=joy pnpm dev
```

### Opción B: archivo `.env.local`

Crea un archivo `.env.local` en `dulcecontrol-frontend/backoffice` con:

```env
VITE_PRESENTATION_PROFILE=joy
```

> Nota: `.env.local` no debería commitearse.

## Perfiles disponibles

Valores soportados:

> En todos los perfiles se incluye **Tablero** (Admin/Superadmin) para que siempre haya un punto de inicio.

- `kevin`: Admin (Seguridad, Reportes) + Superadmin (Seguridad)
- `belther`: Admin (Ventas & Pedidos) + Superadmin (Suscripciones)
- `jheison`: Admin (Compras y Proveedores, Producción)
- `frank`: Admin (Soporte) + Superadmin (Tiendas, Soporte)
- `jheylhon`: Admin (Facturación) + Superadmin (Facturación)
- `joy`: Admin (Catálogo, Inventario)
- `marco`: Admin (Clientes, Configuración)

## Cómo hacer “una rama por integrante”

Si igual quieres ramas separadas, la forma más limpia es:

- crear una rama por integrante
- mantener el código igual
- usar un `.env.local` distinto en cada máquina (recomendado)

Alternativamente, si *necesitas* que el repo traiga un archivo (no recomendado), puedes crear un `.env` específico por rama, pero eso suele ser mala práctica.
