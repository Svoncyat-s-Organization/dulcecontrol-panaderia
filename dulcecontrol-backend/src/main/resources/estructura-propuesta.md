# Blueprint MVC con principios SOLID para backend REST

_Fecha: 2025-11-10 (Actualizado)_

Este documento describe cómo estructuraría un backend Spring Boot siguiendo estrictamente el patrón **Modelo–Vista–Controlador (MVC)**, reforzado con principios **SOLID**. La capa de vista puede residir en otra aplicación (por ejemplo PHP); aquí nos centramos en el backend que expone la lógica y los datos.

---

## 1. Objetivos de diseño

- **Respetar MVC puro**: separar claramente Controlador, Modelo y Vista.
- **Aplicar SOLID**: lograr componentes mantenibles, extensibles y testeables.
- **Fomentar cohesión por dominio**: organizar código por contexto funcional (**Package-by-Feature**) sin romper las capas MVC internas.
- **Cuidar seguridad y consistencia**: centralizar autenticación, validaciones, errores y configuraciones sensibles, **mejorando el manejo de sesiones**.

---

## 2. Visión arquitectónica MVC (Híbrida)

Hemos adaptado el MVC clásico para que viva dentro de cada módulo funcional, manteniendo las nomenclaturas estándar académicas.

```
Vista externa (React, PHP, SPA)
          ▲
          │  JSON/HTML
          │
┌──────────────────────┐
│ Capa Controladores   │   ← C (Recibe HTTP, valida DTOs)
└──────────┬───────────┘
           │ invoca
           ▼
┌──────────────────────┐
│ Capa Modelo (Interna)│   ← M (Núcleo del módulo)
│  ├─ Servicios        │      (Lógica de negocio @Service)
│  ├─ Entidades JPA    │      (Datos y reglas simples @Entity)
│  └─ Repositorios     │      (Acceso a datos @Repository)
└──────────────────────┘
```

- **Controladores** traducen peticiones HTTP en llamadas al servicio y devuelven DTOs.
- **Modelo** (ahora compuesto por Service + Entity + Repository) encapsula toda la lógica y datos del módulo.
- **Vista** (externalizada) consume los endpoints expuestos.

---

## 3. Estructura recomendada del proyecto

```
src/main/java/com/dulcecontrol/bakery/
├── ApiApplication.java
├── config/                         # Configuraciones globales
│   └── SecurityConfig.java
├── shared/
│   ├── annotation/
│   ├── exception/
│   │   └── ApiExceptionHandler.java
│   ├── enum/
│   │   ├── TipoDocumento.java
│   │   └── TipoComprobante.java
│   └── util/
│       └── DateProvider.java
├── feature/admin/
│   ├── clientes/                   # Módulo encapsulado
│   │   ├── controller/
│   │   │   ├── ClienteController.java
│   │   │   └── dto/                # DTOs para contratos externos
│   │   │       ├── ClienteRequest.java
│   │   │       └── ClienteResponse.java
│   │   ├── service/
│   │   │   ├── IClienteService.java
│   │   │   └── impl/
│   │   │       └── ClienteService.java
│   │   ├── entity/                 # Nomenclatura estándar académica (@Entity)
│   │   │   ├── Cliente.java
│   │   │   ├── DireccionCliente.java
│   │   │   └── enum/
│   │   │      └── EstadoCliente.java
│   │   └── repository/             # Interfaces directas (@Repository)
│   │       └── ClienteRepository.java
│   ├── ventas/
│   │   └── ... (misma organización MVC)
│   └── seguridad/                  # Módulo de gestión de usuarios
│       ├── controller/
│       │   ├── UsuarioController.java
│       │   ├── AuthController.java
│       │   └── dto/ ...
│       ├── service/
│       │   └── ...
│       ├── entity/                 # MEJORA: Separación de identidad y sesión
│       │   ├── UsuarioTienda.java  # Datos del empleado
│       │   └── UsuarioToken.java   # Sesiones activas (múltiples por usuario)
│       └── repository/
│           ├── UsuarioTiendaRepository.java
│           └── UsuarioTokenRepository.java
└── security/                       # Infraestructura técnica (Filtros)
    ├── JwtFilter.java
    └── JwtProvider.java
```

---

## 4. Principios SOLID aplicados al MVC

### 4.1 Single Responsibility (SRP)

- **Controladores**: reciben peticiones, validan DTOs, invocan servicios y formatean respuestas. No tocan Entidades JPA directamente si es posible evitarlo.
- **Servicios**: encapsulan reglas de negocio (crear usuario, actualizar cliente, emitir venta).
- **Entidades (@Entity)**: representan la estructura de datos y reglas de validación básicas.

### 4.2 Open/Closed (OCP)

- El uso de interfaces en servicios (`IClienteService`) y repositorios (`JpaRepository`) permite extender comportamiento sin modificar el código cliente (controladores).

### 4.3 Liskov Substitution (LSP)

- Las implementaciones de servicios (`ClienteServiceImpl`) deben cumplir exactamente el contrato definido en sus interfaces (`IClienteService`).

### 4.4 Interface Segregation (ISP)

- Cada módulo (_feature_) define sus propias interfaces de servicio y repositorio, evitando interfaces monolíticas gigantes.

### 4.5 Dependency Inversion (DIP)

- Los controladores dependen de **abstracciones** (`IClienteService`), no de implementaciones concretas (`ClienteServiceImpl`). Spring maneja esta inyección.

---

## 5. Detalle por capa (Ajustado a Requisitos Académicos)

### 5.1 Controlador (C)

- Endpoints versionados (`/api/admin/v1/clientes`).
- Validaciones con `@Valid` en los DTOs de entrada.
- Manejo de excepciones delegando a `ApiExceptionHandler`.

### 5.2 Modelo (M) - Híbrido

- **Servicios**: Anotados con `@Service` y `@Transactional`. Orquestan la lógica entre entidades y repositorios.
- **Entidades**: Clases anotadas con `@Entity` que reflejan las tablas de la BD. Para este enfoque académico, pueden contener lógica de dominio ligera.
- **Repositorios**: Interfaces que extienden `JpaRepository`. Se usan directamente en los servicios para cumplir con el estándar esperado.

### 5.3 Vista (V)

- (Sin cambios: es externa).

---

## 6. Seguridad integrada y mejorada

- `AuthController` (C) recibe credenciales.
- `AuthService` (M) valida al usuario contra `UsuarioTiendaRepository`.
- Si es válido, genera un token usando `JwtProvider` y **lo guarda en `UsuarioTokenRepository`**. Esto permite tener múltiples sesiones (móvil, web) y revocarlas individualmente, superando el modelo de token único en la tabla de usuario.
- `JwtFilter` valida cada petición contra la tabla de tokens activos.

---

## 7. Estrategia de pruebas

- **Controladores**: `@WebMvcTest` con mocks de servicios.
- **Servicios**: Pruebas unitarias con JUnit + Mockito (mockeando repositorios).
- **Repositorios**: `@DataJpaTest` para validar consultas personalizadas.

---

## 8. Conclusión

Este blueprint ajustado mantiene la simplicidad exigida académicamente (usando capas estándar directamente), pero organiza el código de forma profesional por _features_ y mejora significativamente la seguridad de las sesiones, ofreciendo un backend robusto y escalable para el SaaS.
