package com.dulcecontrol.bakery.features.admin.compras.entity.converter;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.TipoDocumentoProveedor;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoDocumentoProveedorConverter implements AttributeConverter<TipoDocumentoProveedor, String> {

    @Override
    public String convertToDatabaseColumn(TipoDocumentoProveedor attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public TipoDocumentoProveedor convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return TipoDocumentoProveedor.fromValor(dbData);
    }
}
