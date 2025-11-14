package com.dulcecontrol.bakery.features.admin.facturacion.service;

import com.dulcecontrol.bakery.features.admin.facturacion.dto.TiendaSerieRequest;
import com.dulcecontrol.bakery.features.admin.facturacion.dto.TiendaSerieResponse;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.TiendaSerie;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoComprobante;
import com.dulcecontrol.bakery.features.admin.facturacion.repository.TiendaSerieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TiendaSerieServiceImpl implements TiendaSerieService {

    private final TiendaSerieRepository tiendaSerieRepository;

    @Override
    @Transactional
    public TiendaSerieResponse crear(Long tiendaId, TiendaSerieRequest request) {
        // Validar que el tiendaId coincida
        if (!tiendaId.equals(request.getTiendaId())) {
            throw new IllegalArgumentException("El tiendaId de la URL no coincide con el tiendaId del request");
        }

        // Validar que no exista una serie activa con el mismo código en la tienda
        if (tiendaSerieRepository.existsByTiendaIdAndSerieAndActivaTrue(tiendaId, request.getSerie())) {
            throw new IllegalArgumentException("Ya existe una serie activa con el código: " + request.getSerie());
        }

        TiendaSerie serie = new TiendaSerie();
        serie.setTiendaId(tiendaId);
        serie.setSedeId(request.getSedeId());
        serie.setTipoComprobante(request.getTipoComprobante());
        serie.setSerie(request.getSerie());
        serie.setCorrelativoActual(request.getCorrelativoActual() != null ? request.getCorrelativoActual() : 0);
        serie.setEsElectronica(request.getEsElectronica() != null ? request.getEsElectronica() : Boolean.TRUE);
        serie.setActiva(request.getActiva() != null ? request.getActiva() : Boolean.TRUE);

        TiendaSerie saved = tiendaSerieRepository.save(serie);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TiendaSerieResponse obtenerPorIdYTienda(Long serieId, Long tiendaId) {
        TiendaSerie serie = tiendaSerieRepository.findByIdAndTiendaId(serieId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Serie no encontrada con id: " + serieId));
        return mapToResponse(serie);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaSerieResponse> listarPorTienda(Long tiendaId) {
        return tiendaSerieRepository.findByTiendaId(tiendaId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaSerieResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId) {
        return tiendaSerieRepository.findByTiendaIdAndSedeId(tiendaId, sedeId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaSerieResponse> listarActivasPorTienda(Long tiendaId) {
        return tiendaSerieRepository.findByTiendaIdAndActivaTrue(tiendaId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TiendaSerieResponse> listarActivasPorTiendaYTipo(Long tiendaId, TipoComprobante tipoComprobante) {
        return tiendaSerieRepository.findByTiendaIdAndTipoComprobanteAndActivaTrue(tiendaId, tipoComprobante)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TiendaSerieResponse actualizar(Long tiendaId, Long serieId, TiendaSerieRequest request) {
        TiendaSerie serie = tiendaSerieRepository.findByIdAndTiendaId(serieId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Serie no encontrada con id: " + serieId));

        // Validar que no exista otra serie activa con el mismo código en la tienda
        if (!serie.getSerie().equals(request.getSerie()) &&
                tiendaSerieRepository.existsByTiendaIdAndSerieAndActivaTrue(tiendaId, request.getSerie())) {
            throw new IllegalArgumentException("Ya existe una serie activa con el código: " + request.getSerie());
        }

        serie.setSedeId(request.getSedeId());
        serie.setTipoComprobante(request.getTipoComprobante());
        serie.setSerie(request.getSerie());
        serie.setCorrelativoActual(request.getCorrelativoActual());
        serie.setEsElectronica(request.getEsElectronica());
        serie.setActiva(request.getActiva());

        TiendaSerie updated = tiendaSerieRepository.save(serie);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void desactivar(Long tiendaId, Long serieId) {
        TiendaSerie serie = tiendaSerieRepository.findByIdAndTiendaId(serieId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Serie no encontrada con id: " + serieId));
        serie.setActiva(Boolean.FALSE);
        tiendaSerieRepository.save(serie);
    }

    @Override
    @Transactional
    public void activar(Long tiendaId, Long serieId) {
        TiendaSerie serie = tiendaSerieRepository.findByIdAndTiendaId(serieId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Serie no encontrada con id: " + serieId));

        // Validar que no exista otra serie activa con el mismo código en la tienda
        if (tiendaSerieRepository.existsByTiendaIdAndSerieAndActivaTrue(tiendaId, serie.getSerie())) {
            throw new IllegalArgumentException("Ya existe una serie activa con el código: " + serie.getSerie());
        }

        serie.setActiva(Boolean.TRUE);
        tiendaSerieRepository.save(serie);
    }

    @Override
    @Transactional
    public Integer incrementarCorrelativo(Long tiendaId, Long serieId) {
        TiendaSerie serie = tiendaSerieRepository.findByIdAndTiendaId(serieId, tiendaId)
                .orElseThrow(() -> new IllegalArgumentException("Serie no encontrada con id: " + serieId));

        if (!serie.getActiva()) {
            throw new IllegalArgumentException("No se puede incrementar el correlativo de una serie inactiva");
        }

        Integer nuevoCorrelativo = serie.getCorrelativoActual() + 1;
        serie.setCorrelativoActual(nuevoCorrelativo);
        tiendaSerieRepository.save(serie);

        return nuevoCorrelativo;
    }

    private TiendaSerieResponse mapToResponse(TiendaSerie serie) {
        TiendaSerieResponse response = new TiendaSerieResponse();
        response.setId(serie.getId());
        response.setTiendaId(serie.getTiendaId());
        response.setSedeId(serie.getSedeId());
        response.setTipoComprobante(serie.getTipoComprobante());
        response.setSerie(serie.getSerie());
        response.setCorrelativoActual(serie.getCorrelativoActual());
        response.setEsElectronica(serie.getEsElectronica());
        response.setActiva(serie.getActiva());
        response.setCreadoEn(serie.getCreadoEn());
        return response;
    }
}
