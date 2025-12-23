const DEFAULT_TIPO_DOC = 'RUC';
const DEFAULT_ESTADO = 'EN_PRUEBA';
const DEFAULT_NOMBRE_DOC = 'Nombre pendiente';

const trimValue = (value) => {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed === '' ? undefined : trimmed;
    }
    return value;
};

const safeNormalize = (text) => {
    if (!text || typeof text.normalize !== 'function') {
        return text;
    }
    return text.normalize('NFD');
};

const normalizeSlug = (value) => {
    const trimmed = trimValue(value);
    if (!trimmed) {
        return undefined;
    }
    return safeNormalize(trimmed)
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\x00-\x7F]+/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const sanitizeObject = (payload) => (
    Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
    )
);

const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789*@#$%';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const buildAutoSlug = (nombreComercial, numeroDoc) => {
    const base = normalizeSlug(nombreComercial) || 'tienda';
    const suffix = (numeroDoc || '').slice(-4) || Math.random().toString(36).slice(2, 6);
    return `${base}-${suffix}`
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 100);
};

const deriveNombreLegal = (nombreComercial, fallback) => (
    trimValue(nombreComercial) || fallback || DEFAULT_NOMBRE_DOC
);

const ensureEstado = (estado) => estado || DEFAULT_ESTADO;

const normalizeIdArray = (value) => {
    if (Array.isArray(value)) {
        const filtered = value.map((item) => (typeof item === 'number' ? item : Number(item)))
            .filter((item) => Number.isFinite(item));
        return filtered.length ? filtered : undefined;
    }
    if (value === null || value === undefined || value === '') {
        return undefined;
    }
    const numeric = Number(value);
    return Number.isFinite(numeric) ? [numeric] : undefined;
};

export const buildTiendaCreatePayload = (formData) => {
    const nombreComercial = trimValue(formData.nombreComercial);
    const numeroDoc = trimValue(formData.numeroDoc);
    const nombreDoc = trimValue(formData.nombreDoc);
    const correoContacto = trimValue(formData.correoContacto);
    const telefonoContacto = trimValue(formData.telefonoContacto) ?? null;
    const direccionFiscal = trimValue(formData.direccionFiscal);
    const ubigeoFiscal = trimValue(formData.ubigeoFiscal);

    return sanitizeObject({
        slug: buildAutoSlug(nombreComercial, numeroDoc),
        tipoDoc: DEFAULT_TIPO_DOC,
        numeroDoc,
        nombreDoc: nombreDoc || deriveNombreLegal(nombreComercial),
        nombreComercial: nombreComercial ?? null,
        correoContacto,
        telefonoContacto,
        direccionFiscal: direccionFiscal ?? null,
        ubigeoFiscal,
        contrasena: generateRandomPassword(),
        estado: ensureEstado(formData.estado),
    });
};

export const buildTiendaUpdatePayload = (formData, initialValues = {}) => {
    const nombreComercial = trimValue(formData.nombreComercial);
    const numeroDoc = trimValue(formData.numeroDoc) || initialValues.numeroDoc;
    const nombreDoc = trimValue(formData.nombreDoc) || initialValues.nombreDoc;
    const correoContacto = trimValue(formData.correoContacto);
    const telefonoContacto = trimValue(formData.telefonoContacto) ?? null;
    const direccionFiscal = trimValue(formData.direccionFiscal);
    const ubigeoFiscal = trimValue(formData.ubigeoFiscal);
    const slug = initialValues.slug || buildAutoSlug(nombreComercial, numeroDoc);

    return sanitizeObject({
        slug,
        tipoDoc: initialValues.tipoDoc || DEFAULT_TIPO_DOC,
        numeroDoc,
        nombreDoc: nombreDoc || deriveNombreLegal(nombreComercial, initialValues.nombreDoc),
        nombreComercial: nombreComercial ?? null,
        correoContacto,
        telefonoContacto,
        direccionFiscal: direccionFiscal ?? initialValues.direccionFiscal ?? null,
        ubigeoFiscal: ubigeoFiscal ?? initialValues.ubigeoFiscal,
        estado: ensureEstado(formData.estado || initialValues.estado),
    });
};

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
    sedeIds: normalizeIdArray(formData.sedeIds),
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
    sedeIds: normalizeIdArray(formData.sedeIds),
});
