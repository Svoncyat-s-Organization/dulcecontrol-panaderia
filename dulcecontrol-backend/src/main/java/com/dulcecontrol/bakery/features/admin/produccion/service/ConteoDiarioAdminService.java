package com.dulcecontrol.bakery.features.admin.produccion.service;

import com.dulcecontrol.bakery.features.admin.produccion.dto.*;
import com.dulcecontrol.bakery.features.admin.produccion.entity.ConteoDiario;
import com.dulcecontrol.bakery.features.admin.produccion.entity.DetalleConteoDiario;
import com.dulcecontrol.bakery.features.admin.produccion.repository.ConteoDiarioRepository;
import com.dulcecontrol.bakery.features.admin.produccion.repository.DetalleConteoDiarioRepository;
import com.dulcecontrol.bakery.features.shared.catalogo.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConteoDiarioAdminService {

    private final ConteoDiarioRepository conteoRepository;
    private final DetalleConteoDiarioRepository detalleRepository;
    private final ProductoRepository productoRepository;

    @Transactional
    public ConteoDiarioResponse createConteo(Long tiendaId, ConteoDiarioCreateRequest request) {
        // Check if conteo already exists for this sede and fecha
        Optional<ConteoDiario> existing = conteoRepository.findBySedeIdAndFechaConteo(
                request.getSedeId(),
                request.getFechaConteo()
        );

        ConteoDiario conteo;
        if (existing.isPresent()) {
            // Update existing conteo
            conteo = existing.get();
            conteo.setResponsableId(request.getResponsableId());
            conteo.setObservaciones(request.getObservaciones());
            
            // Delete old detalles
            detalleRepository.deleteByConteoId(conteo.getId());
        } else {
            // Create new conteo
            conteo = new ConteoDiario();
            conteo.setTiendaId(tiendaId);
            conteo.setSedeId(request.getSedeId());
            conteo.setFechaConteo(request.getFechaConteo());
            conteo.setResponsableId(request.getResponsableId());
            conteo.setObservaciones(request.getObservaciones());
            conteo = conteoRepository.save(conteo);
        }

        // Create new detalles
        final Long conteoId = conteo.getId();
        List<DetalleConteoDiario> detalles = request.getDetalles().stream()
                .map(item -> {
                    DetalleConteoDiario detalle = new DetalleConteoDiario();
                    detalle.setConteoId(conteoId);
                    detalle.setProductoId(item.getProductoId());
                    detalle.setCantidadFisica(item.getCantidadFisica());
                    detalle.setCantidadSistema(item.getCantidadSistema());
                    return detalle;
                })
                .collect(Collectors.toList());

        detalleRepository.saveAll(detalles);

        return toResponse(conteo, detalles);
    }

    @Transactional(readOnly = true)
    public List<ConteoDiarioResponse> listConteosBySedeId(Long tiendaId, Long sedeId) {
        List<ConteoDiario> conteos = conteoRepository.findByTiendaIdAndSedeIdOrderByFechaConteoDesc(tiendaId, sedeId);
        
        return conteos.stream()
                .map(conteo -> {
                    List<DetalleConteoDiario> detalles = detalleRepository.findByConteoIdOrderByIdAsc(conteo.getId());
                    return toResponse(conteo, detalles);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ConteoDiarioResponse> getConteoBySedeAndFecha(Long tiendaId, Long sedeId, java.time.LocalDate fecha) {
        return conteoRepository.findBySedeIdAndFechaConteo(sedeId, fecha)
                .map(conteo -> {
                    List<DetalleConteoDiario> detalles = detalleRepository.findByConteoIdOrderByIdAsc(conteo.getId());
                    return toResponse(conteo, detalles);
                });
    }

    private ConteoDiarioResponse toResponse(ConteoDiario conteo, List<DetalleConteoDiario> detalles) {
        // Get producto names
        List<Long> productoIds = detalles.stream()
                .map(DetalleConteoDiario::getProductoId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, String> productoNames = productoRepository.findAllById(productoIds)
                .stream()
                .collect(Collectors.toMap(
                        p -> p.getId(),
                        p -> p.getNombre(),
                        (a, b) -> a
                ));

        ConteoDiarioResponse response = new ConteoDiarioResponse();
        response.setId(conteo.getId());
        response.setTiendaId(conteo.getTiendaId());
        response.setSedeId(conteo.getSedeId());
        response.setFechaConteo(conteo.getFechaConteo());
        response.setResponsableId(conteo.getResponsableId());
        response.setObservaciones(conteo.getObservaciones());
        response.setCreadoEn(conteo.getCreadoEn());

        List<DetalleConteoDiarioResponse> detalleResponses = detalles.stream()
                .map(detalle -> {
                    DetalleConteoDiarioResponse dr = new DetalleConteoDiarioResponse();
                    dr.setId(detalle.getId());
                    dr.setProductoId(detalle.getProductoId());
                    dr.setProductoNombre(productoNames.get(detalle.getProductoId()));
                    dr.setCantidadFisica(detalle.getCantidadFisica());
                    dr.setCantidadSistema(detalle.getCantidadSistema());
                    dr.setDiferencia(detalle.getDiferencia());
                    return dr;
                })
                .collect(Collectors.toList());

        response.setDetalles(detalleResponses);
        return response;
    }
}
