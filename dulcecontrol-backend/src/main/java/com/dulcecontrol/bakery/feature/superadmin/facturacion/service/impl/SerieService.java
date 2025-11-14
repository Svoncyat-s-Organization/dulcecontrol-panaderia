package com.dulcecontrol.bakery.feature.superadmin.facturacion.service.impl;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.dto.SerieCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.dto.SerieResponse;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.dto.SerieUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.Serie;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.repository.SerieRepository;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.service.ISerieService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SerieService implements ISerieService {

    private final SerieRepository serieRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SerieResponse> listar() {
        return serieRepository.findByActivoTrueOrderBySerieAsc().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SerieResponse obtener(Integer id) {
        Serie serie = serieRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Serie no encontrada"));
        return toResponse(serie);
    }

    @Override
    @Transactional
    public SerieResponse crear(SerieCreateRequest request) {
        if (serieRepository.findBySerie(request.getSerie()).isPresent()) {
            throw new BadRequestException("La serie ya existe");
        }
        Serie serie = new Serie();
        serie.setTiposComprobante(request.getTiposComprobante());
        serie.setSerie(request.getSerie());
        serie.setEsPredeterminada(Boolean.TRUE.equals(request.getEsPredeterminada()));
        Serie guardada = serieRepository.save(serie);
        return toResponse(guardada);
    }

    @Override
    @Transactional
    public SerieResponse actualizar(Integer id, SerieUpdateRequest request) {
        Serie serie = serieRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Serie no encontrada"));
        if (request.getUltimoCorrelativo() != null) {
            serie.setUltimoCorrelativo(request.getUltimoCorrelativo());
        }
        if (request.getActivo() != null) {
            serie.setActivo(request.getActivo());
        }
        if (request.getEsPredeterminada() != null) {
            serie.setEsPredeterminada(request.getEsPredeterminada());
        }
        Serie actualizada = serieRepository.save(serie);
        return toResponse(actualizada);
    }

    @Override
    @Transactional
    public void eliminar(Integer id) {
        Serie serie = serieRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Serie no encontrada"));
        serie.setActivo(Boolean.FALSE);
        serieRepository.save(serie);
    }

    private SerieResponse toResponse(Serie s) {
        return SerieResponse.builder()
                .id(s.getId())
                .tiposComprobante(s.getTiposComprobante())
                .serie(s.getSerie())
                .ultimoCorrelativo(s.getUltimoCorrelativo())
                .activo(s.getActivo())
                .esPredeterminada(s.getEsPredeterminada())
                .creadoEn(s.getCreadoEn())
                .actualizadoEn(s.getActualizadoEn())
                .build();
    }
}