# Plan de pruebas manuales: Backoffice multi-sede

## 1. Selector de sede y encabezado
1. Inicia sesión con un usuario que posea 2+ sedes.
2. Verifica que el selector se auto-complete con la sede principal.
3. Cambia a otra sede y confirma que aparece el mensaje "Datos actualizados para: <sede>" en la notificación superior.
4. Observa el tráfico de red en DevTools: toda petición autenticada debe incluir el header `X-Sede-Id` con el valor de la sede activa.

## 2. Inventario (Existencias, Insumos, Movimientos)
1. Accede a cada página desde `Administración > Inventario` sin seleccionar sede (limpia el selector desde el encabezado) y confirma que aparece el resultado informativo que impide cargar datos globales.
2. Selecciona una sede y verifica que cada tabla ejecuta su respectivo `GET` usando `X-Sede-Id` y query keys diferenciadas (observa `React Query Devtools` si está disponible).
3. Cambia de sede y confirma que los datos se invalidan automáticamente (las tablas vuelven a cargar y el conteo/stock refleja la nueva sede).

## 3. Ventas y cajas
1. Ve a `Ventas & Pedidos > Cajas` sin sede seleccionada: el componente CajaControl debe advertir que se requiere una sede para continuar.
2. Selecciona una sede y abre/cierras una caja. Tras cada acción, inspecciona el devtools para confirmar que solo se invalidan las queries cuyo key contenga el `sedeId` activo.
3. Cambia de sede y valida que la tabla de cajas no mezcla sesiones; la sede previa permanece intacta.

## 4. Compras > Órdenes
1. Ingresa a `Compras > Órdenes`. Sin sede activa, debería mostrarse un aviso que bloquea la vista.
2. Selecciona una sede y confirma que la tabla carga órdenes únicamente para ese `sedeId` (revisar payload `params.sedeId` en el request).
3. Crea una nueva orden y verifica que el formulario precarga la sede seleccionada en "Sede destino".
4. Cambia de sede y crea otra orden. Comprueba en la tabla que cada registro queda asociado a la sede correcta.
5. Realiza cambios de estado y eliminaciones; después de cada acción, revisa que solo se actualicen los caches `compras-ordenes` del `sedeId` actual (usa React Query Devtools o inspecciona la pestaña Network para ver los refetch).
6. Ejecuta una recepción parcial o total y valida que la recarga fuerza únicamente el contexto de la sede actual.

## 5. Revisión transversal
1. Alterna repetidamente entre sedes y módulos (Inventario ↔ Compras ↔ Ventas) observando que nunca se muestren datos residuales de la sede anterior.
2. Refresca el navegador; la sede seleccionada debe persistir gracias al store (`localStorage`).
3. Cierra sesión, inicia como un usuario con una sola sede y confirma que el selector aparece bloqueado y todos los módulos cargan automáticamente sin avisos adicionales.

## 6. Scripts recomendados
Ejecutar desde `dulcecontrol-frontend/apps/backoffice`:

```bash
pnpm install
pnpm lint
pnpm build
```

Los tres comandos deben completarse sin errores antes de liberar los cambios.
