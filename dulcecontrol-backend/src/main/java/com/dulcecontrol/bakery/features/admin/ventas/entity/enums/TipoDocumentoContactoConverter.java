package com.dulcecontrol.bakery.features.admin.ventas.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoDocumentoContactoConverter implements AttributeConverter<TipoDocumentoContacto, String> {

    @Override
    public String convertToDatabaseColumn(TipoDocumentoContacto attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public TipoDocumentoContacto convertToEntityAttribute(String dbData) {
        return dbData == null ? null : TipoDocumentoContacto.fromValue(dbData);
    }
}
