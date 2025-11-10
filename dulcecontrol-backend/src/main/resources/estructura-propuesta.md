# Blueprint MVC con principios SOLID para backend REST

_Fecha: 2025-11-03_

Este documento describe cómo estructuraría un backend Spring Boot siguiendo estrictamente el patrón **Modelo–Vista–Controlador (MVC)**, reforzado con principios **SOLID**. La capa de vista puede residir en otra aplicación (por ejemplo PHP); aquí nos centramos en el backend que expone la lógica y los datos.

---

## 1. Objetivos de diseño

- **Respetar MVC puro**: separar claramente Controlador, Modelo y Vista.
- **Aplicar SOLID**: lograr componentes mantenibles, extensibles y testeables.
- **Fomentar cohesión por dominio**: organizar código por contexto funcional sin romper MVC.
- **Cuidar seguridad y consistencia**: centralizar autenticación, validaciones, errores y configuraciones sensibles.

---

## 2. Visión arquitectónica MVC

```
Vista externa (PHP, SPA, Thymeleaf)
          ▲
          │  JSON/HTML
          │
┌──────────────────────┐
│ Controladores Spring │   ← C
└──────────┬───────────┘
           │ invoca al modelo
           ▼
┌──────────────────────┐
│ Modelo (Dominio)     │   ← M
│  ├─ Servicios        │
│  ├─ Casos de uso     │
│  ├─ Entidades/VOs    │
│  └─ Reglas de negocio│
└──────────┬───────────┘
           │ usa infraestructura
           ▼
┌──────────────────────┐
│ Persistencia & Auth  │
│  ├─ Repositorios JPA │
│  ├─ Mappers          │
│  └─ Integraciones    │
└──────────────────────┘
```

- **Controladores** traducen peticiones HTTP en llamadas al modelo y devuelven respuestas (JSON, vistas).
- **Modelo** encapsula reglas de negocio, entidades, value objects y servicios.
- **Vista** (externalizada) consume los endpoints expuestos por los controladores.
- **Persistencia/Infraestructura** es un detalle interno del modelo; se accede mediante interfaces.

---

## 3. Estructura recomendada del proyecto

```
src/main/java/fisi/unsm/api/
├── ApiApplication.java
├── config/
│   ├── CorsConfig.java
│   ├── JacksonConfig.java
│   ├── SecurityConfig.java
│   └── SwaggerConfig.java
├── shared/
│   ├── annotation/
│   ├── exception/
│   │   ├── ApiExceptionHandler.java
│   │   └── BusinessException.java
│   ├── enum/
│   │   ├── TipoDocumento.java
│   │   └── TipoComprobante.java
│   └── util/
│       └── DateProvider.java
├── feature/admin/
│   ├── cliente/
│   │   ├── controller/
│   │   │   └── ClienteController.java
│   │   │   ├── dto/
│   │   │   │   ├── ClienteRequest.java
│   │   │   │   └── ClienteResponse.java
│   │   ├── service/
│   │   │   └── IClienteService.java
│   │   │       └── impl/
│   │   │           └── ClienteService.java
│   │   ├── entity/
│   │   │   ├── Cliente.java
│   │   │   └── DireccionCliente.java
│   │   │   ├── enum/
│   │   │   │   └── EstadoCliente.java
│   │   └── persistence/
│   │       ├── ClienteEntity.java
│   │       ├── ClienteJpaRepository.java
│   │       └── ClienteRepositoryAdapter.java
│   ├── ventas/
│   │   └── ... (misma organización MVC)
│   └── seguridad/
│       ├── controller/
│       │   └── AuthController.java
│       ├── model/
│       │   ├── AuthService.java
│       │   ├── JwtTokenService.java
│       │   └── UsuarioSistema.java
│       └── persistence/
│           ├── UsuarioEntity.java
│           └── UsuarioRepositoryAdapter.java
└── security/
    ├── JwtFilter.java
    ├── JwtProvider.java
    └── UserDetailsServiceImpl.java
```

**Convenciones clave**

- `feature/<contexto>` agrupa el código por dominio (cliente, ventas, seguridad) manteniendo carpetas MVC (`controller`, `model`, `dto`, `persistence`, `service`, `enum`, `service/impl`).
- `model` representa la M: servicios, entidades de dominio, value objects y reglas.
- `controller` es la C. La V se resuelve externamente.
- `persistence` contiene adaptadores que implementan interfaces del modelo y usan Spring Data u otras tecnologías.
- `shared` almacena utilidades transversales (validaciones, excepciones, helpers) sin romper MVC.

---

## 4. Principios SOLID aplicados al MVC

### 4.1 Single Responsibility (SRP)

- **Controladores**: reciben peticiones, validan DTOs, invocan servicios del modelo y formatean respuestas.
- **Servicios del modelo**: encapsulan reglas de negocio (crear usuario, actualizar usuario, emitir token).
- **Entidades/Value Objects**: protegen invariantes (ej. `UsuarioId`, `CorreoUsuario`).
- **Adaptadores de persistencia**: convierten entre el dominio y la base de datos, sin lógica extra.

### 4.2 Open/Closed (OCP)

- Interfaces del modelo (`ClienteRepository`, `TokenProvider`) permiten nuevas implementaciones sin modificar consumidores.
- Estrategias configurables (ej. `PoliticaCliente`) facilitan cambiar reglas mediante inyección de dependencias.

### 4.3 Liskov Substitution (LSP)

- Evitar herencia compleja entre controladores/servicios. Utilizar composición o interfaces para comportamientos reutilizables.
- Si hay clases base (`AbstractController`), no deben alterar expectativas de las subclases.

### 4.4 Interface Segregation (ISP)

- Separar contratos de lectura y escritura (`ClienteCommandRepository`, `ClienteQueryRepository`) cuando sea necesario.
- Controladores dependen de servicios específicos (`ClienteCommandService`, `ClienteQueryService`) sin métodos innecesarios.

### 4.5 Dependency Inversion (DIP)

- Inyección por constructor para todas las dependencias.
- Servicios del modelo dependen de interfaces; adaptadores de infraestructura las implementan.
- Componentes de seguridad (JWT, hashing) se abstraen en interfaces configurables.

---

## 5. Detalle por capa

### 5.1 Controlador (C)

- Endpoints versionados (`/api/admin/v1/clientes`).
- Validaciones con `@Valid` y restricciones (`@NotBlank`, `@Email`).
- Manejo de excepciones delegando a `ApiExceptionHandler` para respuestas consistentes.
- Respuestas en DTOs o `ModelAndView` si se usa una vista server-side directa.

### 5.2 Modelo (M)

- Servicios anotados con `@Service`, que implementan lógica atómica y transaccional (`@Transactional`).
- Entidades de dominio libres de anotaciones JPA; la persistencia se maneja en adaptadores.
- Value Objects garantizan formatos válidos (IDs, emails, teléfonos) y se reutilizan en todo el dominio.
- Eventos de dominio (`ClienteCreadoEvent`) publicados mediante `ApplicationEventPublisher` para notificaciones internas.

### 5.3 Persistencia/Infraestructura

- Entidades JPA (`ClienteEntity`) con `@Entity`, relaciones y soft delete si aplica.
- Repositorios Spring Data (`ClienteJpaRepository`) expuestos solo a la infraestructura.
- Adaptadores (`ClienteRepositoryAdapter`) implementan interfaces del modelo, delegando en `ClienteJpaRepository` y mapeando entidades ↔ dominio (MapStruct recomendado).
- Otros adaptadores (mensajería, terceros) siguen el mismo patrón.

### 5.4 Vista (V)

- Puede ser un front independiente (PHP, React, Angular). Consume JSON del backend.
- Si se necesita SSR, ubicar plantillas en `src/main/resources/templates`; los controladores retornan `ModelAndView` reutilizando la misma lógica del modelo.

---

## 6. Seguridad integrada en MVC

- `AuthController` (C) recibe credenciales y delega en `AuthService` (M).
- `AuthService` valida clientes, compara contraseñas vía `PasswordHasher` y genera tokens mediante `JwtTokenService` (interfaces del modelo).
- Implementaciones concretas (`BCryptPasswordHasher`, `JwtProvider`) viven en infraestructura.
- `JwtFilter` toma tokens y construye autenticaciones apoyándose en servicios del modelo, sin acceder directamente a repositorios.

---

## 7. Estrategia de pruebas

- **Controladores**: `@WebMvcTest` con mocks de servicios.
- **Modelo**: pruebas unitarias (JUnit + Mockito) sobre servicios, entidades y políticas.
- **Persistencia**: `@DataJpaTest` para validar mappings y queries.
- **Integración**: `@SpringBootTest` con `MockMvc` o `TestRestTemplate` para flujos completos.

---

## 8. Herramientas complementarias

- **MapStruct**: mapeos automáticos entre dominio, DTOs y entidades JPA.
- **Bean Validation**: reglas declarativas en DTOs y validaciones personalizadas en el modelo.
- **OpenAPI/Swagger**: documentación de endpoints consumidos por la vista.
- **Flyway/Liquibase**: control de versiones de base de datos.

---

## 9. Checklist MVC + SOLID

- [ ] Controladores sin acceso directo a repositorios.
- [ ] Servicios del modelo encapsulan reglas y dependen de interfaces.
- [ ] Entidades del modelo sin anotaciones de infraestructura.
- [ ] Adaptadores implementan interfaces del modelo y manejan persistencia.
- [ ] DTOs diferenciados de entidades y value objects.
- [ ] Seguridad centralizada (hashing, tokens) mediante interfaces inyectables.
- [ ] Validaciones declarativas complementadas con reglas de negocio en el modelo.
- [ ] Manejo de excepciones uniforme (`ApiExceptionHandler`).
- [ ] Pruebas que cubren capas C, M e infraestructura.

---

## 10. Conclusión

Este blueprint mantiene la simplicidad exigida por el patrón MVC, pero distribuye responsabilidades según SOLID: controladores ligeros, modelo robusto, infraestructura separable. Con esta base, el backend se integra fácilmente con la vista externa y ofrece una guía profesional para escalar el proyecto académico.
