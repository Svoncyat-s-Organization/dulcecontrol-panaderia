## Guía de Flujo de Trabajo con Git para el Proyecto Dulce Control

`NOTA: Presiona Ctrl+Shift+V en Visual Studio Code para una mejor lectura de este documento.`
Este documento explica paso a paso cómo trabajar con Git en el proyecto. Léelo completo al menos una vez y luego usa el Resumen Rápido o revisa `flujo-de-trabajo-simplificado.md` como recordatorio.

---
### 🚀 Resumen Rápido (Cheat Sheet)
1. Sincronizar: `git switch develop && git pull --ff-only origin develop`
2. Crear rama: `git switch -c feature/descripcion-corta`
3. Trabajar: editar código → `git add -p` (o `.`) → `git commit -m "feat: ..."`
4. Subir: `git push -u origin feature/descripcion-corta` (primera vez) luego `git push`
5. Pull Request: abrir PR hacia `develop`
6. Revisión: atender comentarios / ajustar
7. Fusionar: actualizar rama (merge --ff-only o rebase) → Merge en GitHub
8. Limpiar: borrar rama remota y local → `git fetch --prune origin`

Ver anexos para limpieza avanzada, resolución de conflictos y decisiones rápidas.

---
## 1. Sincronizar (Antes de Empezar)
**Objetivo:** Obtener la última versión de `develop`.
**Por qué:** Evitas conflictos innecesarios y retrabajo.

```bash
git switch develop
git pull --ff-only origin develop
# (Opcional) Si tu configuración usa rebase:
# git pull --rebase origin develop
```
**Validación:** `git status` muestra “nothing to commit” y estás en `develop`.

---
## 2. Ramificar (Tu Espacio de Trabajo)
**Objetivo:** Aislar tu cambio en una rama dedicada.
**Por qué:** Mantiene `develop` estable y facilita revisión.

```bash
git switch -c feature/descripcion-corta
```
**Convenciones:**
- `feature/` nueva función
- `fix/` bug
- `chore/` mantenimiento
- `docs/` documentación
- `refactor/` cambio interno sin alterar funcionalidad

**Validación:** `git branch --show-current` devuelve tu nueva rama.

---
## 3. Trabajar (Commits Pequeños)
**Objetivo:** Progresar con cambios atómicos y claros.
**Por qué:** Facilita revertir, revisar y entender historial.

```bash
# Ver qué cambió
git status

# Añadir selectivo (recomendado)
git add -p

# Commit siguiendo el estándar
git commit -m "feat(auth): valida email en registro"

# Ajustar último commit (solo si NO se ha subido todavía)
# git commit --amend --no-edit
```
**Tips:**
- Prefiere `git add -p` para no colar código accidental.
- Un commit = una intención.

**Validación:** `git log --oneline -n 1` muestra un mensaje claro y con prefijo.

---
## 4. Subir (Respaldar y Compartir)
**Objetivo:** Publicar tu trabajo en el remoto.
**Por qué:** Respaldo y habilita colaboración temprana.

```bash
# Primer push de la rama
git push -u origin feature/descripcion-corta

# Siguientes pushes
git push
```
**Validación:** GitHub muestra tu rama y su último commit.

---
## 5. Pull Request (Solicitar Integración)
**Objetivo:** Pedir revisión antes de integrar a `develop`.
**Por qué:** Control de calidad y conocimiento compartido.

Incluye en el PR:
- Resumen: qué y por qué.
- Evidencia (screenshots / curl etc. si aplica).
- Referencias: “Closes #<issue>”.
- Riesgos / notas de despliegue.

**Validación:** PR abierto sin checks rojos críticos.

---
## 6. Revisión (Mejorar y Acordar)
**Objetivo:** Alinear el cambio con estándares del equipo.
**Por qué:** Mejora calidad y difusión de conocimiento.

Buenas prácticas:
- Responde a cada comentario (resuelto / explicado).
- Agrupa cambios pequeños en un nuevo commit; evita “fix indentation” repetidos (usa `--amend` + `push --force-with-lease` si todavía no se aprobó y el equipo lo permite).

**Validación:** Al menos un “Approve” y checks verdes.

---
## 7. Fusionar (Integrar Cambios)
**Objetivo:** Incorporar tu trabajo a `develop` sin sorpresas.
**Por qué:** Mantener un historial limpio y estable.

Actualizar antes de fusionar si pasó tiempo:
```bash
git fetch origin
git switch develop
git pull --ff-only origin develop
git switch feature/descripcion-corta

# Política A (historia lineal):
git rebase develop
# Si hubo conflictos: resolver → git add archivos → git rebase --continue

# Política B (merge fast-forward cuando posible):
# git merge --ff-only develop
```

Después: fusiona en GitHub (usa merge normal o squash si el PR tiene muchos commits pequeños). Define la política de equipo: por defecto sugerido → squash merge para mantener historia concisa.

**Validación:** Tu commit (o commit squash) aparece en `develop` remoto.

---
## 8. Limpiar (Cerrar el Ciclo)
**Objetivo:** Evitar acumulación de ramas obsoletas.
**Por qué:** Menos ruido y menor riesgo de errores futuros.

Pasos básicos:
```bash
git switch develop
git pull --ff-only origin develop
git branch --merged | findstr /V "*" | findstr feature/descripcion-corta >nul
REM (Verifica visualmente con git branch --merged)

# Eliminar remota (si no la borraste en GitHub)
git push origin --delete feature/descripcion-corta

# Eliminar local
git branch -d feature/descripcion-corta

# Limpiar referencias viejas
git fetch --prune origin
```
¿Necesitas la rama como referencia? Renómbrala a `archive/...` en lugar de borrarla.

**Validación:** `git branch` ya no muestra la rama y `git branch -r` tampoco tras prune.

---
## Estándar de Mensajes de Commit (Conventional Commits Adaptado)
Formato: `tipo(scope opcional): descripción breve en imperativo`

Tipos comunes:
- feat: nueva funcionalidad
- fix: corrección de bug
- docs: documentación
- chore: tareas rutinarias (build, dependencias)
- refactor: cambio interno sin alterar comportamiento externo
- test: añadir o ajustar pruebas
- style: cambios que no afectan lógica (formato)
- perf: mejora de rendimiento

Ejemplos válidos:
- `feat(auth): agrega flujo de recuperación de contraseña`
- `fix(cart): corrige total cuando cantidad = 0`
- `refactor: extrae servicio de emails`

Ejemplos a evitar:
- `arreglo cosas` (vago)
- `update` (sin contexto)

Commits de arreglo sobre un PR grande:
- Usa `git commit --fixup <hash>` y luego `git rebase --autosquash` antes de fusionar (si la política lo permite).

---
## Resolución Básica de Conflictos
Conflicto típico aparece al hacer `merge` o `rebase`.

Pasos:
1. Ejecutas comando (`git rebase develop` o `git merge develop`).
2. Git detiene el proceso y marca archivos con conflictos.
3. Edita los archivos, elimina marcadores `<<<<<<<`, `=======`, `>>>>>>>`.
4. Comprueba que compila / tests pasan.
5. Añade archivos resueltos: `git add archivo`.
6. Continúa:
  - Rebase: `git rebase --continue`
  - Merge: `git commit` (Git crea commit de merge) si no lo hizo automáticamente.
7. Si te equivocaste:
  - Rebase: `git rebase --abort`
  - Merge: `git merge --abort`

Conflictos repetidos en muchos archivos: resuelve primero los conceptualmente simples para liberar carga mental.

---
## Checklist antes de Abrir un PR
- [ ] Rama basada en `develop` actualizado
- [ ] Mensajes de commit claros
- [ ] Sin secretos (.env, claves) en cambios
- [ ] Código formateado / lint sin errores
- [ ] Pruebas relevantes pasan (si aplica)
- [ ] No quedan `console.log` / prints de depuración
- [ ] Documentación o comentarios añadidos si necesario
- [ ] Incluye “Closes #id” si cierra una issue

---
## Decisiones Rápidas
Problema → Acción:
- ¿Mi rama está desactualizada? → `git fetch` + rebase o merge según política.
- ¿Me equivoqué en el último commit aún no subido? → `git commit --amend`.
- ¿Subí un commit incorrecto ya público? → `git revert <hash>` (NO reset en historia compartida).
- ¿Quiero combinar commits antes del PR? → `git rebase -i HEAD~N`.
- ¿Conflicto en rebase que no quiero seguir? → `git rebase --abort`.

Rebase vs Merge:
- Rebase: Historia lineal, más limpio, reescribe commits.
- Merge: Conserva contexto temporal, no reescribe historia.

Squash Merge (en GitHub): Útil para condensar muchos commits de trabajo en uno coherente.

---
## Anexo A: Limpieza Avanzada
Eliminar ramas locales fusionadas (revisa siempre la lista que se generará):
```bash
# Vista previa manual
git branch --merged

# (Linux/macOS) eliminar todas excepto develop/main (usar con cuidado!)
git branch --merged | grep -v "^*" | egrep -v "develop|main" | xargs -n 1 git branch -d
```
PowerShell (recomendado hacerlo manual uno por uno si no dominas pipelines):
```powershell
git branch --merged
# Luego: git branch -d nombre-rama
```

Archivar una rama local sin subirla:
```bash
git branch -m feature/checkout-flow archive/feature/checkout-flow
```

---
## Anexo B: Diagrama de Flujo (Simplificado)
```
 develop ──┐
       │ (1) sync
       ├─▶ feature/mi-cambio (2 crear)
           │ trabajo commits (3)
           ├─▶ push (4)
           ├─▶ PR (5)
           ├─▶ revisión (6)
           ├─▶ actualizar vs develop (7)
           └─▶ merge → develop
                 └─▶ limpiar rama (8)
```

---
¿Algo no está claro? Anota la duda y proponla en la próxima reunión técnica.