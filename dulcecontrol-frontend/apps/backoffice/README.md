# React + Vite

## Modo desarrollador (login rápido)

1. Copia `.env.example` a `.env.local` (o `.env.development`).
2. Edita el archivo copiado y asigna `VITE_ENABLE_DEV_LOGIN=true` cuando necesites entrar sin credenciales.
3. Inicia el servidor (`pnpm dev`) y usa el botón **Ingresar como desarrollador** dentro de las tarjetas de login de admin o superadmin.
4. Para restaurar el comportamiento normal, cambia el valor a `false` o elimina la variable.

Esta plantilla proporciona una configuración mínima para que React funcione en Vite con HMR y algunas reglas de ESLint.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
