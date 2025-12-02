export const mapConfiguracionTiendaResponse = (configuracion) => {
  return {
    tiendaId: configuracion.tiendaId,
    ruc: configuracion.ruc,
    razonSocial: configuracion.razonSocial,
    direccionFiscal: configuracion.direccionFiscal,
    ubigeoFiscal: configuracion.ubigeoFiscal,
    usuarioSunatSol: configuracion.usuarioSunatSol,
    claveSunatSolEncriptada: configuracion.claveSunatSolEncriptada,
    certificadoDigitalUrl: configuracion.certificadoDigitalUrl,
    modoSunat: configuracion.modoSunat,
    tasaIgv: configuracion.tasaIgv,
    apiKeyYape: configuracion.apiKeyYape,
    apiKeyPlin: configuracion.apiKeyPlin,
    merchantIdNiubiz: configuracion.merchantIdNiubiz,
    bannerPrincipalUrl: configuracion.bannerPrincipalUrl,
    mensajeBienvenida: configuracion.mensajeBienvenida,
    horarioAtencion: configuracion.horarioAtencion,
    redesSociales: configuracion.redesSociales,
    politicasEnvio: configuracion.politicasEnvio,
    politicasDevolucion: configuracion.politicasDevolucion,
    emailNotificaciones: configuracion.emailNotificaciones,
    telegramBotToken: configuracion.telegramBotToken,
    telegramChatId: configuracion.telegramChatId,
    actualizadoEn: configuracion.actualizadoEn,
  };
};

export const mapPaginasStorefrontResponse = (paginas) => {
  return paginas.map(pagina => ({
    id: pagina.id,
    tiendaId: pagina.tiendaId,
    slug: pagina.slug,
    titulo: pagina.titulo,
    contenido: pagina.contenido,
    metaDescripcion: pagina.metaDescripcion,
    ordenMenu: pagina.ordenMenu,
    visibleEnMenu: pagina.visibleEnMenu,
    activa: pagina.activa,
    creadoEn: pagina.creadoEn,
    actualizadoEn: pagina.actualizadoEn,
  }));
};

export const mapPaginaStorefrontResponse = (pagina) => {
  return {
    id: pagina.id,
    tiendaId: pagina.tiendaId,
    slug: pagina.slug,
    titulo: pagina.titulo,
    contenido: pagina.contenido,
    metaDescripcion: pagina.metaDescripcion,
    ordenMenu: pagina.ordenMenu,
    visibleEnMenu: pagina.visibleEnMenu,
    activa: pagina.activa,
    creadoEn: pagina.creadoEn,
    actualizadoEn: pagina.actualizadoEn,
  };
};