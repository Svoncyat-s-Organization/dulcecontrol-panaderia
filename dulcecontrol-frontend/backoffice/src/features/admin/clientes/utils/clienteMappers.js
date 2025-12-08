export const mapClientesResponse = (clientes) => {
  return clientes.map(cliente => ({
    id: cliente.id,
    tiendaId: cliente.tiendaId,
    tipoDoc: cliente.tipoDoc,
    numeroDoc: cliente.numeroDoc,
    nombreDoc: cliente.nombreDoc,
    email: cliente.email,
    telefono: cliente.telefono,
    esUsuarioVirtual: cliente.esUsuarioVirtual,
    notas: cliente.notas,
    activo: cliente.activo,
    creadoEn: cliente.creadoEn,
    actualizadoEn: cliente.actualizadoEn,
  }));
};

export const mapClienteResponse = (cliente) => {
  return {
    id: cliente.id,
    tiendaId: cliente.tiendaId,
    tipoDoc: cliente.tipoDoc,
    numeroDoc: cliente.numeroDoc,
    nombreDoc: cliente.nombreDoc,
    email: cliente.email,
    telefono: cliente.telefono,
    esUsuarioVirtual: cliente.esUsuarioVirtual,
    hashContrasena: cliente.hashContrasena,
    notas: cliente.notas,
    activo: cliente.activo,
    creadoEn: cliente.creadoEn,
    actualizadoEn: cliente.actualizadoEn,
  };
};

export const mapDireccionesClienteResponse = (direcciones) => {
  return direcciones.map(direccion => ({
    id: direccion.id,
    clienteId: direccion.clienteId,
    etiqueta: direccion.etiqueta,
    direccionCompleta: direccion.direccionCompleta,
    referencia: direccion.referencia,
    distritoId: direccion.distritoId,
    codigoPostal: direccion.codigoPostal,
    esFiscal: direccion.esFiscal,
    esEntrega: direccion.esEntrega,
    creadoEn: direccion.creadoEn,
  }));
};

export const mapDireccionClienteResponse = (direccion) => {
  return {
    id: direccion.id,
    clienteId: direccion.clienteId,
    etiqueta: direccion.etiqueta,
    direccionCompleta: direccion.direccionCompleta,
    referencia: direccion.referencia,
    distritoId: direccion.distritoId,
    codigoPostal: direccion.codigoPostal,
    esFiscal: direccion.esFiscal,
    esEntrega: direccion.esEntrega,
    creadoEn: direccion.creadoEn,
  };
};