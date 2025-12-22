package com.dulcecontrol.bakery.features.admin.seguridad.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dulcecontrol.bakery.features.admin.seguridad.entity.Rol;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.PermisoRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.RolPermisoRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.RolRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RolSistemaBootstrapService {

    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;
    private final RolPermisoRepository rolPermisoRepository;

    private static final List<RoleTemplate> DEFAULT_ROLE_TEMPLATES = List.of(
            RoleTemplate.allAccess("Administrador", "Acceso total al sistema"),
            RoleTemplate.includeAllExcept(
                    "Gerente",
                    "Gestión de operaciones y reportes",
                    List.of("config.%", "usuarios.%")
            ),
            RoleTemplate.includeOnly(
                    "Vendedor",
                    "Registro de ventas y atención al cliente",
                    List.of(
                            "dashboard.view",
                            "clientes.%",
                            "productos.view",
                            "ventas.%",
                            "pedidos.%",
                            "caja.%"
                    )
            ),
            RoleTemplate.includeOnly(
                    "Maestro Panadero",
                    "Gestión de producción y recetas",
                    List.of(
                            "dashboard.view",
                            "productos.view",
                            "produccion.%",
                            "recetas.%",
                            "inventario.view",
                            "reportes.produccion"
                    )
            ),
            RoleTemplate.includeOnly(
                    "Almacenero",
                    "Gestión de inventario y compras",
                    List.of(
                            "dashboard.view",
                            "insumos.%",
                            "compras.%",
                            "proveedores.%",
                            "inventario.%",
                            "reportes.inventario"
                    )
            )
    );

    @Transactional
    public void ensureDefaultRoles(Long tiendaId) {
        if (tiendaId == null) {
            return;
        }

        Map<String, Rol> existentes = rolRepository.findByTiendaId(tiendaId)
                .stream()
                .collect(Collectors.toMap(
                        rol -> normalizeKey(rol.getNombre()),
                        Function.identity(),
                        (current, duplicate) -> current
                ));

        boolean todasPlantillasCreadas = DEFAULT_ROLE_TEMPLATES.stream()
                .allMatch(template -> existentes.containsKey(template.key()));

        if (todasPlantillasCreadas) {
            return;
        }

        List<PermisoSnapshot> permisos = permisoRepository.findAll()
                .stream()
                .map(permiso -> new PermisoSnapshot(permiso.getId(), permiso.getSlug()))
                .toList();

        for (RoleTemplate template : DEFAULT_ROLE_TEMPLATES) {
            if (existentes.containsKey(template.key())) {
                continue;
            }

            Rol nuevoRol = new Rol();
            nuevoRol.setTiendaId(tiendaId);
            nuevoRol.setNombre(template.nombre());
            nuevoRol.setDescripcion(template.descripcion());
            nuevoRol.setEsSistema(template.esSistema());

            Rol guardado = rolRepository.save(nuevoRol);
            Set<Long> permisosAsignados = template.resolvePermisos(permisos);
            permisosAsignados.forEach(permisoId -> rolPermisoRepository.insertarRelacion(guardado.getId(), permisoId));
        }
    }

    private static String normalizeKey(String value) {
        return Optional.ofNullable(value)
                .map(nombre -> nombre.trim().toLowerCase(Locale.ROOT))
                .orElse("");
    }

    private record PermisoSnapshot(Long id, String slug) { }

    private record RoleTemplate(
            String nombre,
            String descripcion,
            boolean esSistema,
            boolean includeAll,
            List<String> includePatterns,
            List<String> excludePatterns
    ) {

        private static RoleTemplate allAccess(String nombre, String descripcion) {
            return new RoleTemplate(nombre, descripcion, true, true, List.of(), List.of());
        }

        private static RoleTemplate includeAllExcept(String nombre, String descripcion, List<String> excludePatterns) {
            return new RoleTemplate(nombre, descripcion, true, true, List.of(), excludePatterns);
        }

        private static RoleTemplate includeOnly(String nombre, String descripcion, List<String> includePatterns) {
            return new RoleTemplate(nombre, descripcion, true, false, includePatterns, List.of());
        }

        private String key() {
            return normalizeKey(nombre);
        }

        private Set<Long> resolvePermisos(List<PermisoSnapshot> permisosCatalogo) {
            if (includeAll) {
                return permisosCatalogo.stream()
                        .filter(snapshot -> !matchesAny(snapshot.slug(), excludePatterns))
                        .map(PermisoSnapshot::id)
                        .collect(Collectors.toCollection(LinkedHashSet::new));
            }

            if (includePatterns == null || includePatterns.isEmpty()) {
                return Set.of();
            }

            return permisosCatalogo.stream()
                    .filter(snapshot -> matchesAny(snapshot.slug(), includePatterns))
                    .map(PermisoSnapshot::id)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
        }
    }

    private static boolean matchesAny(String slug, List<String> patterns) {
        if (slug == null || patterns == null || patterns.isEmpty()) {
            return false;
        }

        for (String pattern : patterns) {
            if (matchesPattern(slug, pattern)) {
                return true;
            }
        }
        return false;
    }

    private static boolean matchesPattern(String rawSlug, String rawPattern) {
        if (rawSlug == null || rawPattern == null) {
            return false;
        }

        String slug = rawSlug.trim().toLowerCase(Locale.ROOT);
        String pattern = rawPattern.trim().toLowerCase(Locale.ROOT);

        if (pattern.isEmpty()) {
            return false;
        }

        int wildcardIndex = pattern.indexOf('%');
        if (wildcardIndex >= 0) {
            String prefix = pattern.substring(0, wildcardIndex);
            return slug.startsWith(prefix);
        }

        return slug.equals(pattern);
    }
}
