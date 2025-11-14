package com.dulcecontrol.bakery.features.admin.facturacion.entity.converter;

import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoDocumentoCliente;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoDocumentoClienteConverter implements AttributeConverter<TipoDocumentoCliente, String> {

    @Override
    public String convertToDatabaseColumn(TipoDocumentoCliente attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValor();
    }

    @Override
    public TipoDocumentoCliente convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return TipoDocumentoCliente.fromValor(dbData);
    }
}
