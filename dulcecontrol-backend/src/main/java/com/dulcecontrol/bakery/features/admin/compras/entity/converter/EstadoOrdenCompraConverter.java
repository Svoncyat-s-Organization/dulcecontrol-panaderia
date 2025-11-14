package com.dulcecontrol.bakery.features.admin.compras.entity.converter;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.EstadoOrdenCompra;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoOrdenCompraConverter implements AttributeConverter<EstadoOrdenCompra, String> {

    @Override
    public String convertToDatabaseColumn(EstadoOrdenCompra attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public EstadoOrdenCompra convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return EstadoOrdenCompra.fromValor(dbData);
    }
}
