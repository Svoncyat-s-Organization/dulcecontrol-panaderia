package com.dulcecontrol.bakery.feature.admin.ventas.service.impl;

import com.dulcecontrol.bakery.feature.admin.ventas.dto.SesionCajaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.SesionCajaResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.SesionCajaUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.SesionCaja;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.CajaRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.repository.SesionCajaRepository;
import com.dulcecontrol.bakery.feature.admin.ventas.service.ISesionCajaAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SesionCajaAdminService implements ISesionCajaAdminService {

    private final SesionCajaRepository sesionCajaRepository;
    private final CajaRepository cajaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SesionCajaResponse> listar(Long tiendaId, Long cajaId, Boolean estaAbierta) {
        List<SesionCaja> sesiones;
        if (cajaId != null && estaAbierta != null) {
            validarCajaPerteneceATienda(tiendaId, cajaId);
            sesiones = sesionCajaRepository.findByTiendaIdAndCajaIdAndEstaAbiertaOrderByFechaAperturaDesc(tiendaId, cajaId, estaAbierta);
        } else if (cajaId != null) {
            validarCajaPerteneceATienda(tiendaId, cajaId);
            sesiones = sesionCajaRepository.findByTiendaIdAndCajaIdOrderByFechaAperturaDesc(tiendaId, cajaId);
        } else if (estaAbierta != null) {
            sesiones = sesionCajaRepository.findByTiendaIdAndEstaAbiertaOrderByFechaAperturaDesc(tiendaId, estaAbierta);
        } else {
            sesiones = sesionCajaRepository.findByTiendaIdOrderByFechaAperturaDesc(tiendaId);
        }
        return sesiones.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SesionCajaResponse obtener(Long tiendaId, Long sesionId) {
        SesionCaja sesionCaja = obtenerSesion(tiendaId, sesionId);
        return toResponse(sesionCaja);
    }

    @Override
    @Transactional
    public SesionCajaResponse crear(Long tiendaId, SesionCajaCreateRequest request) {
        validarCajaPerteneceATienda(tiendaId, request.cajaId());

        SesionCaja sesionCaja = new SesionCaja();
        sesionCaja.setTiendaId(tiendaId);
        sesionCaja.setCajaId(request.cajaId());
        sesionCaja.setUsuarioAperturaId(request.usuarioAperturaId());
        sesionCaja.setUsuarioCierreId(request.usuarioCierreId());
        sesionCaja.setMontoInicialCentimos(request.montoInicialCentimos());
        sesionCaja.setMontoFinalEsperadoCentimos(request.montoFinalEsperadoCentimos());
        sesionCaja.setMontoFinalRealCentimos(request.montoFinalRealCentimos());
        sesionCaja.setFechaApertura(request.fechaApertura() != null ? request.fechaApertura() : LocalDateTime.now());
        sesionCaja.setFechaCierre(request.fechaCierre());
        sesionCaja.setEstaAbierta(request.estaAbierta() == null ? Boolean.TRUE : request.estaAbierta());

        SesionCaja guardada = sesionCajaRepository.save(sesionCaja);
        return toResponse(guardada);
    }

    @Override
    @Transactional
    public SesionCajaResponse actualizar(Long tiendaId, Long sesionId, SesionCajaUpdateRequest request) {
        SesionCaja sesionCaja = obtenerSesion(tiendaId, sesionId);

        if (!sesionCaja.getCajaId().equals(request.cajaId())) {
            validarCajaPerteneceATienda(tiendaId, request.cajaId());
            sesionCaja.setCajaId(request.cajaId());
        }

        if (request.montoInicialCentimos() != null) {
            sesionCaja.setMontoInicialCentimos(request.montoInicialCentimos());
        }
        sesionCaja.setMontoFinalEsperadoCentimos(request.montoFinalEsperadoCentimos());
        sesionCaja.setMontoFinalRealCentimos(request.montoFinalRealCentimos());
        if (request.fechaApertura() != null) {
            sesionCaja.setFechaApertura(request.fechaApertura());
        }
        sesionCaja.setFechaCierre(request.fechaCierre());
        if (request.estaAbierta() != null) {
            sesionCaja.setEstaAbierta(request.estaAbierta());
        }
        sesionCaja.setUsuarioCierreId(request.usuarioCierreId());

        SesionCaja actualizada = sesionCajaRepository.save(sesionCaja);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long sesionId) {
        SesionCaja sesionCaja = obtenerSesion(tiendaId, sesionId);
        sesionCajaRepository.delete(sesionCaja);
    }

    private SesionCaja obtenerSesion(Long tiendaId, Long sesionId) {
        return sesionCajaRepository.findByIdAndTiendaId(sesionId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión de caja no encontrada"));
    }

    private void validarCajaPerteneceATienda(Long tiendaId, Long cajaId) {
        if (cajaId == null) {
            throw new BadRequestException("La caja es obligatoria para la sesión");
        }
        cajaRepository.findByIdAndTiendaId(cajaId, tiendaId)
                .orElseThrow(() -> new BadRequestException("La caja indicada no pertenece a la tienda"));
    }

    private SesionCajaResponse toResponse(SesionCaja sesionCaja) {
        return SesionCajaResponse.builder()
                .id(sesionCaja.getId())
                .tiendaId(sesionCaja.getTiendaId())
                .cajaId(sesionCaja.getCajaId())
                .usuarioAperturaId(sesionCaja.getUsuarioAperturaId())
                .usuarioCierreId(sesionCaja.getUsuarioCierreId())
                .montoInicialCentimos(sesionCaja.getMontoInicialCentimos())
        .montoFinalEsperadoCentimos(sesionCaja.getMontoFinalEsperadoCentimos())
        .montoFinalRealCentimos(sesionCaja.getMontoFinalRealCentimos())
        .diferenciaCentimos(sesionCaja.getDiferenciaCentimos() == null
            ? null
            : sesionCaja.getDiferenciaCentimos().longValue())
                .fechaApertura(sesionCaja.getFechaApertura())
                .fechaCierre(sesionCaja.getFechaCierre())
                .estaAbierta(sesionCaja.getEstaAbierta())
                .build();
    }
}
