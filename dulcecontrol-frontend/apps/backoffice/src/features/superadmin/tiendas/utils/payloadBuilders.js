const trimValue = (value) => {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed === '' ? undefined : trimmed;
    }
    return value;
};

const normalizeSlug = (value) => {
    const trimmed = trimValue(value);
    if (!trimmed) {
        return trimmed;
    }

    const asciiOnly = trimmed
        .normalize('NFD')
        .replace(/[^\p{ASCII}]/gu, '')
        .toLowerCase();

    return asciiOnly
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const sanitizeObject = (payload) => (
    Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
    )
);

export const buildTiendaCreatePayload = (formData) => sanitizeObject({
    slug: normalizeSlug(formData.slug),
    tipoDoc: formData.tipoDoc,
    numeroDoc: trimValue(formData.numeroDoc),
    nombreDoc: trimValue(formData.nombreDoc),
    nombreComercial: trimValue(formData.nombreComercial) ?? null,
    correoContacto: trimValue(formData.correoContacto),
    telefonoContacto: trimValue(formData.telefonoContacto) ?? null,
    contrasena: trimValue(formData.contrasena),
    estado: formData.estado,
});

export const buildTiendaUpdatePayload = (formData) => sanitizeObject({
    slug: normalizeSlug(formData.slug),
    tipoDoc: formData.tipoDoc,
    numeroDoc: trimValue(formData.numeroDoc),
    nombreDoc: trimValue(formData.nombreDoc),
    nombreComercial: trimValue(formData.nombreComercial) ?? null,
    correoContacto: trimValue(formData.correoContacto),
    telefonoContacto: trimValue(formData.telefonoContacto) ?? null,
    estado: formData.estado,
    nuevaContrasena: trimValue(formData.nuevaContrasena),
});

export const buildSedePayload = (formData, { includeActivo = false } = {}) => sanitizeObject({
    codigoInterno: trimValue(formData.codigoInterno) ?? null,
    nombre: trimValue(formData.nombre),
    direccion: trimValue(formData.direccion),
    telefono: trimValue(formData.telefono) ?? null,
    distritoId: formData.distritoId || null,
    esPrincipal: Boolean(formData.esPrincipal),
    activo: includeActivo ? Boolean(formData.activo) : undefined,
});

export const buildDominioPayload = (formData) => sanitizeObject({
    tipo: formData.tipo,
    urlDominio: trimValue(formData.urlDominio),
    urlLogo: trimValue(formData.urlLogo) ?? null,
    urlFavicon: trimValue(formData.urlFavicon) ?? null,
    colorPrimario: formData.colorPrimario,
    colorSecundario: formData.colorSecundario,
});

export const buildUsuarioCreatePayload = (formData) => sanitizeObject({
    rolId: formData.rolId,
    correo: trimValue(formData.correo),
    contrasena: trimValue(formData.contrasena),
    tipoDoc: formData.tipoDoc,
    numeroDoc: trimValue(formData.numeroDoc),
    nombres: trimValue(formData.nombres),
    telefono: trimValue(formData.telefono) ?? null,
    activo: formData.activo ?? true,
});

export const buildUsuarioUpdatePayload = (formData) => sanitizeObject({
    rolId: formData.rolId,
    correo: trimValue(formData.correo),
    tipoDoc: formData.tipoDoc,
    numeroDoc: trimValue(formData.numeroDoc),
    nombres: trimValue(formData.nombres),
    telefono: trimValue(formData.telefono) ?? null,
    activo: formData.activo,
    nuevaContrasena: trimValue(formData.nuevaContrasena),
});
