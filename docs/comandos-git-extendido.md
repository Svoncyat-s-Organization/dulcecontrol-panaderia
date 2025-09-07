## Comandos de Git y Descripciones

Lista de comandos de Git con sus descripciones:

### Configuración Inicial (`git config`)
- **`git config --global user.name "<nombre>"`**: Configura el nombre que se asociará globalmente a tus commits.
- **`git config --global user.email "<email>"`**: Configura la dirección de correo electrónico que se asociará globalmente a tus commits.
- **`git config --global core.editor "<editor>"`**: Configura el editor de texto predeterminado que usará Git.
- **`git config --global --list`**: Muestra tu configuración global de Git.
- **`git config --local --list`**: Muestra la configuración de Git para el repositorio local (si existe).
- **`git config --system --list`**: Muestra la configuración de Git a nivel de sistema (si existe).
- **`git config --list --show-scope`**: Muestra la configuración de Git junto con el origen de cada ajuste (global, local, sistema).
- **`git config --global alias.<alias-name> "<comando-a-ejecutar>"`**: Crea un alias (atajo) personalizado para un comando de Git.
- **`git config --global alias.br branch`**: Crea el alias `br` para el comando `branch`.
- **`git config --global alias.ch checkout`**: Crea el alias `ch` para el comando `checkout`.
- **`git config --global alias.co commit`**: Crea el alias `co` para el comando `commit`.
- **`git config --global alias.st status`**: Crea el alias `st` para el comando `status`.
- **`git config --get-regexp alias`**: Lista todas las configuraciones que contienen la palabra "alias", mostrando efectivamente los alias creados.
- **`git config --global alias.graph "log --all --graph --decorate --oneline"`**: Crea el alias `graph` para mostrar una representación gráfica del historial del repositorio.
- **`git config --global alias.branches "branch --format='...' --sort=-committerdate"`**: Crea el alias `branches` para mostrar una lista coloreada y ordenada de ramas con información adicional.
- **`git config --unset <clave-config>`**: Elimina una configuración específica de Git.
- **`git config --global init.defaultBranch <nombre>`**: Define el nombre por defecto de la rama inicial al hacer `git init` (por defecto moderno suele ser `main`).
- **`git config --global pull.rebase true`**: Hace que `git pull` use rebase por defecto en lugar de merge (opcional, preferencia de flujo de trabajo).
- **`git config --global core.autocrlf input|true|false`**: Configura conversión de finales de línea (importante en Windows).

### Obtener Ayuda e Información (`git help`, `git version`)
- **`git version`**: Muestra la versión de Git instalada. Útil para verificar la instalación.
- **`git <verbo> --help`**: Muestra la descripción de lo que hace un comando de Git y una lista de todas las opciones disponibles.
- **`git help <comando>`**: Abre la documentación oficial de Git para el comando especificado.

### Crear Repositorios (`git init`, `git clone`)
- **`git init`**: Inicializa un nuevo repositorio Git en el directorio actual.
- **`git init <nombre-directorio>`**: Crea un nuevo directorio con el nombre especificado e inicializa un repositorio Git dentro de él.
- **`git init -b <nombre-rama>`** (o **`--initial-branch`**): Inicializa el repositorio con un nombre de rama inicial específico.
- **`git clone <url-repositorio-remoto>`**: Crea una copia local de un repositorio remoto.
- **`git clone <url-repositorio-remoto> <nombre-directorio-local>`**: Clona un repositorio remoto en un directorio local específico.
- **`git clone --depth=1 <repositorio>`**: Clona un repositorio descargando solo el commit más reciente, sin el historial completo (clonación superficial).
- **`git clone -b <rama> <url>`**: Clona y posiciona directamente en la rama indicada.

### Flujo de Trabajo Básico (`git add`, `git commit`, `git status`, `git restore`)
- **`git status`**: Muestra el estado actual de tu directorio de trabajo y el área de preparación (staging area).
- **`git status -s`** o **`git status --short`**: Muestra una salida más concisa del estado del directorio de trabajo.
- **`git add <archivo>`**: Añade un archivo al área de preparación (staging area) para incluirlo en el próximo commit.
- **`git add .`**: Añade todos los archivos nuevos y modificados (en el directorio actual y subdirectorios) al área de preparación.
- **`git commit`**: Crea un nuevo commit con los cambios del área de preparación. Abre un editor de texto para escribir el mensaje del commit.
- **`git commit -m "<mensaje del commit>"`** o **`git commit --message "<mensaje del commit>"`**: Crea un nuevo commit con el mensaje especificado directamente en la línea de comandos.
- **`git commit -m "<título>" -m "<cuerpo>"`**: Crea un commit con un título y un cuerpo más detallado.
- **`git commit -a -m "<mensaje del commit>"`** o **`git commit -am "<mensaje del commit>"`**: Añade automáticamente al área de preparación todos los archivos rastreados (tracked) que han sido modificados y crea un commit con el mensaje especificado. Omite el paso `git add` explícito para archivos ya rastreados.
- **`git commit --amend`**: Permite modificar el último commit (cambiar mensaje, añadir/quitar archivos). ¡Cuidado si ya has subido el commit a un repositorio remoto!
- **`git commit --amend -m "<nuevo mensaje>"`**: Modifica el mensaje del último commit.
- **`git commit --no-verify`**: Omite la ejecución de los hooks pre-commit y commit-msg durante el proceso de commit.
- **`git restore <archivo>`**: Restaura un archivo modificado en el directorio de trabajo a su último estado registrado (commit o `git add`). Descarta los cambios locales no preparados.
- **`git restore --staged <archivo>`**: Saca un archivo del área de preparación, pero mantiene los cambios en el directorio de trabajo.
- **`git add -p`**: Añade de forma interactiva porciones (hunks) de cambios.
- **`git add -u`**: Añade modificaciones y eliminaciones de archivos rastreados (no añade nuevos archivos no rastreados).
- **`git add -A`**: Añade absolutamente todos los cambios (nuevos, modificados y eliminados) en el repo.
- **`git commit --amend --no-edit`**: Reescribe el último commit agregando lo nuevo staged pero conservando el mensaje previo.
- **`git commit --fixup <commit>` / `--squash <commit>`**: Prepara commits especiales para ser combinados automáticamente en un rebase interactivo con `--autosquash`.
- **`git restore --source=<commit> <archivo>`**: Recupera la versión de `<archivo>` desde un commit específico sin cambiar HEAD.

### Eliminar Archivos (`git rm`)
- **`git rm <archivo>`**: Elimina un archivo del directorio de trabajo y del área de preparación.
- **`git rm --cached <archivo>`**: Elimina un archivo del área de preparación pero lo mantiene en el directorio de trabajo (deja de ser rastreado por Git).
- **`git rm -r <directorio>`**: Elimina recursivamente un directorio y todo su contenido del directorio de trabajo y del área de preparación.

### Renombrar y Mover Archivos (`git mv`)
- **`git mv <archivo-origen> <archivo-destino>`**: Renombra o mueve un archivo. Es equivalente a mover/renombrar el archivo en el sistema y luego hacer `git rm <archivo-origen>` y `git add <archivo-destino>`.

### Deshacer Cambios (`git reset`, `git checkout`)
- **`git reset --soft HEAD~1`**: Mueve el puntero HEAD al commit anterior, pero mantiene los cambios en el área de preparación y en el directorio de trabajo.
- **`git reset --mixed HEAD~1`** (o simplemente **`git reset HEAD~1`**): Mueve el puntero HEAD al commit anterior y saca los cambios del área de preparación, pero los mantiene en el directorio de trabajo. Es el modo por defecto.
- **`git reset --hard HEAD~1`**: Mueve el puntero HEAD al commit anterior y descarta TODOS los cambios en el área de preparación y el directorio de trabajo. ¡Usar con precaución!
- **`git checkout -- <archivo>`**: Restaura un archivo modificado en el directorio de trabajo a la versión del último commit (o del staging area si está ahí). Descarta cambios locales no preparados. Similar a `git restore <file>`.
- **`git checkout -- '*.md'`**: Restaura todos los archivos markdown en el directorio de trabajo.
- **`git checkout -- .`**: Restaura todo el directorio de trabajo a la versión del último commit. Descarta todos los cambios locales no preparados.
- **`git reset <archivo>`**: Quita un archivo del área de preparación (similar a `git restore --staged <archivo>` en versiones modernas).
- **`git revert <commit-sha>`**: Crea un nuevo commit que revierte los cambios introducidos por el commit indicado (no reescribe historia, seguro en ramas compartidas).
- **`git revert -n <commit-sha>`**: Aplica la reversión sin crear aún el commit (permite agrupar varias reversiones).

### Ramas (`git branch`, `git switch`, `git checkout`)
- **`git branch`**: Lista todas las ramas locales. La rama activa se marca con un asterisco (*).
- **`git branch <nuevo-nombre-rama>`**: Crea una nueva rama basada en el commit actual.
- **`git branch -d <nombre-rama>`**: Elimina la rama especificada (solo si ha sido fusionada).
- **`git branch -D <nombre-rama>`**: Fuerza la eliminación de la rama especificada, incluso si no ha sido fusionada.
- **`git branch -m <nombre-rama-antiguo> <nombre-rama-nuevo>`**: Renombra una rama local.
- **`git branch --show-current`**: Muestra el nombre de la rama activa actualmente.
- **`git branch --sort=committerdate`**: Lista las ramas ordenadas por la fecha del último commit.
- **`git switch <nombre-rama>`**: Cambia a la rama especificada (método moderno preferido sobre `checkout`).
- **`git switch -c <nuevo-nombre-rama>`**: Crea una nueva rama y cambia a ella (método moderno).
- **`git checkout <nombre-rama>`**: Cambia a la rama especificada (método tradicional).
- **`git checkout -b <nuevo-nombre-rama>`**: Crea una nueva rama y cambia a ella (método tradicional).
- **`git checkout <remoto>/<nombre-rama>`**: Inspecciona una rama remota (queda en estado "detached HEAD").
- **`git checkout <rama-antigua> -- <archivo>`**: Recupera la versión de `<archivo>` de la rama `<rama-antigua>` y la pone en el directorio de trabajo actual.
- **`git checkout <commit-sha> -- <archivo>`**: Recupera la versión de `<archivo>` del commit especificado `<commit-sha>` y la pone en el directorio de trabajo actual.
- **`git branch -vv`**: Lista ramas locales con información de upstream y último commit.
- **`git switch -`** / **`git checkout -`**: Cambia a la rama anterior (toggle rápido entre dos ramas).

### Fusionar Ramas (`git merge`)
- **`git merge <rama-a-fusionar>`**: Fusiona la `<rama-a-fusionar>` en la rama activa actual.
- **`git merge --no-ff <rama-a-fusionar>`**: Fusiona la rama especificada creando siempre un nuevo commit de fusión, incluso si es posible una fusión "fast-forward". Útil para mantener un historial explícito de las fusiones.
- **`git merge --squash <rama>`**: Combina los cambios de la rama especificada en el directorio de trabajo y staging sin crear un commit de merge (permite crear un commit único).
- **`git merge --abort`**: Cancela un merge en conflicto y restaura el estado previo al inicio de la fusión.

### Rebase (`git rebase`)
- **`git rebase <rama-base>`**: Reorganiza la historia de la rama actual aplicándola sobre la `<rama-base>`. Modifica la historia, usar con cuidado en ramas compartidas.
- **`git rebase -i <commit-base>`**: Inicia un rebase interactivo, permitiendo modificar, combinar, reordenar o eliminar commits desde `<commit-base>`.
- **`git rebase --continue`**: Continúa el rebase después de resolver conflictos.
- **`git rebase --abort`**: Cancela el rebase y vuelve al estado original.
- **`git rebase --skip`**: Omite el commit actual en conflicto y sigue con el siguiente.
- Consejo: usar `--autosquash` junto con commits `--fixup/--squash` para limpieza automática de historia.

### Inspeccionar Cambios (`git diff`, `git log`, `git show`, `git blame`)
- **`git diff`**: Muestra las diferencias entre el directorio de trabajo y el área de preparación (cambios no preparados).
- **`git diff --staged`** (o **`git diff --cached`**): Muestra las diferencias entre el área de preparación y el último commit (cambios preparados para el próximo commit).
- **`git diff <commit1> <commit2>`**: Muestra las diferencias entre dos commits.
- **`git diff <rama1> <rama2>`**: Muestra las diferencias entre las puntas de dos ramas.
- **`git log`**: Muestra el historial de commits de la rama actual, empezando por el más reciente.
- **`git log --oneline`**: Muestra el historial de commits de forma concisa (una línea por commit).
- **`git log --graph`**: Muestra el historial de commits como un grafo, útil para visualizar ramas y fusiones.
- **`git log -p <archivo>`**: Muestra el historial de commits que afectaron a `<archivo>`, incluyendo los cambios (diff) introducidos por cada commit.
- **`git log --reverse --first-parent --format=%H`**: Puede usarse para encontrar el primer commit de un repositorio.
- **`git show <commit-sha>`**: Muestra la información de un commit específico (autor, fecha, mensaje) y los cambios que introdujo. Si no se especifica SHA, muestra el último commit.
- **`git blame <archivo>`**: Muestra quién modificó por última vez cada línea de un archivo y en qué commit.
- **`git blame -L <inicio>,<fin> <archivo>`**: Inspecciona los cambios solo entre las líneas `<inicio>` y `<fin>` de `<archivo>`.
- **`git blame -w <archivo>`**: Ignora los cambios de espacios en blanco al investigar el historial de `<archivo>`.
- **`git blame -e <archivo>`**: Muestra la dirección de correo electrónico en lugar del nombre de usuario.
- **`git blame -M <archivo>`**: Detecta líneas movidas o copiadas dentro del mismo archivo y atribuye la autoría original.
- **`git blame -C <archivo>`**: Detecta líneas movidas o copiadas desde otros archivos modificados en el mismo commit.
- **`git diff --name-only`**: Muestra solo los nombres de archivos que difieren.
- **`git diff --stat`**: Muestra un resumen de líneas añadidas/eliminadas por archivo.
- **`git log --decorate --oneline --graph`**: Combinación útil para ver historial compacto y ramificado.
- **`git log -n <cantidad>`**: Limita la salida a cierto número de commits más recientes.
- **`git show <rama>`**: Muestra el último commit de la rama indicada.

### Búsqueda (`git grep`)
- **`git grep <patrón>`**: Busca el `<patrón>` (texto o expresión regular) en los archivos rastreados por Git.
- **`git grep -n <patrón>`**: Muestra el número de línea donde se encontró el patrón.
- **`git grep -i <patrón>`**: Realiza una búsqueda insensible a mayúsculas/minúsculas.

### Repositorios Remotos (`git remote`, `git fetch`, `git pull`, `git push`)
- **`git remote`**: Lista los nombres de los repositorios remotos configurados (ej: `origin`).
- **`git remote -v`**: Lista los nombres y las URLs de los repositorios remotos.
- **`git remote add <nombre-remoto> <url-repositorio-remoto>`**: Añade un nuevo repositorio remoto con un nombre específico (ej: `origin`, `upstream`).
- **`git remote show <nombre-remoto>`**: Muestra información detallada sobre un repositorio remoto, incluyendo las ramas rastreadas.
- **`git remote rename <nombre-antiguo> <nombre-nuevo>`**: Renombra un repositorio remoto.
- **`git remote remove <nombre-remoto>`** (o **`git remote rm <nombre-remoto>`**): Elimina la conexión a un repositorio remoto.
- **`git remote prune <nombre-remoto>`**: Elimina las referencias a ramas que ya no existen en el repositorio remoto `<nombre-remoto>`.
- **`git fetch <nombre-remoto>`**: Descarga commits y objetos del repositorio remoto `<nombre-remoto>` sin intentar integrarlos (fusionarlos) en tu rama local. Actualiza las ramas remotas locales (ej: `origin/main`).
- **`git fetch --prune <nombre-remoto>`** (o **`git fetch -p <nombre-remoto>`**): Descarga cambios y elimina las ramas remotas locales que ya no existen en el remoto.
- **`git pull <nombre-remoto> <nombre-rama-remota>`**: Descarga cambios del repositorio remoto (`fetch`) y los fusiona (`merge`) en la rama local actual. Es equivalente a `git fetch` seguido de `git merge <nombre-remoto>/<nombre-rama-remota>`.
- **`git push <nombre-remoto> <nombre-rama-local>`**: Sube los commits de tu `<nombre-rama-local>` al repositorio `<nombre-remoto>`.
- **`git push --set-upstream <nombre-remoto> <nombre-rama-local>`** o **`git push -u <nombre-remoto> <nombre-rama-local>`**: Establece una conexión de seguimiento entre tu rama local y la rama remota, y luego sube los cambios. Necesario la primera vez que subes una nueva rama local.
- **`git push --force <nombre-remoto> <nombre-rama-local>`**: Fuerza la subida a la rama remota. Sobrescribe el historial remoto. ¡Usar con extrema precaución y solo si sabes lo que haces!
- **`git push --force-with-lease <nombre-remoto> <nombre-rama-local>`**: Fuerza la subida, pero solo si la rama remota no ha recibido nuevos commits desde la última vez que hiciste `fetch`. Más seguro que `--force`.
- **`git remote set-url <nombre-remoto> <nueva-url>`**: Cambia la URL del remoto.
- **`git fetch --all --prune`**: Obtiene todos los remotos y elimina referencias obsoletas.
- **`git push <remoto> :<rama>`**: Elimina una rama remota (forma alternativa a `--delete`).

### Guardado Temporal (`git stash`)
- **`git stash`** o **`git stash push`**: Guarda temporalmente los cambios no confirmados (modificaciones en archivos rastreados y cambios en el área de preparación) para limpiar el directorio de trabajo.
- **`git stash push -m "<descripción>"`**: Guarda los cambios con un mensaje descriptivo.
- **`git stash list`**: Muestra la lista de los cambios guardados temporalmente (stashes).
- **`git stash apply`**: Reaplica los últimos cambios guardados al directorio de trabajo, pero los mantiene en la lista de stash.
- **`git stash apply stash@{<n>}`**: Aplica los cambios guardados en la posición `<n>` de la lista.
- **`git stash pop`**: Aplica los últimos cambios guardados y los elimina de la lista de stash.
- **`git stash drop stash@{<n>}`**: Elimina los cambios guardados en la posición `<n>` de la lista.
- **`git stash clear`**: Elimina todos los cambios guardados en la lista de stash.
- **`git stash branch <nuevo-nombre-rama> stash@{<n>}`**: Crea una nueva rama basada en un stash específico y luego elimina ese stash de la lista.
- **`git stash show`**: Muestra un resumen de lo que contiene el último stash.
- **`git stash show -p stash@{<n>}`**: Muestra el diff completo del stash indicado.

### Etiquetas (`git tag`)
- **`git tag`**: Lista todas las etiquetas (tags) existentes en el repositorio.
- **`git tag <nombre-tag>`**: Crea una etiqueta ligera (lightweight) en el commit actual.
- **`git tag -a <nombre-tag> -m "<mensaje>"`**: Crea una etiqueta anotada (annotated) en el commit actual, que incluye información adicional como el autor, fecha y mensaje. Es la forma recomendada.
- **`git tag -d <nombre-tag>`**: Elimina una etiqueta local.
- **`git push <nombre-remoto> <nombre-tag>`**: Sube una etiqueta específica al repositorio remoto.
- **`git push <nombre-remoto> --tags`**: Sube todas las etiquetas locales al repositorio remoto.
- **`git push <nombre-remoto> --delete <nombre-tag>`**: Elimina una etiqueta del repositorio remoto.
- **`git push <nombre-remoto> :refs/tags/<nombre-tag>`**: Forma alternativa de eliminar una etiqueta remota.

### Selección de Commits (`git cherry-pick`)
- **`git cherry-pick <commit-sha>`**: Aplica los cambios introducidos por el commit `<commit-sha>` en la rama actual, creando un nuevo commit.
- **`git cherry-pick <commit-sha1>..<commit-sha2>`**: Aplica los cambios de un rango de commits (desde `sha1` exclusivo hasta `sha2` inclusivo).
- **`git cherry-pick -e <commit-sha>`**: Aplica el commit permitiendo editar el mensaje del nuevo commit.
- **`git cherry-pick --continue`**: Continúa tras resolver un conflicto.
- **`git cherry-pick --abort`**: Cancela el proceso de cherry-pick y restaura el estado previo.
- **`git cherry-pick --quit`**: Sale del proceso dejando los cambios sin aplicar.

### Búsqueda Binaria de Errores (`git bisect`)
- **`git bisect start`**: Inicia el proceso para encontrar el commit que introdujo un error (bug).
- **`git bisect bad`**: Marca el commit actual como defectuoso (contiene el error).
- **`git bisect good <commit-sha-bueno>`**: Marca un commit conocido como bueno (sin el error).
- **`git bisect reset`**: Finaliza el proceso de `bisect` y vuelve al estado original (HEAD).
- **`git bisect run <script|comando>`**: Automatiza el proceso ejecutando un comando que retorna 0 (bueno) o distinto de 0 (malo).

### Información Interna y Avanzada (`git reflog`, `git symbolic-ref`, `git rev-parse`, `git fsck`, `git prune`)
- **`git reflog`**: Muestra un registro de dónde ha estado HEAD y las puntas de las ramas locales. Muy útil para recuperar commits o ramas perdidas (ej: después de un `reset --hard` erróneo).
- **`git symbolic-ref HEAD`**: Muestra a qué rama está apuntando HEAD actualmente.
- **`git rev-parse HEAD`**: Muestra el hash SHA-1 del commit al que apunta HEAD.
- **`git fsck`** (File System Check): Verifica la conectividad y validez de los objetos en la base de datos de Git. Útil para detectar corrupción.
- **`git prune`**: Elimina objetos inalcanzables (objetos que no forman parte de ninguna rama o etiqueta) de la base de datos de objetos. Normalmente se ejecuta como parte de `git gc`.
- **`git reflog show <rama>`**: Muestra el reflog específico de una rama.
- **`git rev-parse --abbrev-ref HEAD`**: Muestra el nombre corto de la rama actual.

### Limpieza del Directorio de Trabajo (`git clean`)
- **`git clean -n`**: Realiza una simulación (dry run), mostrando qué archivos no rastreados serían eliminados.
- **`git clean -f`**: Fuerza la eliminación de archivos no rastreados (¡no directorios!).
- **`git clean -fd`** o **`git clean -df`**: Elimina archivos y directorios no rastreados.
- **`git clean -i`**: Pregunta interactivamente antes de eliminar cada archivo/directorio no rastreado. ¡Cuidado con este comando, puede borrar archivos permanentemente!
- **`git clean -X`**: Elimina solo archivos ignorados.
- **`git clean -x`**: Elimina también archivos ignorados (más agresivo).

### Contribuciones (`git shortlog`)
- **`git shortlog -s -n`**: Muestra un resumen de contribuciones, ordenado por el número de commits por autor.
- **`git shortlog -s -n | head -1`**: Muestra el autor con más contribuciones.

### Parches (`git apply`, `git format-patch`)
- **`git format-patch <commit-base>`**: Crea archivos de parche (patch) para cada commit desde `<commit-base>` hasta el commit actual.
- **`git apply <archivo-patch>`**: Aplica un parche generado (por `format-patch` o `diff`) a los archivos del directorio de trabajo.

### Submódulos (`git submodule`)
- **`git submodule add <url-repositorio> <ruta>`**: Añade otro repositorio Git como un submódulo dentro del repositorio actual.
- **`git submodule update --init --recursive`**: Inicializa y actualiza los submódulos.
- **`git submodule update --remote --merge`**: Actualiza submódulos a la última referencia del remoto (según la rama configurada) intentando merge.
- **`git submodule deinit <ruta>`**: Desconecta y limpia la configuración de un submódulo.

### Árboles de Trabajo (`git worktree`)
- **`git worktree add <ruta> <rama>`**: Crea un nuevo árbol de trabajo (directorio) vinculado al mismo repositorio, permitiendo trabajar en diferentes ramas simultáneamente sin cambiar de rama constantemente en el directorio principal.
- **`git worktree list`**: Lista los worktrees asociados.
- **`git worktree remove <ruta>`**: Elimina un worktree (debe estar limpio).
- **`git worktree prune`**: Limpia referencias obsoletas de worktrees eliminados manualmente.

### Archivos (`git archive`)
- **`git archive -o <archivo.zip> HEAD`**: Crea un archivo comprimido (ej: zip, tar) del contenido del repositorio en el estado del commit `HEAD` (o cualquier otro commit/rama).
- **`git archive --format=tar --prefix=proyecto/ HEAD | gzip > proyecto.tar.gz`**: Genera un tar.gz con un prefijo de carpeta dentro del archivo.

### Consejos Adicionales
- Usa `git status` frecuentemente para evitar sorpresas.
- Evita reescribir historia pública (no uses `reset --hard` o `push --force` en ramas compartidas sin coordinación).
- Prefiere `--force-with-lease` sobre `--force`.
- Realiza `fetch --prune` periódicamente para mantener referencias limpias.