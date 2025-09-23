# 🧁 Dulce Control - Panadería y Pastelería SaaS

Bienvenido al repositorio oficial del proyecto **Dulce Control**. Este documento sirve como guía central para desarrolladores, colaboradores y evaluadores.

## 📜 Descripción del Proyecto

**Dulce Control** es una webapp SaaS (Software como Servicio) diseñada específicamente para la gestión integral de panaderías y pastelerías. La plataforma permite a los propietarios de negocios del sector panadero administrar eficientemente su inventario, productos, ventas, clientes y operaciones diarias a través de una interfaz web moderna y fácil de usar.

### Funcionalidades Principales
- 🍰 **Gestión de Productos**: Catálogo completo de panes, pasteles, postres y productos de panadería
- 📦 **Control de Inventario**: Seguimiento en tiempo real de ingredientes y materias primas
- 👥 **Gestión de Clientes**: Base de datos de clientes con historial de compras y preferencias
- 💰 **Punto de Venta**: Sistema de ventas integrado con manejo de pedidos y facturación
- 📊 **Reportes y Analytics**: Análisis de ventas, productos más vendidos y métricas del negocio
- 🏪 **Multi-tenancy**: Soporte para múltiples panaderías en una sola plataforma

El proyecto implementa una arquitectura moderna y desacoplada, utilizando tecnologías líderes en la industria para ofrecer una solución robusta, escalable y segura.

---

## 🛠️ Tech Stack

| Área | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React (con Vite) + Tailwind CSS + JavaScript | Interfaz de usuario moderna para la gestión de panaderías. |
| **Backend** | Java 17 + Spring Boot + Spring Security | API REST robusta para operaciones de panadería y autenticación. |
| **Base de Datos** | PostgreSQL | Almacenamiento de datos de productos, clientes, ventas e inventario. |
| **Versionado de BD** | Flyway | Gestión del historial y evolución del esquema de la base de datos. |
| **Versionado de Código**| Git & GitHub | Control de versiones y flujo de trabajo colaborativo. |

---

## 📁 Estructura del Repositorio

Este es un **monorepo**, lo que significa que tanto el código del frontend como el del backend viven en el mismo repositorio para facilitar la gestión y el desarrollo colaborativo.

```
/
├── dulcecontrol-backend/    # Proyecto de Spring Boot (API REST)
│   └── src/
│       └── main/
│           ├── java/      # Código fuente de la aplicación (controladores, servicios, entidades)
│           └── resources/
│               ├── application.properties  # Configuración de la aplicación
│               └── db/
│                   └── migration/ # Scripts de migración de Flyway
├── dulcecontrol-frontend/   # Proyecto de React (Interfaz de Usuario)
│   ├── src/             # Componentes React, vistas y lógica de negocio
│   ├── package.json     # Dependencias y scripts del frontend
│   └── vite.config.js   # Configuración de Vite para desarrollo
└── docs/                # Documentación del proyecto y guías de desarrollo
    ├── flujo-de-trabajo.md        # Guía detallada del workflow de Git
    ├── comandos-git.md            # Comandos esenciales de Git
    └── extras/                    # Configuraciones adicionales
        ├── configurar-env-para-bd.md  # Setup de variables de entorno
        └── configurar-ssh.md          # Configuración de SSH para GitHub
```

---

## 🚀 Guía de Inicio Rápido (Quickstart)

Sigue estos pasos para tener el proyecto corriendo en tu máquina local.

### 1. Prerrequisitos

Asegúrate de tener instalado el siguiente software:
* Git
* JDK 17 o superior
* Node.js (LTS)
* PostgreSQL

### 2. Clonar el Repositorio

```bash
git clone git@github.com:tu-usuario/dulcecontrol-panaderia-pasteleria.git
# O si no configuraste tu SSH puedes usar HTTPS:
# git clone https://github.com/tu-usuario/dulcecontrol-panaderia-pasteleria.git
cd dulcecontrol-panaderia-pasteleria
```

### 3. Configuración del Backend

1.  **Crea la Base de Datos:** Abre tu gestor de PostgreSQL y crea una base de datos vacía llamada `dulcecontrol`.
2.  **Configura las Variables de Entorno:** Debes configurar las credenciales de tu base de datos local como variables de entorno.
    * `POSTGRE_DB_USER`: Tu usuario de PostgreSQL (ej. `postgres`).
    * `POSTGRE_DB_PASSWORD`: Tu contraseña de PostgreSQL.
    * *(Consulta la guía de configuración detallada en `docs/extras/configurar-env-para-bd.md`)*

### 4. Configuración del Frontend

1.  Navega a la carpeta del frontend:
    ```bash
    cd dulcecontrol-frontend
    ```
2.  Instala todas las dependencias:
    ```bash
    npm install
    ```

---

## ▶️ Cómo Ejecutar el Proyecto

Debes tener dos terminales abiertas, una para el backend y otra para el frontend.

1.  **Ejecutar el Backend:**
    * Abre la carpeta `dulcecontrol-backend` en tu IDE (como VS Code o IntelliJ).
    * Ejecuta la aplicación de Spring Boot. El servidor se iniciará en `http://localhost:8080`.
    * Flyway ejecutará automáticamente las migraciones de base de datos al iniciar.

2.  **Ejecutar el Frontend:**
    * En una terminal, asegúrate de estar en la carpeta `dulcecontrol-frontend`.
    * Ejecuta el siguiente comando:
        ```bash
        npm run dev
        ```
    * Abre tu navegador y ve a la URL que te indique la terminal (usualmente `http://localhost:5173`).

### 🔧 Comandos Útiles

**Backend (desde dulcecontrol-backend/):**
```bash
# Compilar el proyecto
./mvnw compile

# Ejecutar tests
./mvnw test

# Generar archivo JAR
./mvnw package
```

**Frontend (desde dulcecontrol-frontend/):**
```bash
# Modo desarrollo con hot reload
npm run dev

# Construir para producción
npm run build

# Vista previa de la build de producción
npm run preview

# Linter para verificar código
npm run lint
```

---

## 🤝 Cómo Contribuir

La colaboración es la clave de este proyecto. Todo el trabajo se realiza siguiendo un flujo de trabajo estricto para mantener la calidad y el orden del código.

### Flujo de Desarrollo
* **Modelo de Ramas:** Usamos un Git Flow simplificado con las ramas principales:
  - `main`: Código en producción, completamente estable
  - `develop`: Rama de desarrollo donde se integran las nuevas funcionalidades
  - `feature/*`: Ramas temporales para nuevas funcionalidades
  - `fix/*`: Ramas temporales para corrección de errores
  
* **Pull Requests:** Todo cambio debe ser integrado a `develop` a través de un Pull Request revisado y aprobado por al menos un miembro del equipo.

* **Commits:** Seguimos la convención de Conventional Commits:
  - `feat:` para nuevas funcionalidades
  - `fix:` para corrección de errores  
  - `docs:` para cambios en documentación
  - `chore:` para tareas de mantenimiento

### Antes de Contribuir
1. Lee completamente la documentación en `docs/`
2. Configura tu entorno siguiendo esta guía
3. Familiarízate con el flujo de trabajo de Git del equipo

> 📜 **Para una guía detallada, por favor lee el documento `docs/flujo-de-trabajo.md` y `docs/flujo-de-trabajo-simplificado.md`.**

---

## � Estado del Proyecto

### 🚧 En Desarrollo Activo

**Dulce Control** se encuentra actualmente en fase de desarrollo inicial. Las funcionalidades base están siendo implementadas siguiendo metodologías ágiles.

### ✅ Completado
- [x] Configuración inicial del proyecto (monorepo)
- [x] Setup del backend con Spring Boot y Spring Security
- [x] Configuración de base de datos PostgreSQL con Flyway
- [x] Setup del frontend con React + Vite
- [x] Documentación completa del flujo de trabajo con Git
- [x] Guías de configuración del entorno de desarrollo

### 🔄 En Progreso
- [ ] Implementación de entidades de dominio (Producto, Cliente, Venta, etc.)
- [ ] Sistema de autenticación y autorización
- [ ] API REST para gestión de productos
- [ ] Interfaz de usuario para el catálogo de productos

### 📅 Próximas Funcionalidades
- [ ] Sistema de inventario y control de stock
- [ ] Punto de venta (POS) integrado
- [ ] Gestión de clientes y historial de compras
- [ ] Reportes y analytics de ventas
- [ ] Sistema multi-tenant para múltiples panaderías

---

## 🔧 Tecnologías y Herramientas

### Backend
- **Java 17**: Lenguaje principal
- **Spring Boot 3.5.5**: Framework principal
- **Spring Security**: Autenticación y autorización
- **Spring Data JPA**: Persistencia de datos
- **PostgreSQL**: Base de datos relacional
- **Flyway**: Migraciones de base de datos
- **Maven**: Gestión de dependencias
- **Lombok**: Reducción de boilerplate code

### Frontend
- **React 19**: Biblioteca de interfaz de usuario
- **Vite**: Build tool y dev server
- **JavaScript/ES6+**: Lenguaje principal
- **CSS3**: Estilos y diseño responsivo

### DevOps y Colaboración
- **Git & GitHub**: Control de versiones
- **VS Code**: IDE recomendado
- **PostgreSQL**: Base de datos local para desarrollo

---

## �👥 Autores

| Nombre | Rol |
| :--- | :--- |
| Kevin Ayachi | Desarrollador |
| Joy Correa | Desarrollador |
| Frank Vasquez | Desarrollador |
| Jeison Carranza | Desarrollador |
| Belther Alain | Desarrollador |
| Heizen Guevara | Desarrollador |
| Marco Ayala | Desarrollador |

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📞 Soporte y Contacto

¿Tienes preguntas o necesitas ayuda con el proyecto?

- 📖 Consulta la documentación en la carpeta `docs/`
- 🐛 Reporta bugs creando un issue en GitHub
- 💡 Propón nuevas funcionalidades a través de issues
- 📧 Contacta al equipo de desarrollo para consultas específicas

---

*Dulce Control - Simplificando la gestión de panaderías y pastelerías* 🧁