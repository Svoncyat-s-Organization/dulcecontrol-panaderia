package com.dulcecontrol.bakery.features.admin.ventas.entity.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoDireccionPedidoConverter implements AttributeConverter<TipoDireccionPedido, String> {

    @Override
    public String convertToDatabaseColumn(TipoDireccionPedido attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public TipoDireccionPedido convertToEntityAttribute(String dbData) {
        return dbData == null ? null : TipoDireccionPedido.fromValue(dbData);
    }
}
