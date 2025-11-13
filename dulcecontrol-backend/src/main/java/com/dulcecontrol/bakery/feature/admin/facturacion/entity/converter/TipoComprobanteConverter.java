package com.dulcecontrol.bakery.feature.admin.facturacion.entity.converter;

import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.TipoComprobante;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoComprobanteConverter implements AttributeConverter<TipoComprobante, String> {

    @Override
    public String convertToDatabaseColumn(TipoComprobante attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public TipoComprobante convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return TipoComprobante.fromValor(dbData);
    }
}
