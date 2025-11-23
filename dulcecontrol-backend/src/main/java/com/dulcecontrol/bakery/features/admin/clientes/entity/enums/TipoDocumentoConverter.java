package com.dulcecontrol.bakery.features.admin.clientes.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Converter para TipoDocumento que maneja la conversión entre el enum Java y el
 * ENUM de MySQL.
 * Se aplica automáticamente a todos los campos de tipo TipoDocumento.
 */
@Converter(autoApply = true)
public class TipoDocumentoConverter implements AttributeConverter<TipoDocumento, String> {

    @Override
    public String convertToDatabaseColumn(TipoDocumento attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name(); // Retorna "DNI" o "RUC"
    }

    @Override
    public TipoDocumento convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        return TipoDocumento.valueOf(dbData);
    }
}
