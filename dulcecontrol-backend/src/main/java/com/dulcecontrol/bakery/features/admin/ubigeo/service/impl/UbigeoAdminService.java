package com.dulcecontrol.bakery.features.admin.ubigeo.service.impl;

import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoDepartamentoResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoDistritoResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoProvinciaResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoRutaResponse;
import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoDepartamento;
import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoDistrito;
import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoProvincia;
import com.dulcecontrol.bakery.features.shared.ubigeo.repository.UbigeoDepartamentoRepository;
import com.dulcecontrol.bakery.features.shared.ubigeo.repository.UbigeoDistritoRepository;
import com.dulcecontrol.bakery.features.shared.ubigeo.repository.UbigeoProvinciaRepository;
import com.dulcecontrol.bakery.features.admin.ubigeo.service.IUbigeoAdminService;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UbigeoAdminService implements IUbigeoAdminService {

    private final UbigeoDepartamentoRepository departamentoRepository;
    private final UbigeoProvinciaRepository provinciaRepository;
    private final UbigeoDistritoRepository distritoRepository;

    @Override
    public List<UbigeoDepartamentoResponse> listarDepartamentos() {
        return departamentoRepository.findAllByOrderByNombreAsc()
                .stream()
                .map(UbigeoDepartamentoResponse::fromEntity)
                .toList();
    }

    @Override
    public List<UbigeoProvinciaResponse> listarProvinciasPorDepartamento(Long departamentoId) {
        return provinciaRepository.findByDepartamentoIdOrderByNombreAsc(departamentoId)
                .stream()
                .map(UbigeoProvinciaResponse::fromEntity)
                .toList();
    }

    @Override
    public List<UbigeoDistritoResponse> listarDistritosPorProvincia(Long provinciaId) {
        return distritoRepository.findByProvinciaIdOrderByNombreAsc(provinciaId)
                .stream()
                .map(UbigeoDistritoResponse::fromEntity)
                .toList();
    }

    @Override
    public UbigeoRutaResponse obtenerRutaPorDistrito(Long distritoId) {
        UbigeoDistrito distrito = distritoRepository.findById(distritoId)
                .orElseThrow(() -> new ResourceNotFoundException("Distrito no encontrado"));

        UbigeoProvincia provincia = provinciaRepository.findById(distrito.getProvincia().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Provincia no encontrada para el distrito"));

        UbigeoDepartamento departamento = departamentoRepository.findById(provincia.getDepartamento().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado para la provincia"));

        return UbigeoRutaResponse.builder()
                .departamento(UbigeoDepartamentoResponse.fromEntity(departamento))
                .provincia(UbigeoProvinciaResponse.fromEntity(provincia))
                .distrito(UbigeoDistritoResponse.fromEntity(distrito))
                .build();
    }
}
