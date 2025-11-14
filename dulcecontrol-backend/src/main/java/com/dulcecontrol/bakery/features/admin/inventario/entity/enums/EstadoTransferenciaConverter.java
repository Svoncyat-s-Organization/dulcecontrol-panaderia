package com.dulcecontrol.bakery.features.admin.inventario.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoTransferenciaConverter implements AttributeConverter<EstadoTransferencia, String> {

    @Override
    public String convertToDatabaseColumn(EstadoTransferencia attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public EstadoTransferencia convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return EstadoTransferencia.fromString(dbData);
    }
}
