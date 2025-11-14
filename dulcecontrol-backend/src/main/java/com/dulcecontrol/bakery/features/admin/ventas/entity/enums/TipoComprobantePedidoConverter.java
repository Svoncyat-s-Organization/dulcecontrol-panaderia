package com.dulcecontrol.bakery.features.admin.ventas.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoComprobantePedidoConverter implements AttributeConverter<TipoComprobantePedido, String> {

    @Override
    public String convertToDatabaseColumn(TipoComprobantePedido attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public TipoComprobantePedido convertToEntityAttribute(String dbData) {
        return dbData == null ? null : TipoComprobantePedido.fromValue(dbData);
    }
}
