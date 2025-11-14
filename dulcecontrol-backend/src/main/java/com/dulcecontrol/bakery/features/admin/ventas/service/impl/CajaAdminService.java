package com.dulcecontrol.bakery.features.admin.ventas.service.impl;

import com.dulcecontrol.bakery.features.admin.ventas.dto.CajaCreateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.dto.CajaResponse;
import com.dulcecontrol.bakery.features.admin.ventas.dto.CajaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.entity.Caja;
import com.dulcecontrol.bakery.features.admin.ventas.repository.CajaRepository;
import com.dulcecontrol.bakery.features.admin.ventas.service.ICajaAdminService;
import com.dulcecontrol.bakery.features.admin.ventas.service.helper.VentasTenantValidator;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CajaAdminService implements ICajaAdminService {

    private final CajaRepository cajaRepository;
    private final VentasTenantValidator tenantValidator;

    @Override
    @Transactional(readOnly = true)
    public List<CajaResponse> listar(Long tiendaId, Long sedeId) {
        List<Caja> cajas;
        if (sedeId != null) {
            tenantValidator.validarSedePerteneceATienda(tiendaId, sedeId);
            cajas = cajaRepository.findByTiendaIdAndSedeIdOrderByNombreAsc(tiendaId, sedeId);
        } else {
            cajas = cajaRepository.findByTiendaIdOrderByNombreAsc(tiendaId);
        }
        return cajas.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CajaResponse obtener(Long tiendaId, Long cajaId) {
        Caja caja = obtenerCaja(tiendaId, cajaId);
        return toResponse(caja);
    }

    @Override
    @Transactional
    public CajaResponse crear(Long tiendaId, CajaCreateRequest request) {
        if (cajaRepository.existsByTiendaIdAndNombreIgnoreCase(tiendaId, request.nombre())) {
            throw new BadRequestException("El nombre de la caja ya está registrado para la tienda");
        }

        tenantValidator.validarSedePerteneceATienda(tiendaId, request.sedeId());

        Caja caja = new Caja();
        caja.setTiendaId(tiendaId);
        caja.setSedeId(request.sedeId());
        caja.setNombre(request.nombre());
        caja.setActiva(request.activa() == null ? Boolean.TRUE : request.activa());

        Caja guardada = cajaRepository.save(caja);
        return toResponse(guardada);
    }

    @Override
    @Transactional
    public CajaResponse actualizar(Long tiendaId, Long cajaId, CajaUpdateRequest request) {
        Caja caja = obtenerCaja(tiendaId, cajaId);

        if (cajaRepository.existsByTiendaIdAndNombreIgnoreCaseAndIdNot(tiendaId, request.nombre(), cajaId)) {
            throw new BadRequestException("El nombre de la caja ya está registrado para la tienda");
        }

        tenantValidator.validarSedePerteneceATienda(tiendaId, request.sedeId());

        caja.setSedeId(request.sedeId());
        caja.setNombre(request.nombre());
        if (request.activa() != null) {
            caja.setActiva(request.activa());
        }

        Caja actualizada = cajaRepository.save(caja);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long cajaId) {
        Caja caja = obtenerCaja(tiendaId, cajaId);
        cajaRepository.delete(caja);
    }

    private Caja obtenerCaja(Long tiendaId, Long cajaId) {
        return cajaRepository.findByIdAndTiendaId(cajaId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Caja no encontrada"));
    }

    private CajaResponse toResponse(Caja caja) {
        return CajaResponse.builder()
                .id(caja.getId())
                .tiendaId(caja.getTiendaId())
                .sedeId(caja.getSedeId())
                .nombre(caja.getNombre())
                .activa(caja.getActiva())
                .creadoEn(caja.getCreadoEn())
                .build();
    }
}
