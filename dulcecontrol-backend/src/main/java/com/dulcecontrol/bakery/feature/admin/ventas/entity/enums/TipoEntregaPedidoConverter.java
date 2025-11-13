package com.dulcecontrol.bakery.feature.admin.ventas.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoEntregaPedidoConverter implements AttributeConverter<TipoEntregaPedido, String> {

    @Override
    public String convertToDatabaseColumn(TipoEntregaPedido attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public TipoEntregaPedido convertToEntityAttribute(String dbData) {
        return dbData == null ? null : TipoEntregaPedido.fromValue(dbData);
    }
}
