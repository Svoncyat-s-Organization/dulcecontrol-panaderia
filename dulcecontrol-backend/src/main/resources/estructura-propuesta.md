# Blueprint de backend REST con enfoque SOLID

_Fecha: 2025-11-03_

Este documento describe cómo estructuraría un backend REST para un proyecto académico siguiendo prácticas de ingeniería senior. Se orienta a Spring Boot 3, pero los principios aplican a cualquier stack similar.

---

## 1. Objetivos estratégicos

- **Escalabilidad estructural**: modularizar de forma que nuevos casos de uso se incorporen sin reescribir capas existentes.
- **Mantenibilidad**: favorecer legibilidad, separación de responsabilidades y pruebas automatizadas.
- **Principios SOLID**: asegurar que cada capa respete las reglas de diseño orientado a objetos.
- **Seguridad y consistencia**: centralizar las reglas sensibles (auth, validaciones, errores) y reutilizarlas.

---

## 2. Arquitectura lógica de alto nivel

```
┌─────────────┐     ┌────────────────┐     ┌─────────────────┐     ┌──────────────┐
│ Controllers │ --> │ Application    │ --> │ Domain & Services│ --> │ Infrastructure│
│ (API layer) │     │ Services       │     │ (core logic)     │     │ (Data/Auth)  │
└─────────────┘     └────────────────┘     └─────────────────┘     └──────────────┘
         │                    │                         │                    │
         ▼                    ▼                         ▼                    ▼
    DTOs & mappers       Casos de uso             Entidades de dominio   Repositorios, integraciones
```

- **Controllers**: traducen HTTP ↔ casos de uso, validan entrada y formatean salida. Sin negocio ni acceso directo a datos.
- **Application services**: coordinan flujos; invocan servicios de dominio y gateways. Implementan lógica transaccional y orquestación.
- **Domain**: alberga reglas de negocio puras. Implementa entidades ricas, value objects, políticas, servicios de dominio.
- **Infrastructure**: adapta el dominio a tecnologías concretas (JPA, Redis, JWT, etc.). Incluye repositorios, adaptadores externos, configuración.

---

## 3. Estructura recomendada del proyecto

```
src/main/java/fisi/unsm/api/
├── ApiApplication.java
├── config/
│   ├── WebConfig.java
│   ├── SwaggerConfig.java
│   ├── SecurityConfig.java
│   └── CorsConfig.java
├── shared/
│   ├── exception/
│   │   ├── ApiExceptionHandler.java
│   │   └── exceptions...
│   ├── validation/
│   │   └── Validators...
│   └── util/
│       └── helpers...
├── module/               # División por contexto de negocio (ej. cursos, clientes...)
│   ├── curso/
│   │   ├── presentation/
│   │   │   ├── CursoController.java
│   │   │   └── dto/
│   │   │       ├── CursoRequest.java
│   │   │       ├── CursoUpdateRequest.java
│   │   │       └── CursoResponse.java
│   │   ├── application/
│   │   │   ├── CursoService.java
│   │   │   └── command/
│   │   │       └── handlers...
│   │   ├── domain/
│   │   │   ├── entity/
│   │   │   │   └── Curso.java
│   │   │   ├── valueobject/
│   │   │   └── service/
│   │   │       └── CursoPolicy.java
│   │   └── infrastructure/
│   │       ├── persistence/
│   │       │   ├── CursoJpaEntity.java
│   │       │   ├── CursoRepository.java
│   │       │   └── CursoJpaRepository.java
│   │       └── mapper/
│   │           └── CursoMapper.java
│   └── ...
└── security/
    ├── JwtProvider.java
    ├── JwtAuthenticationFilter.java
    ├── UserDetailsServiceImpl.java
    └── AuthenticationController.java
```

**Claves**:

- Agrupar el código por **módulo funcional** evita mezclar entidades sin relación.
- Distinguir `domain` (entidades puras) de `infrastructure` (JPA, DTO) permite reemplazar frameworks sin tocar el corazón del negocio.
- `shared` alberga infraestructura transversal (manejo de errores, utilidades, anotaciones).

---

## 4. Principios SOLID aplicados

### 4.1 Single Responsibility (SRP)

- Cada clase/módulo tiene un propósito directo:
  - `CursoController`: recibe solicitudes HTTP, delega en servicios, prepara respuestas.
  - `CursoService`: orquesta casos de uso (crear, actualizar, eliminar).
  - `Curso`: entidad de dominio que asegura invariantes (ej. nombre no vacío).
  - `CursoMapper`: transforma entre entidad de dominio y entidad JPA/DTO.
- Evitar lógica transversal en entidades (nada de instanciar codificadores dentro de setters). Utilizar eventos o listeners si es necesario.

### 4.2 Open/Closed (OCP)

- **Interfaces** para servicios y repositorios. Ejemplo: `CursoRepository` define métodos de dominio (`findByCodigo`, `existsByTipo`). Implementaciones concretas (`CursoJpaRepository`) pueden ampliarse sin romper el contrato.
- Usar anotaciones y configuración modular (BeanPostProcessors, `@ConfigurationProperties`) para extender sin modificar clases existentes.

### 4.3 Liskov Substitution (LSP)

- Evitar herencias con comportamiento modificado. Priorizar composición o interfaces.
- Si se usan jerarquías (ej. `BaseEntity`), garantizan que cualquier subclase mantenga las expectativas del cliente.

### 4.4 Interface Segregation (ISP)

- Diseñar interfaces específicas por contexto. En vez de un `GenericService<T>`, definir contratos concretos (`CursoCommandService`, `CursoQueryService`), permitiendo que cada implementación solo exponga lo necesario.
- Separar DTOs de comandos y consultas para no forzar datos innecesarios (CQRS ligera).

### 4.5 Dependency Inversion (DIP)

- Inyección por constructor para todas las dependencias.
- Controllers dependen de interfaces de servicio, no de repositorios concretos.
- Servicios de dominio dependen de interfaces (ej. `PasswordEncoder`, `EventPublisher`), configuradas vía Spring.
- `JwtAuthenticationFilter` consume un `TokenVerifier` abstracto; la implementación concreta podría cargar claves desde vault, base de datos, etc.

---

## 5. Detalle por capa

### 5.1 Controllers (presentación)

- Endpoints versionados: `/api/v1/cursos`.
- Validaciones con `@Valid` + constraints (`@NotBlank`, `@Email`).
- Uso de DTOs de entrada/salida; nunca exponer entidades JPA.
- Respuestas tipadas (`ResponseEntity<CursoResponse>`), códigos HTTP correctos y encabezados relevantes.
- Errores centralizados mediante `@RestControllerAdvice` (mapeos consistentes de excepciones a status y payloads).

### 5.2 Application services

- Métodos cortos que combinan
  - Validación de reglas transversales.
  - Invocación de repositorios a través de puertos.
  - Integraciones (envío de correos, auditoría) mediadas por adaptadores.
- Transacciones declarativas (`@Transactional`) solo aquí, evitando leaks a la capa de presentación.
- Mapeo de DTOs ↔ dominio mediante `mapper` (MapStruct recomendado para proyectos grandes).

### 5.3 Domain

- Entidades inmutables o con setters controlados; garantizar invariantes en constructores o fábricas estáticas.
- ValueObjects (`Email`, `Telefono`) previenen duplicidad de validaciones y clarifican intenciones.
- Servicios de dominio encapsulan reglas complejas (ej. políticas de asignación de cursos a categorías).
- Eventos de dominio (`CursoCreadoEvent`) informan a otras partes del sistema sin acoplamiento directo.

### 5.4 Infrastructure

- **Persistencia**: separar `CursoJpaEntity` (anotada con JPA) de `Curso` (dominio). Comunicarse mediante mappers.
- **Repositorios**: `CursoJpaRepository extends JpaRepository<CursoJpaEntity, Long>` + adaptador `CursoRepositoryAdapter` que implementa la interfaz de dominio y delega en JPA.
- **Security**: `JwtProvider` gestiona claves (permanentes, rotables); `JwtAuthenticationFilter` verifica tokens consultando un `UserDetailsService` especializado.
- **Configuraciones**: propiedades externas (`application.yaml`, perfiles por entorno, variables de entorno). No hardcodear credenciales.

---

## 6. Módulo de autenticación ejemplar

```
module/security/
├── presentation/
│   └── AuthenticationController.java
├── application/
│   ├── AuthenticateUserUseCase.java
│   └── RegisterUserUseCase.java
├── domain/
│   ├── User.java
│   ├── PasswordHasher.java (interface)
│   └── TokenGenerator.java (interface)
└── infrastructure/
    ├── persistence/
    │   └── UserJpaRepository.java
    ├── password/
    │   └── BCryptPasswordHasher.java
    └── token/
        └── JwtTokenGenerator.java
```

- El caso de uso `AuthenticateUserUseCase` se responsabiliza de:
  1. Leer el usuario por email.
  2. Validar la contraseña mediante `PasswordHasher`.
  3. Emitir token JWT usando `TokenGenerator`.
  4. Devolver DTO con token y metadatos.
- Tests unitarios pueden mockear `PasswordHasher` y `TokenGenerator`, evidenciando la utilidad del DIP.

---

## 7. Patrones complementarios

- **Command/Query separation**: para operaciones complejas adoptar `command handler` y `query handler` separados.
- **Specification pattern**: encapsular filtros de consulta en objetos reutilizables.
- **Adapter/Facade**: para integrar servicios externos sin contaminar el dominio.
- **Event sourcing ligero**: publicar eventos a un bus interno (`ApplicationEventPublisher`) cuando procesos relevantes ocurran.

---

## 8. Estrategia de configuración y despliegue

- Propiedades en `application.yaml`:
  - `spring.profiles.active=dev` por defecto.
  - `application-dev.yaml`, `application-prod.yaml` con credenciales externas y toggles.
  - Cifrado de valores sensibles mediante vault o Jasypt.
- Pipelines de CI con validaciones automáticas (`mvn verify` + análisis estático + cobertura).
- Contenedorización con Docker, usando variables de entorno para inyectar secretos.

---

## 9. Pruebas y observabilidad

- **Unitarias**: clases de dominio y servicios con mocks (`@ExtendWith(MockitoExtension.class)`).
- **Integración**: pruebas con `@SpringBootTest` + `@AutoConfigureMockMvc` para endpoints.
- **Contract tests**: garantizar que la API publicada cumple acuerdos (OpenAPI + `springdoc-openapi`).
- **Observabilidad**: logs estructurados, métricas Prometheus, traces con OpenTelemetry (opcional en académicos pero recomendable).

---

## 10. Checklist de calidad

- [ ] Controladores sin lógica de negocio.
- [ ] Todos los servicios inyectados por constructor e interfaces.
- [ ] Entidades de dominio sin anotaciones de frameworks.
- [ ] DTOs aislados, sin reusar entidades.
- [ ] Manejo centralizado de excepciones.
- [ ] Validaciones declarativas y personalizadas.
- [ ] Token JWT firmado con clave persistente y corta duración.
- [ ] Scripts de base separados por entorno y sin credenciales reales.
- [ ] Pruebas mínimas: para cada módulo, unitaria del dominio + integración del caso de uso principal.

---

## 11. Conclusión

Construir desde este blueprint permite extender el backend con nuevas capacidades manteniendo orden y alta cohesión. Los principios SOLID guían el diseño en cada capa, obteniendo un proyecto académico que se comporta como una base profesional lista para escalar.
