package com.dulcecontrol.bakery.features.shared.ubigeo.service;

import com.dulcecontrol.bakery.features.shared.ubigeo.dto.DepartamentoResponse;
import com.dulcecontrol.bakery.features.shared.ubigeo.dto.DistritoResponse;
import com.dulcecontrol.bakery.features.shared.ubigeo.dto.ProvinciaResponse;
import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoDepartamento;
import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoDistrito;
import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoProvincia;
import com.dulcecontrol.bakery.features.shared.ubigeo.repository.UbigeoDepartamentoRepository;
import com.dulcecontrol.bakery.features.shared.ubigeo.repository.UbigeoDistritoRepository;
import com.dulcecontrol.bakery.features.shared.ubigeo.repository.UbigeoProvinciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UbigeoService implements IUbigeoService {

    private final UbigeoDepartamentoRepository departamentoRepository;
    private final UbigeoProvinciaRepository provinciaRepository;
    private final UbigeoDistritoRepository distritoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DepartamentoResponse> obtenerDepartamentos() {
        return departamentoRepository.findAll().stream()
                .map(this::mapToDepartamentoResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProvinciaResponse> obtenerProvinciasPorDepartamento(Long departamentoId) {
        return provinciaRepository.findByDepartamentoIdOrderByNombreAsc(departamentoId).stream()
                .map(this::mapToProvinciaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DistritoResponse> obtenerDistritosPorProvincia(Long provinciaId) {
        return distritoRepository.findByProvinciaIdOrderByNombreAsc(provinciaId).stream()
                .map(this::mapToDistritoResponse)
                .collect(Collectors.toList());
    }

    private DepartamentoResponse mapToDepartamentoResponse(UbigeoDepartamento departamento) {
        return DepartamentoResponse.builder()
                .id(departamento.getId())
                .nombre(departamento.getNombre())
                .codigoUbigeo(departamento.getCodigoUbigeo())
                .build();
    }

    private ProvinciaResponse mapToProvinciaResponse(UbigeoProvincia provincia) {
        return ProvinciaResponse.builder()
                .id(provincia.getId())
                .departamentoId(provincia.getDepartamento().getId())
                .nombre(provincia.getNombre())
                .codigoUbigeo(provincia.getCodigoUbigeo())
                .build();
    }

    private DistritoResponse mapToDistritoResponse(UbigeoDistrito distrito) {
        return DistritoResponse.builder()
                .id(distrito.getId())
                .provinciaId(distrito.getProvincia().getId())
                .nombre(distrito.getNombre())
                .codigoUbigeo(distrito.getCodigoUbigeo())
                .build();
    }
}
