package com.dulcecontrol.bakery.features.admin.compras.entity.converter;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.TipoComprobanteProveedor;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoComprobanteProveedorConverter implements AttributeConverter<TipoComprobanteProveedor, String> {

    @Override
    public String convertToDatabaseColumn(TipoComprobanteProveedor attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public TipoComprobanteProveedor convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return TipoComprobanteProveedor.fromValor(dbData);
    }
}
