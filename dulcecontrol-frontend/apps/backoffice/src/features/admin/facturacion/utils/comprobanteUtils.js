import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import JSZip from 'jszip';
import dayjs from 'dayjs';
import { message } from 'antd';
import { facturacionApi } from '../api/facturacion.api';
import { getDetallesPedido } from '../../ventas-pedidos/api/pedidos.api';
import { getProductoById } from '../../catalogo/api/productos.api';

/**
 * Obtiene el comprobante completo con detalles y nombres de productos
 */
export const fetchComprobanteFullDetails = async (tiendaId, comprobanteId) => {
    try {
        const data = await facturacionApi.obtenerComprobante(tiendaId, comprobanteId);

        // Si el comprobante no tiene detalles pero tiene un pedidoId, buscamos los detalles del pedido
        if ((!data.detalles || data.detalles.length === 0) && data.pedidoId) {
            try {
                const detallesPedido = await getDetallesPedido(tiendaId, data.pedidoId);

                // Enriquecer con nombres de productos
                const detallesConProducto = await Promise.all(detallesPedido.map(async (d) => {
                    let nombreProducto = 'Producto';
                    try {
                        if (d.productoId) {
                            const producto = await getProductoById(tiendaId, d.productoId);
                            nombreProducto = producto.nombre;
                        }
                    } catch (e) {
                        console.warn('No se pudo cargar nombre del producto', d.productoId);
                    }

                    return {
                        cantidad: d.cantidad,
                        descripcion: nombreProducto,
                        precioUnitario: d.precioUnitarioCentimos,
                        subtotal: d.subtotalLineaCentimos
                    };
                }));

                data.detalles = detallesConProducto;
            } catch (err) {
                console.error('Error cargando detalles del pedido:', err);
                // No fallamos, devolvemos lo que tenemos
            }
        }
        return data;
    } catch (error) {
        console.error('Error obteniendo comprobante completo:', error);
        throw error;
    }
};

/**
 * Genera y descarga el PDF del comprobante
 */
export const generateComprobantePDF = (comprobante) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // --- Header ---
        doc.setFontSize(40);
        doc.setFont('courier', 'bold');
        doc.setFont(undefined, 'bold');
        doc.text(comprobante.tipoComprobante || 'COMPROBANTE', 14, 25);

        // Logo (Placeholder)
        doc.setFillColor(150, 150, 150);
        doc.circle(pageWidth - 25, 20, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('LOGO', pageWidth - 25, 21, { align: 'center' });
        doc.setTextColor(0, 0, 0);

        // --- Info Section ---
        const startY = 45;
        const leftColWidth = 90;

        // DE (Issuer)
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('DE', 14, startY);
        doc.setFont(undefined, 'normal');
        doc.text(comprobante.emisorRazonSocial || '', 14, startY + 6);

        const emisorDirLines = doc.splitTextToSize(comprobante.emisorDireccion || '', leftColWidth);
        doc.text(emisorDirLines, 14, startY + 11);

        const rucY = startY + 11 + (emisorDirLines.length * 4);
        doc.text(`RUC: ${comprobante.emisorRuc}`, 14, rucY);

        // Invoice Details (Right Side)
        const rightColX = 130;
        const serie = comprobante.serie || '???';
        const correlativo = String(comprobante.correlativo).padStart(8, '0');

        doc.setFont(undefined, 'bold');
        doc.text(`N° DE ${comprobante.tipoComprobante}`, rightColX, startY, { align: 'right' });
        doc.setFont(undefined, 'normal');
        doc.text(`${serie}-${correlativo}`, pageWidth - 14, startY, { align: 'right' });

        doc.setFont(undefined, 'bold');
        doc.text('FECHA', rightColX, startY + 6, { align: 'right' });
        doc.setFont(undefined, 'normal');
        doc.text(dayjs(comprobante.fechaEmision).format('DD/MM/YYYY'), pageWidth - 14, startY + 6, { align: 'right' });

        doc.setFont(undefined, 'bold');
        doc.text('N° DE PEDIDO', rightColX, startY + 12, { align: 'right' });
        doc.setFont(undefined, 'normal');
        doc.text(`#${comprobante.referenciaId || '-'}`, pageWidth - 14, startY + 12, { align: 'right' });

        doc.setFont(undefined, 'bold');
        doc.text('FECHA VENCIMIENTO', rightColX, startY + 18, { align: 'right' });
        doc.setFont(undefined, 'normal');
        doc.text(dayjs(comprobante.fechaEmision).add(15, 'day').format('DD/MM/YYYY'), pageWidth - 14, startY + 18, { align: 'right' });

        // --- Table ---
        const tableStartY = startY + 30;
        const tableColumn = ["CANT.", "DESCRIPCIÓN", "PRECIO UNITARIO", "IMPORTE"];
        const tableRows = [];

        if (comprobante.detalles) {
            comprobante.detalles.forEach(detail => {
                const precioUnitario = detail.precioUnitario ?? detail.precioUnitarioCentimos ?? 0;
                const subtotal = detail.subtotal ?? detail.totalItemCentimos ?? detail.subtotalLineaCentimos ?? 0;
                const descripcion = detail.descripcion || detail.productoNombre || detail.nombre || 'Producto';

                const detailData = [
                    detail.cantidad,
                    descripcion,
                    (precioUnitario / 100).toFixed(2),
                    (subtotal / 100).toFixed(2)
                ];
                tableRows.push(detailData);
            });
        }

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: tableStartY,
            theme: 'plain',
            styles: {
                fontSize: 10,
                cellPadding: 3,
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: 0,
                fontStyle: 'bold',
                halign: 'left',
                lineWidth: { top: 0.5, bottom: 0.5, left: 0, right: 0 }
            },
            bodyStyles: {
                lineWidth: { bottom: 0.1 },
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 20 },
                2: { halign: 'right', cellWidth: 40 },
                3: { halign: 'right', cellWidth: 40 }
            },
            didParseCell: (data) => {
                if (data.section === 'body' || data.section === 'head') {
                    data.cell.styles.lineWidth = { top: data.cell.styles.lineWidth?.top || 0, bottom: data.cell.styles.lineWidth?.bottom || 0.1, left: 0, right: 0 };
                    if (data.section === 'head') {
                        data.cell.styles.lineWidth = { top: 0.5, bottom: 0.5, left: 0, right: 0 };
                    }
                }
            }
        });

        // --- Totals ---
        const finalY = doc.lastAutoTable.finalY + 10;
        const rightX = pageWidth - 14;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        // Subtotal
        doc.text('Subtotal', rightX - 50, finalY, { align: 'right' });
        doc.text((comprobante.totalGravadoCentimos / 100).toFixed(2), rightX, finalY, { align: 'right' });

        // IGV
        doc.text('IGV 18%', rightX - 50, finalY + 6, { align: 'right' });
        doc.text((comprobante.totalIgvCentimos / 100).toFixed(2), rightX, finalY + 6, { align: 'right' });

        // TOTAL BOX
        const totalBoxY = finalY + 15;
        doc.setDrawColor(0);
        doc.setLineWidth(1);
        doc.rect(14, totalBoxY, pageWidth - 28, 15);

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('TOTAL', 20, totalBoxY + 10);

        const symbol = comprobante.moneda === 'PEN' ? 'S/' : '$';
        const totalAmount = (comprobante.totalImporteCentimos / 100).toFixed(2);
        doc.text(`${symbol} ${totalAmount}`, pageWidth - 20, totalBoxY + 10, { align: 'right' });

        doc.save(`${serie}-${correlativo}.pdf`);
        message.success('PDF generado correctamente');
    } catch (error) {
        console.error('Error generando PDF:', error);
        message.error('Error al generar el PDF');
    }
};

/**
 * Genera y descarga el XML del comprobante
 */
export const generateComprobanteXML = (comprobante) => {
    try {
        const serie = comprobante.serie || '???';
        const correlativo = String(comprobante.correlativo).padStart(8, '0');
        const tipoComprobanteCode = comprobante.tipoComprobante === 'FACTURA' ? '01' : '03';
        const filename = `${comprobante.emisorRuc}-${tipoComprobanteCode}-${serie}-${correlativo}.xml`;

        const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
    <cbc:CustomizationID>2.0</cbc:CustomizationID>
    <cbc:ID>${serie}-${correlativo}</cbc:ID>
    <cbc:IssueDate>${dayjs(comprobante.fechaEmision).format('YYYY-MM-DD')}</cbc:IssueDate>
    <cbc:IssueTime>${dayjs(comprobante.fechaEmision).format('HH:mm:ss')}</cbc:IssueTime>
    <cbc:InvoiceTypeCode listID="0101">${tipoComprobanteCode}</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>${comprobante.moneda}</cbc:DocumentCurrencyCode>
    <cac:Signature>
        <cbc:ID>${comprobante.emisorRuc}</cbc:ID>
        <cac:SignatoryParty>
            <cac:PartyIdentification>
                <cbc:ID>${comprobante.emisorRuc}</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name><![CDATA[${comprobante.emisorRazonSocial}]]></cbc:Name>
            </cac:PartyName>
        </cac:SignatoryParty>
        <cac:DigitalSignatureAttachment>
            <cac:ExternalReference>
                <cbc:URI>#SignatureSP</cbc:URI>
            </cac:ExternalReference>
        </cac:DigitalSignatureAttachment>
    </cac:Signature>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="6">${comprobante.emisorRuc}</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name><![CDATA[${comprobante.emisorRazonSocial}]]></cbc:Name>
            </cac:PartyName>
        </cac:Party>
    </cac:AccountingSupplierParty>
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="${comprobante.clienteTipoDoc === 'RUC' ? '6' : '1'}">${comprobante.clienteNumeroDoc}</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName><![CDATA[${comprobante.clienteNombre}]]></cbc:RegistrationName>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingCustomerParty>
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="${comprobante.moneda}">${(comprobante.totalIgvCentimos / 100).toFixed(2)}</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="${comprobante.moneda}">${(comprobante.totalGravadoCentimos / 100).toFixed(2)}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="${comprobante.moneda}">${(comprobante.totalIgvCentimos / 100).toFixed(2)}</cbc:TaxAmount>
            <cac:TaxCategory>
                <cac:TaxScheme>
                    <cbc:ID>1000</cbc:ID>
                    <cbc:Name>IGV</cbc:Name>
                    <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="${comprobante.moneda}">${(comprobante.totalGravadoCentimos / 100).toFixed(2)}</cbc:LineExtensionAmount>
        <cbc:TaxInclusiveAmount currencyID="${comprobante.moneda}">${(comprobante.totalImporteCentimos / 100).toFixed(2)}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount currencyID="${comprobante.moneda}">${(comprobante.totalImporteCentimos / 100).toFixed(2)}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
    ${comprobante.detalles ? comprobante.detalles.map((detalle, index) => {
            const precioUnitario = detalle.precioUnitario ?? detalle.precioUnitarioCentimos ?? 0;
            const subtotal = detalle.subtotal ?? detalle.totalItemCentimos ?? detalle.subtotalLineaCentimos ?? 0;
            const descripcion = detalle.descripcion || detalle.productoNombre || detalle.nombre || 'Producto';

            return `
    <cac:InvoiceLine>
        <cbc:ID>${index + 1}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="NIU">${detalle.cantidad}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="${comprobante.moneda}">${(subtotal / 100).toFixed(2)}</cbc:LineExtensionAmount>
        <cac:PricingReference>
            <cac:AlternativeConditionPrice>
                <cbc:PriceAmount currencyID="${comprobante.moneda}">${(precioUnitario / 100).toFixed(2)}</cbc:PriceAmount>
                <cbc:PriceTypeCode>01</cbc:PriceTypeCode>
            </cac:AlternativeConditionPrice>
        </cac:PricingReference>
        <cac:TaxTotal>
            <cbc:TaxAmount currencyID="${comprobante.moneda}">${((subtotal * 0.18) / 100).toFixed(2)}</cbc:TaxAmount>
            <cac:TaxSubtotal>
                <cbc:TaxableAmount currencyID="${comprobante.moneda}">${(subtotal / 100).toFixed(2)}</cbc:TaxableAmount>
                <cbc:TaxAmount currencyID="${comprobante.moneda}">${((subtotal * 0.18) / 100).toFixed(2)}</cbc:TaxAmount>
                <cac:TaxCategory>
                    <cbc:Percent>18.00</cbc:Percent>
                    <cbc:TaxExemptionReasonCode>10</cbc:TaxExemptionReasonCode>
                    <cac:TaxScheme>
                        <cbc:ID>1000</cbc:ID>
                        <cbc:Name>IGV</cbc:Name>
                        <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                    </cac:TaxScheme>
                </cac:TaxCategory>
            </cac:TaxSubtotal>
        </cac:TaxTotal>
        <cac:Item>
            <cbc:Description><![CDATA[${descripcion}]]></cbc:Description>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="${comprobante.moneda}">${(precioUnitario / 1.18 / 100).toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>`;
        }).join('') : ''}
</Invoice>`;

        const blob = new Blob([xmlContent], { type: 'text/xml' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success('XML generado correctamente');
    } catch (error) {
        console.error('Error generando XML:', error);
        message.error('Error al generar el XML');
    }
};
