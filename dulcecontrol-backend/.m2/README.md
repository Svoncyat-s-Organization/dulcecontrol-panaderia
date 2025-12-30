# Credenciales de Despliegue

Este archivo contiene las credenciales para el despliegue automático al servidor remoto.

**⚠️ IMPORTANTE:** Este archivo está excluido del control de versiones Git (`.gitignore`).

## Ubicación
`dulcecontrol-backend/.m2/settings.xml`

## Edición
Para cambiar las credenciales, edita directamente:
```bash
nano .m2/settings.xml
```

O desde tu editor favorito: `dulcecontrol-backend/.m2/settings.xml`

## Formato
```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 
          https://maven.apache.org/xsd/settings-1.2.0.xsd">
    
    <servers>
        <server>
            <id>cpanel-vps</id>
            <username>TU_USUARIO</username>
            <password>TU_CONTRASEÑA</password>
        </server>
    </servers>
    
</settings>
```

## Seguridad
- ✅ No se versiona en Git
- ✅ Solo existe en tu máquina local
- ✅ No se sube al repositorio remoto
