package com.dulcecontrol.bakery.feature.admin.clientes.repository;

import com.dulcecontrol.bakery.feature.admin.clientes.entity.DireccionCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DireccionClienteRepository extends JpaRepository<DireccionCliente, Long> {

    List<DireccionCliente> findByClienteId(Long clienteId);

    Optional<DireccionCliente> findByIdAndClienteId(Long id, Long clienteId);

    List<DireccionCliente> findByClienteIdAndEsEntrega(Long clienteId, Boolean esEntrega);

    List<DireccionCliente> findByClienteIdAndEsFiscal(Long clienteId, Boolean esFiscal);
}