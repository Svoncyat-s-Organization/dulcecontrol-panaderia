package com.dulcecontrol.bakery.features.admin.configuracion.service.impl;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.DatosEmpresaResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.DatosEmpresaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.entity.ConfiguracionTienda;
import com.dulcecontrol.bakery.features.admin.configuracion.repository.ConfiguracionTiendaRepository;
import com.dulcecontrol.bakery.features.admin.configuracion.repository.DominioTiendaAdminRepository;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IDatosEmpresaService;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.DominioTienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Tienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.repository.TiendaRepository;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DatosEmpresaService implements IDatosEmpresaService {

    private final TiendaRepository tiendaRepository;
    private final ConfiguracionTiendaRepository configuracionTiendaRepository;
    private final DominioTiendaAdminRepository dominioTiendaRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public DatosEmpresaResponse obtenerPorTiendaId(Long tiendaId) {
        // Obtener datos de tienda
        Tienda tienda = tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Tienda no encontrada"));

        // Obtener configuración (puede no existir aún)
        ConfiguracionTienda configuracion = configuracionTiendaRepository.findByTiendaId(tiendaId)
                .orElse(null);

        // Obtener logo del dominio tienda virtual (puede no existir)
        String logoUrl = dominioTiendaRepository.findByTiendaIdAndTipoTiendaVirtual(tiendaId)
                .map(DominioTienda::getUrlLogo)
                .orElse(null);

        return toResponse(tienda, configuracion, logoUrl);
    }

    @Override
    @Transactional
    public DatosEmpresaResponse actualizar(Long tiendaId, DatosEmpresaUpdateRequest request) {
        // Actualizar Tienda
        Tienda tienda = tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Tienda no encontrada"));

        // Solo actualizar si hay cambios (para evitar constraint de hash_contrasena)
        boolean tiendaCambio = false;

        if (!request.getNumeroDoc().equals(tienda.getNumeroDoc())) {
            tienda.setNumeroDoc(request.getNumeroDoc());
            tiendaCambio = true;
        }
        if (!request.getNombreDoc().equals(tienda.getNombreDoc())) {
            tienda.setNombreDoc(request.getNombreDoc());
            tiendaCambio = true;
        }
        if (!request.getNombreComercial().equals(tienda.getNombreComercial())) {
            tienda.setNombreComercial(request.getNombreComercial());
            tiendaCambio = true;
        }
        if (!request.getCorreoContacto().equals(tienda.getCorreoContacto())) {
            tienda.setCorreoContacto(request.getCorreoContacto());
            tiendaCambio = true;
        }

        String telefonoRequest = request.getTelefonoContacto();
        String telefonoActual = tienda.getTelefonoContacto();
        boolean telefonosDiferentes = (telefonoRequest == null && telefonoActual != null) ||
                (telefonoRequest != null && !telefonoRequest.equals(telefonoActual));
        if (telefonosDiferentes) {
            tienda.setTelefonoContacto(telefonoRequest);
            tiendaCambio = true;
        }

        Tienda tiendaActualizada = tiendaCambio ? tiendaRepository.save(tienda) : tienda;

        // Actualizar o crear ConfiguracionTienda
        ConfiguracionTienda configuracion = configuracionTiendaRepository.findByTiendaId(tiendaId)
                .orElseGet(() -> {
                    ConfiguracionTienda nuevaConfig = new ConfiguracionTienda();
                    nuevaConfig.setTiendaId(tiendaId);
                    return nuevaConfig;
                });

        configuracion.setRuc(request.getNumeroDoc());
        configuracion.setRazonSocial(request.getNombreDoc());
        configuracion.setDireccionFiscal(request.getDireccionFiscal());
        configuracion.setUbigeoFiscal(request.getUbigeoFiscal());
        configuracion.setUsuarioSunatSol(request.getUsuarioSunatSol());

        // Solo encriptar y guardar si el usuario envió una nueva clave
        if (request.getClaveSunatSol() != null && !request.getClaveSunatSol().isBlank()) {
            String claveEncriptada = passwordEncoder.encode(request.getClaveSunatSol());
            configuracion.setClaveSunatSolEncriptada(claveEncriptada);
        }

        configuracion.setCertificadoDigitalUrl(request.getCertificadoDigitalUrl());
        if (request.getModoSunat() != null) {
            configuracion.setModoSunat(request.getModoSunat().toUpperCase());
        }
        configuracion.setTasaIgv(request.getTasaIgv());

        ConfiguracionTienda configuracionActualizada = configuracionTiendaRepository.save(configuracion);

        // Actualizar logo en DominioTienda si existe
        String logoUrl = request.getLogoUrl();
        if (logoUrl != null) {
            dominioTiendaRepository.findByTiendaIdAndTipoTiendaVirtual(tiendaId)
                    .ifPresent(dominio -> {
                        dominio.setUrlLogo(logoUrl);
                        dominioTiendaRepository.save(dominio);
                    });
        }

        return toResponse(tiendaActualizada, configuracionActualizada, logoUrl);
    }

    private DatosEmpresaResponse toResponse(Tienda tienda, ConfiguracionTienda configuracion, String logoUrl) {
        return DatosEmpresaResponse.builder()
                .tiendaId(tienda.getId())
                .numeroDoc(tienda.getNumeroDoc())
                .nombreDoc(tienda.getNombreDoc())
                .nombreComercial(tienda.getNombreComercial())
                .correoContacto(tienda.getCorreoContacto())
                .telefonoContacto(tienda.getTelefonoContacto())
                .direccionFiscal(configuracion != null ? configuracion.getDireccionFiscal() : null)
                .ubigeoFiscal(configuracion != null ? configuracion.getUbigeoFiscal() : null)
                .usuarioSunatSol(configuracion != null ? configuracion.getUsuarioSunatSol() : null)
                .certificadoDigitalUrl(configuracion != null ? configuracion.getCertificadoDigitalUrl() : null)
                .modoSunat(configuracion != null ? configuracion.getModoSunat() : "PRUEBAS")
                .tasaIgv(configuracion != null ? configuracion.getTasaIgv() : null)
                .logoUrl(logoUrl)
                .actualizadoEn(configuracion != null ? configuracion.getActualizadoEn() : tienda.getActualizadoEn())
                .build();
    }
}
