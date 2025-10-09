# 🔧 CORRECCIÓN DE ERRORES DE RUNTIME - Spring Boot

**Fecha**: 2025-10-09  
**Sesión**: Corrección de errores encontrados al ejecutar Spring Boot  
**Objetivo**: Identificar y corregir todos los errores de runtime para que la aplicación inicie correctamente

---

## 📋 ERRORES IDENTIFICADOS

### ❌ ERROR 1: PedidoEntrega - Composite-id sin equals() y hashCode()

**Severidad**: CRÍTICO ⚠️

**Log del Error**:

```
WARN org.hibernate.mapping.RootClass: HHH000038: Composite-id class does not override equals(): com.dulcecontrol.bakery.entity.PedidoEntrega
WARN org.hibernate.mapping.RootClass: HHH000039: Composite-id class does not override hashCode(): com.dulcecontrol.bakery.entity.PedidoEntrega
```

**Error de Inicio**:

```
Error creating bean with name 'pedidoEntregaRepository': This class [class com.dulcecontrol.bakery.entity.PedidoEntrega] does not define an IdClass
```

**Causa**:
`PedidoEntrega` usa un objeto (`Pedido`) como `@Id` en una relación `@OneToOne`. Hibernate lo interpreta como una clave compuesta y requiere que:

1. La entidad implemente `equals()` y `hashCode()` basados en el ID
2. O defina una clase `@IdClass`

**Entidad actual**:

```java
@Entity
@Table(name = "pedido_entrega", schema = "dulce_control")
public class PedidoEntrega implements Serializable {

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;
    // ... resto del código
}
```

**Solución**: Implementar `equals()` y `hashCode()` basados en `pedido`

**Estado**: ⏳ Pendiente de corrección

---

### ⚠️ ADVERTENCIA 2: Propiedad deprecada de JPA

**Severidad**: MENOR (Advertencia)

**Log del Error**:

```
WARN org.hibernate.orm.deprecation: HHH90000021: Encountered deprecated setting [javax.persistence.schema-generation.database.action], use [jakarta.persistence.schema-generation.database.action] instead
```

**Causa**:
En `application.properties` se usa la propiedad antigua de JPA:

```properties
spring.jpa.properties.javax.persistence.schema-generation.database.action=none
```

**Solución**: Cambiar a la propiedad Jakarta EE:

```properties
spring.jpa.properties.jakarta.persistence.schema-generation.database.action=none
```

**Estado**: ⏳ Pendiente de corrección

---

### ℹ️ INFORMACIÓN 3: PostgreSQLDialect especificado explícitamente

**Severidad**: INFORMATIVO (No crítico)

**Log del Error**:

```
WARN org.hibernate.orm.deprecation: HHH90000025: PostgreSQLDialect does not need to be specified explicitly using 'hibernate.dialect' (remove the property setting and it will be selected by default)
```

**Causa**:
Hibernate 6.x detecta automáticamente el dialecto de PostgreSQL, por lo que no es necesario especificarlo.

**Configuración actual**:

```properties
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

**Solución**: Opcionalmente se puede eliminar esta línea (Hibernate lo detectará automáticamente)

**Estado**: ⏳ Opcional - No afecta funcionalidad

---

## 🔨 CORRECCIONES APLICADAS

### ✅ CORRECCIÓN 1: PedidoEntrega - Implementar equals() y hashCode()

**Archivo**: `PedidoEntrega.java`

**Cambio aplicado**:

```java
@Entity
@Table(name = "pedido_entrega", schema = "dulce_control")
public class PedidoEntrega implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    // ... resto de campos ...

    // Implementación de equals() y hashCode() basados en el ID (pedido)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PedidoEntrega that = (PedidoEntrega) o;
        return pedido != null && pedido.equals(that.pedido);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // ... resto de getters y setters ...
}
```

**Razón**:

- Cuando una entidad usa un objeto como `@Id`, JPA lo trata como una clave compuesta
- `equals()` compara basándose en el `pedido` (el ID)
- `hashCode()` usa el hash de la clase para mantener consistencia (especialmente con proxies de Hibernate)
- Esto es la mejor práctica recomendada por Hibernate para entidades con relaciones `@OneToOne` usando `@Id`

**Estado**: ✅ APLICADO

---

### ✅ CORRECCIÓN 2: Actualizar propiedad deprecated de JPA

**Archivo**: `application.properties`

**Cambio aplicado**:

❌ Antes:

```properties
spring.jpa.properties.javax.persistence.schema-generation.database.action=none
```

✅ Después:

```properties
spring.jpa.properties.jakarta.persistence.schema-generation.database.action=none
```

**Razón**: Jakarta EE reemplazó el namespace `javax.persistence` con `jakarta.persistence` desde JPA 3.0

**Estado**: ✅ APLICADO

---

## 📊 RESUMEN DE CORRECCIONES

| #   | Problema                          | Archivo                  | Severidad | Estado                   |
| --- | --------------------------------- | ------------------------ | --------- | ------------------------ |
| 1   | PedidoEntrega sin equals/hashCode | `PedidoEntrega.java`     | CRÍTICO   | ✅ Corregido             |
| 2   | Propiedad JPA deprecada           | `application.properties` | MENOR     | ✅ Corregido             |
| 3   | PostgreSQLDialect explícito       | `application.properties` | INFO      | ⏸️ Mantenido (funcional) |

---

## ✅ VERIFICACIÓN POST-CORRECCIÓN

**Comando de verificación**:

```bash
./mvnw spring-boot:run
```

**Resultado esperado**:

- ✅ Sin errores de composite-id
- ✅ Sin advertencias de propiedades deprecadas
- ✅ Spring Boot inicia correctamente
- ✅ Flyway ejecuta migraciones
- ✅ Hibernate carga las 37 entidades
- ✅ Tomcat inicia en puerto 8080

---

## 📝 NOTAS ADICIONALES

### Sobre PedidoEntrega y claves compuestas:

`PedidoEntrega` tiene una estructura especial:

- Usa `Pedido` como su `@Id` (relación `@OneToOne` compartida)
- Esto significa que `pedido_entrega.pedido_id` ES la clave primaria de la tabla
- No tiene un ID propio generado automáticamente
- Por eso Hibernate requiere `equals()` y `hashCode()`

### Alternativa considerada (no aplicada):

Se podría haber creado una clase `PedidoEntregaId`, pero sería redundante ya que solo contendría un campo (`Pedido`). La solución actual con `equals()` y `hashCode()` es más limpia y es el patrón recomendado para relaciones `@OneToOne` con `@Id` compartido.

---

**Total de archivos modificados**: 2

1. ✅ `PedidoEntrega.java`
2. ✅ `application.properties`

**Estado final**: ⏳ PENDIENTE DE VERIFICACIÓN - Ejecutar aplicación nuevamente
