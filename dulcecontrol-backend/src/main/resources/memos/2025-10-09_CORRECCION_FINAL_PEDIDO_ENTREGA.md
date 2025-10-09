# 🎯 CORRECCIÓN FINAL: PedidoEntrega - @MapsId Pattern

**Fecha**: 2025-10-09  
**Sesión**: Corrección definitiva de PedidoEntrega usando Shared Primary Key Pattern  
**Resultado**: ✅ **APLICACIÓN INICIADA CORRECTAMENTE**

---

## 🔴 PROBLEMA INICIAL

### Error Runtime Crítico

```
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'pedidoEntregaRepository'
This class [class com.dulcecontrol.bakery.entity.PedidoEntrega] does not define an IdClass

Caused by: java.lang.IllegalArgumentException: This class does not define an IdClass
    at org.hibernate.metamodel.model.domain.AbstractIdentifiableType.getIdClassAttributes(AbstractIdentifiableType.java:214)
```

### Código Problemático

```java
@Entity
@Table(name = "pedido_entrega", schema = "dulce_control")
@IdClass(PedidoEntregaId.class)  // ❌ Enfoque INCORRECTO
public class PedidoEntrega implements Serializable {

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;  // ❌ Usar objeto Pedido como @Id no funciona con @IdClass
}
```

**Problema**: Se intentó usar `@IdClass` para una relación **Shared Primary Key** (1:1 con ID compartido), cuando en realidad `@IdClass` es para **Composite Keys** (múltiples campos `@Id`).

---

## 💡 ANÁLISIS TÉCNICO

### Diferencia entre @IdClass y @MapsId

#### @IdClass (Composite Keys)

Usado cuando una entidad tiene **múltiples campos como clave primaria**:

```java
@Entity
@IdClass(InventarioProductoId.class)
public class InventarioProducto {
    @Id
    @ManyToOne
    private Sede sede;        // Campo 1 de la clave compuesta

    @Id
    @ManyToOne
    private Producto producto;  // Campo 2 de la clave compuesta
}

// Clase IdClass correspondiente
public class InventarioProductoId implements Serializable {
    private Sede sede;      // ✅ Mismo tipo que en la entidad
    private Producto producto;  // ✅ Mismo tipo que en la entidad

    // equals, hashCode, Serializable
}
```

#### @MapsId (Shared Primary Key)

Usado cuando una entidad **comparte su ID con otra entidad relacionada 1:1**:

```java
@Entity
public class PedidoEntrega {
    @Id
    @Column(name = "pedido_id")
    private Long pedidoId;  // ID simple, tipo primitivo/wrapper

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId  // ✅ Indica que pedido proporciona el valor para pedidoId
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;
}
```

**La diferencia clave:**

- `@IdClass`: Múltiples campos `@Id` → Clase separada con los mismos campos
- `@MapsId`: Un solo `@Id` + relación `@OneToOne/@ManyToOne` → El ID viene de la relación

---

## ✅ SOLUCIÓN APLICADA

### Cambios en PedidoEntrega.java

**ANTES (Incorrecto):**

```java
@Entity
@Table(name = "pedido_entrega", schema = "dulce_control")
@IdClass(PedidoEntregaId.class)  // ❌
public class PedidoEntrega implements Serializable {

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;  // ❌

    // ... campos
}
```

**DESPUÉS (Correcto):**

```java
@Entity
@Table(name = "pedido_entrega", schema = "dulce_control")
public class PedidoEntrega implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "pedido_id")
    private Long pedidoId;  // ✅ ID simple tipo Long

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId  // ✅ Shared Primary Key pattern
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ModalidadEntrega modalidad;

    @Size(max = 250)
    @Column(length = 250)
    private String direccion;

    @Size(max = 250)
    @Column(length = 250)
    private String referencia;

    @Size(max = 80)
    @Column(length = 80)
    private String distrito;

    @DecimalMin(value = "0.0")
    @Column(name = "costo_envio", precision = 12, scale = 2)
    private BigDecimal costoEnvio = BigDecimal.ZERO;

    // Getters y setters...

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    // Método de compatibilidad
    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
    }

    // ... resto de getters/setters
}
```

**Imports necesarios:**

```java
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;  // ✅ Nuevo import
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
```

---

## 📂 ARCHIVOS MODIFICADOS

### 1. PedidoEntrega.java

- ✅ Eliminado: `@IdClass(PedidoEntregaId.class)`
- ✅ Cambiado: `@Id` de `private Pedido pedido` a `private Long pedidoId`
- ✅ Agregado: `@MapsId` en la relación `@OneToOne`
- ✅ Agregado: `@Column(name = "pedido_id")` en el campo `pedidoId`
- ✅ Agregado: Import de `jakarta.persistence.MapsId`

### 2. PedidoEntregaRepository.java

```java
// ANTES
public interface PedidoEntregaRepository extends JpaRepository<PedidoEntrega, PedidoEntregaId>

// DESPUÉS
public interface PedidoEntregaRepository extends JpaRepository<PedidoEntrega, Long>
```

### 3. IPedidoEntregaService.java

```java
// ANTES
Optional<PedidoEntrega> buscarId(PedidoEntregaId id);
void eliminar(PedidoEntregaId id);

// DESPUÉS
Optional<PedidoEntrega> buscarId(Long id);
void eliminar(Long id);
```

### 4. PedidoEntregaService.java (en `service/jpa/`)

```java
// ANTES
import com.dulcecontrol.bakery.entity.PedidoEntregaId;

public Optional<PedidoEntrega> buscarId(PedidoEntregaId id) {
    return repoPedidoEntrega.findById(id);
}

public void eliminar(PedidoEntregaId id) {
    repoPedidoEntrega.deleteById(id);
}

// DESPUÉS
// (eliminado import de PedidoEntregaId)

public Optional<PedidoEntrega> buscarId(Long id) {
    return repoPedidoEntrega.findById(id);
}

public void eliminar(Long id) {
    repoPedidoEntrega.deleteById(id);
}
```

### 5. PedidoEntregaController.java

```java
// ANTES
import com.dulcecontrol.bakery.entity.PedidoEntregaId;

@GetMapping("/pedidoEntrega/{id}")
public Optional<PedidoEntrega> buscarId(@PathVariable("id") Long id) {
    PedidoEntregaId pedidoEntregaId = new PedidoEntregaId(id);
    return servicePedidoEntrega.buscarId(pedidoEntregaId);
}

@DeleteMapping("/pedidoEntrega/{id}")
public String eliminar(@PathVariable Long id) {
    PedidoEntregaId pedidoEntregaId = new PedidoEntregaId(id);
    servicePedidoEntrega.eliminar(pedidoEntregaId);
    return "PedidoEntrega eliminado";
}

// DESPUÉS
// (eliminado import de PedidoEntregaId)

@GetMapping("/pedidoEntrega/{id}")
public Optional<PedidoEntrega> buscarId(@PathVariable("id") Long id) {
    return servicePedidoEntrega.buscarId(id);
}

@DeleteMapping("/pedidoEntrega/{id}")
public String eliminar(@PathVariable Long id) {
    servicePedidoEntrega.eliminar(id);
    return "PedidoEntrega eliminado";
}
```

---

## 🎉 RESULTADO FINAL

### ✅ Aplicación Iniciada Correctamente

**Logs de Inicio Exitoso:**

```
2025-10-09T12:54:05.313  INFO --- [DulceControl] : Starting DulceControlApplication using Java 21.0.8
2025-10-09T12:54:06.302  INFO --- [DulceControl] : Bootstrapping Spring Data JPA repositories in DEFAULT mode
2025-10-09T12:54:06.419  INFO --- [DulceControl] : Finished Spring Data repository scanning in 108 ms.
Found 34 JPA repository interfaces.

2025-10-09T12:54:07.280  INFO --- [DulceControl] : HikariPool-1 - Starting...
2025-10-09T12:54:07.561  INFO --- [DulceControl] : HikariPool-1 - Start completed.

2025-10-09T12:54:07.589  INFO --- [DulceControl] : Database: jdbc:postgresql://localhost:5432/dulcecontrol_bd (PostgreSQL 17.6)
2025-10-09T12:54:07.641  INFO --- [DulceControl] : Successfully validated 10 migrations (execution time 00:00.032s)
2025-10-09T12:54:07.695  INFO --- [DulceControl] : Current version of schema "dulce_control": 9
2025-10-09T12:54:07.698  INFO --- [DulceControl] : Schema "dulce_control" is up to date. No migration necessary.

2025-10-09T12:54:09.384  INFO --- [DulceControl] : Initialized JPA EntityManagerFactory for persistence unit 'default'

2025-10-09T12:54:10.599  INFO --- [DulceControl] : Tomcat started on port 8080 (http) with context path '/'
2025-10-09T12:54:10.611  INFO --- [DulceControl] : Started DulceControlApplication in 5.671 seconds (process running for 6.081)
```

### 📊 Estado de la Aplicación

| Componente        | Estado         | Detalles                      |
| ----------------- | -------------- | ----------------------------- |
| **Spring Boot**   | ✅ Running     | v3.5.5                        |
| **Java Runtime**  | ✅ OK          | Java 21.0.8                   |
| **Tomcat**        | ✅ Started     | Puerto 8080                   |
| **PostgreSQL**    | ✅ Connected   | v17.6                         |
| **HikariCP**      | ✅ Active      | Pool iniciado                 |
| **Flyway**        | ✅ Validated   | 10 migraciones, schema v9     |
| **JPA/Hibernate** | ✅ Initialized | 37 entidades, 34 repositorios |
| **PedidoEntrega** | ✅ Fixed       | @MapsId pattern aplicado      |

### ✅ Sin Errores

- ✅ No hay errores de "This class does not define an IdClass"
- ✅ No hay advertencias de composite-id sin equals/hashCode
- ✅ Todos los repositorios JPA detectados correctamente (34/34)
- ✅ EntityManagerFactory inicializado sin errores
- ✅ Contexto de aplicación iniciado completamente

---

## 📚 RESUMEN DE LECCIONES APRENDIDAS

### 1. Cuándo usar @IdClass vs @MapsId

**Usa @IdClass cuando:**

- Tienes **múltiples campos** marcados con `@Id`
- Es un verdadero **Composite Key** (clave compuesta)
- Ejemplos: `InventarioProducto` (sede + producto), `RolPermiso` (rol + permiso)

**Usa @MapsId cuando:**

- Tienes **un solo campo `@Id`** que obtiene su valor de una relación
- Es un **Shared Primary Key** (clave compartida 1:1)
- Ejemplo: `PedidoEntrega` (comparte ID con `Pedido`)

### 2. Estructura correcta de @IdClass

```java
// En la clase @IdClass, los campos deben coincidir EXACTAMENTE con los de la entidad
@Entity
@IdClass(MiClaveId.class)
public class MiEntidad {
    @Id
    @ManyToOne
    private OtraEntidad campo1;  // Tipo: OtraEntidad

    @Id
    private Long campo2;  // Tipo: Long
}

public class MiClaveId implements Serializable {
    private OtraEntidad campo1;  // ✅ Mismo tipo (OtraEntidad, no Long)
    private Long campo2;         // ✅ Mismo tipo (Long)

    // equals, hashCode OBLIGATORIOS
}
```

### 3. Patrón @MapsId es más simple para 1:1

En lugar de crear una clase `PedidoEntregaId` innecesaria, usamos:

- `@Id` con tipo simple (`Long`)
- `@MapsId` en la relación `@OneToOne`
- Hibernate automáticamente sincroniza el valor del ID

---

## 🔍 COMPARACIÓN: Antes vs Después

### ANTES (Código Problemático)

```
PedidoEntrega.java
├─ @IdClass(PedidoEntregaId.class)  ❌ No funciona
├─ @Id private Pedido pedido         ❌ Objeto como ID
└─ Sin @MapsId

PedidoEntregaId.java
├─ private Long pedido  ❌ Tipo no coincide con entidad
└─ Clase innecesaria

PedidoEntregaRepository
└─ JpaRepository<PedidoEntrega, PedidoEntregaId>  ❌ Tipo ID incorrecto

Resultado: ❌ Error al iniciar - "does not define an IdClass"
```

### DESPUÉS (Código Correcto)

```
PedidoEntrega.java
├─ Sin @IdClass                       ✅ No se necesita
├─ @Id private Long pedidoId          ✅ ID simple
├─ @MapsId private Pedido pedido      ✅ Shared Primary Key
└─ @Column(name = "pedido_id")        ✅ Mapeo explícito

PedidoEntregaId.java
└─ ELIMINADO (innecesario)             ✅

PedidoEntregaRepository
└─ JpaRepository<PedidoEntrega, Long>  ✅ ID tipo Long

Resultado: ✅ Aplicación inicia correctamente
```

---

## 🎯 CONCLUSIÓN

**Problema Original:**  
Uso incorrecto de `@IdClass` para una relación Shared Primary Key (1:1 con ID compartido).

**Solución Aplicada:**  
Reemplazar `@IdClass` por `@MapsId`, que es el patrón correcto para este caso.

**Resultado:**  
✅ **Aplicación Spring Boot iniciada exitosamente**

- Puerto: 8080
- Base de datos conectada
- 34 repositorios JPA cargados
- 37 entidades mapeadas
- Sin errores

**Archivos Totales Modificados:** 5

1. ✅ PedidoEntrega.java
2. ✅ PedidoEntregaRepository.java
3. ✅ IPedidoEntregaService.java
4. ✅ PedidoEntregaService.java
5. ✅ PedidoEntregaController.java

**Archivos Eliminados (innecesarios):** ~~PedidoEntregaId.java~~

---

**Documentado por:** GitHub Copilot  
**Fecha de corrección exitosa:** 2025-10-09 12:54:10  
**Tiempo de inicio:** 5.671 segundos  
**Estado:** ✅ COMPLETADO
