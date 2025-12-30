import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Divider, message, Spin, Space, Row, Col, Tooltip, Alert, Typography, Table } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, FileTextOutlined, CheckCircleOutlined, FileZipOutlined, Html5Outlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { facturacionApi } from '../api/facturacion.api';
import { useTokenStore } from '../../../../shared/store/tokenStore';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import JSZip from 'jszip';
import { getDetallesPedido } from '../../ventas-pedidos/api/pedidos.api';
import { getProductoById } from '../../catalogo/api/productos.api';

const FacturacionDetallePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const tiendaId = useTokenStore((state) => state.tiendaId);

    const [comprobante, setComprobante] = useState(null);
    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState(false);
    const [validationStep, setValidationStep] = useState('');

    const fetchDetalle = async () => {
        if (!tiendaId || !id) return;
        setLoading(true);
        try {
            const [data, seriesList] = await Promise.all([
                facturacionApi.obtenerComprobante(tiendaId, id),
                facturacionApi.listarSeries(tiendaId)
            ]);

            if (data.serieId) {
                const foundSerie = seriesList.find(s => s.id === data.serieId);
                if (foundSerie) {
                    data.serie = foundSerie.serie;
                }
            }

            // Siempre intentar obtener los detalles originales del pedido para tener la info completa (cantidad, producto)
            if (data.pedidoId) {
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
                    message.warning('No se pudieron cargar los detalles del pedido asociado.');
                }
            }

            setComprobante(data);
        } catch (error) {
            console.error('Error cargando detalle:', error);
            message.error('No se pudo cargar el detalle del comprobante');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetalle();
    }, [tiendaId, id]);

    const handleValidarSunat = async () => {
        if (!comprobante) return;
        setValidating(true);

        try {
            // Paso 1: Generación del XML
            setValidationStep('Generando archivo XML (UBL 2.1)...');
            await new Promise(resolve => setTimeout(resolve, 800));

            // Paso 2: Firma Digital
            setValidationStep('Firmando digitalmente y comprimiendo (.ZIP)...');
            await new Promise(resolve => setTimeout(resolve, 800));

            // Paso 3: Envío a SUNAT
            setValidationStep('Conectando con servicio web SUNAT (sendBill)...');

            const payload = {
                codigoHash: 'HASH-SIMULADO-' + Date.now(),
                xmlUrl: `https://cdn.dulcecontrol.pe/cpe/${comprobante.emisorRuc}-${comprobante.tipoComprobante}-${comprobante.serie}-${comprobante.correlativo}.xml`,
                cdrUrl: `https://cdn.dulcecontrol.pe/cpe/${comprobante.emisorRuc}-${comprobante.tipoComprobante}-${comprobante.serie}-${comprobante.correlativo}-CDR.zip`,
                pdfUrl: `https://cdn.dulcecontrol.pe/cpe/${comprobante.emisorRuc}-${comprobante.tipoComprobante}-${comprobante.serie}-${comprobante.correlativo}.pdf`
            };

            await facturacionApi.registrarEnvioSunat(tiendaId, comprobante.id, payload);
            await new Promise(resolve => setTimeout(resolve, 800)); // Simular tiempo de red

            // Paso 4: Recepción del CDR
            setValidationStep('Validando respuesta y Constancia de Recepción (CDR)...');
            await new Promise(resolve => setTimeout(resolve, 600));

            await facturacionApi.actualizarEstadoSunat(tiendaId, comprobante.id, {
                estadoSunat: 'ACEPTADO',
                codigoRespuesta: '0',
                descripcionRespuesta: 'La Factura numero ' + comprobante.serie + '-' + comprobante.correlativo + ' ha sido aceptada'
            });

            message.success('Comprobante validado correctamente con SUNAT');
            fetchDetalle(); // Recargar datos
        } catch (error) {
            console.error('Error validando con SUNAT:', error);
            message.error('Error al validar el comprobante con SUNAT');
        } finally {
            setValidating(false);
            setValidationStep('');
        }
    };

    const handleExportarPDF = () => {
        if (!comprobante) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // --- Header ---
        // Title (Top Left)
        doc.setFontSize(40);
        doc.setFont('times', 'normal');
        doc.text((comprobante.tipoComprobante || 'COMPROBANTE').toLowerCase(), 14, 25);


        // --- Info Section ---
        const startY = 45;
        const leftColWidth = 90;

        // DE (Issuer)
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('DE', 14, startY);
        doc.setFont(undefined, 'normal');
        doc.text(comprobante.emisorRazonSocial || '', 14, startY + 6);

        // Wrap address
        const emisorDirLines = doc.splitTextToSize(comprobante.emisorDireccion || '', leftColWidth);
        doc.text(emisorDirLines, 14, startY + 11);

        // Adjust Y for RUC based on address lines
        const rucY = startY + 11 + (emisorDirLines.length * 4);
        doc.text(`RUC: ${comprobante.emisorRuc}`, 14, rucY);

        // Invoice Details (Right Side)
        const rightColX = 130; // Moved further right to avoid overlap
        const labelX = rightColX;
        const valueX = pageWidth - 14;

        doc.setFont('courier', 'bold'); // Switch back to courier for data if desired, or keep times. Image looks mixed but let's stick to clean sans/serif mix or just courier for alignment.
        // Actually image uses Typewriter/Courier for data potentially. Let's use Courier for the "data" part to match the "clean" look.
        doc.setFont('courier', 'bold');

        doc.text(`N° DE ${(comprobante.tipoComprobante || 'COMPROBANTE').toLowerCase()}`, labelX, startY, { align: 'right' });

        doc.setFont(undefined, 'normal');
        doc.text(`${comprobante.serie}-${String(comprobante.correlativo).padStart(8, '0')}`, pageWidth - 14, startY, { align: 'right' });

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

        // Subtotal and IGV removed as requested


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

        doc.save(`${comprobante.serie}-${String(comprobante.correlativo).padStart(8, '0')}.pdf`);
    };

    const handleExportarXML = () => {
        try {
            if (!comprobante) {
                message.error('No hay datos del comprobante');
                return;
            }

            console.log('Generando XML para:', comprobante);

            const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
    <cbc:CustomizationID>2.0</cbc:CustomizationID>
    <cbc:ID>${comprobante.serie}-${comprobante.correlativo}</cbc:ID>
    <cbc:IssueDate>${dayjs(comprobante.fechaEmision).format('YYYY-MM-DD')}</cbc:IssueDate>
    <cbc:IssueTime>${dayjs(comprobante.fechaEmision).format('HH:mm:ss')}</cbc:IssueTime>
    <cbc:InvoiceTypeCode listID="0101">${comprobante.tipoComprobante === 'FACTURA' ? '01' : '03'}</cbc:InvoiceTypeCode>
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
        <cbc:TaxAmount currencyID="${comprobante.moneda}">0.00</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="${comprobante.moneda}">${(comprobante.totalImporteCentimos / 100).toFixed(2)}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="${comprobante.moneda}">0.00</cbc:TaxAmount>
            <cac:TaxCategory>
                <cac:TaxScheme>
                    <cbc:ID>9997</cbc:ID>
                    <cbc:Name>EXO</cbc:Name>
                    <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="${comprobante.moneda}">${(comprobante.totalImporteCentimos / 100).toFixed(2)}</cbc:LineExtensionAmount>
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
            <cbc:TaxAmount currencyID="${comprobante.moneda}">0.00</cbc:TaxAmount>
            <cac:TaxSubtotal>
                <cbc:TaxableAmount currencyID="${comprobante.moneda}">${(subtotal / 100).toFixed(2)}</cbc:TaxableAmount>
                <cbc:TaxAmount currencyID="${comprobante.moneda}">0.00</cbc:TaxAmount>
                <cac:TaxCategory>
                    <cbc:Percent>0.00</cbc:Percent>
                    <cbc:TaxExemptionReasonCode>20</cbc:TaxExemptionReasonCode>
                    <cac:TaxScheme>
                        <cbc:ID>9997</cbc:ID>
                        <cbc:Name>EXO</cbc:Name>
                        <cbc:TaxTypeCode>VAT</cbc:TaxTypeCode>
                    </cac:TaxScheme>
                </cac:TaxCategory>
            </cac:TaxSubtotal>
        </cac:TaxTotal>
        <cac:Item>
            <cbc:Description><![CDATA[${descripcion}]]></cbc:Description>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="${comprobante.moneda}">${(precioUnitario / 100).toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>`;
            }).join('') : ''}
</Invoice>`;

            const blob = new Blob([xmlContent], { type: 'text/xml' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${comprobante.emisorRuc}-${comprobante.tipoComprobante === 'FACTURA' ? '01' : '03'}-${comprobante.serie}-${comprobante.correlativo}.xml`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            message.success('XML descargado correctamente');
        } catch (error) {
            console.error('Error generando XML:', error);
            message.error('Error al generar el XML: ' + error.message);
        }
    };

    const handleExportarCDR = async () => {
        try {
            if (!comprobante) {
                message.error('No hay datos del comprobante');
                return;
            }

            const cdrContent = `<?xml version="1.0" encoding="utf-8"?>
<ar:ApplicationResponse xmlns:ar="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:UBLVersionID>2.0</cbc:UBLVersionID>
    <cbc:CustomizationID>1.0</cbc:CustomizationID>
    <cbc:ID>${Date.now()}</cbc:ID>
    <cbc:IssueDate>${dayjs().format('YYYY-MM-DD')}</cbc:IssueDate>
    <cbc:IssueTime>${dayjs().format('HH:mm:ss')}</cbc:IssueTime>
    <cac:SenderParty>
        <cac:PartyIdentification>
            <cbc:ID>20131312955</cbc:ID>
        </cac:PartyIdentification>
        <cac:PartyName>
            <cbc:Name>SUNAT</cbc:Name>
        </cac:PartyName>
    </cac:SenderParty>
    <cac:ReceiverParty>
        <cac:PartyIdentification>
            <cbc:ID>${comprobante.emisorRuc}</cbc:ID>
        </cac:PartyIdentification>
        <cac:PartyName>
            <cbc:Name><![CDATA[${comprobante.emisorRazonSocial}]]></cbc:Name>
        </cac:PartyName>
    </cac:ReceiverParty>
    <cac:DocumentResponse>
        <cac:Response>
            <cbc:ReferenceID>${comprobante.serie}-${comprobante.correlativo}</cbc:ReferenceID>
            <cbc:ResponseCode>0</cbc:ResponseCode>
            <cbc:Description>La ${comprobante.tipoComprobante} numero ${comprobante.serie}-${comprobante.correlativo} ha sido aceptada</cbc:Description>
        </cac:Response>
        <cac:DocumentReference>
            <cbc:ID>${comprobante.serie}-${comprobante.correlativo}</cbc:ID>
            <cbc:DocumentTypeCode>${comprobante.tipoComprobante === 'FACTURA' ? '01' : '03'}</cbc:DocumentTypeCode>
        </cac:DocumentReference>
    </cac:DocumentResponse>
</ar:ApplicationResponse>`;

            // Crear ZIP
            const zip = new JSZip();
            zip.file(`R-${comprobante.emisorRuc}-${comprobante.tipoComprobante === 'FACTURA' ? '01' : '03'}-${comprobante.serie}-${comprobante.correlativo}.xml`, cdrContent);

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = window.URL.createObjectURL(zipBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `R-${comprobante.emisorRuc}-${comprobante.tipoComprobante === 'FACTURA' ? '01' : '03'}-${comprobante.serie}-${comprobante.correlativo}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            message.success('CDR descargado correctamente');
        } catch (error) {
            console.error('Error generando CDR:', error);
            message.error('Error al generar el CDR: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: 24, textAlign: 'center' }}>
                <Spin size="large" tip="Cargando detalle del comprobante..." />
            </div>
        );
    }

    if (!comprobante) {
        return (
            <div style={{ padding: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Volver</Button>
                <div style={{ marginTop: 24 }}>No se encontró el comprobante.</div>
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <style>
                {`
                    @media print {
                        @page { margin: 0; size: auto; }
                        body {
                            visibility: hidden;
                            background-color: white !important;
                            margin: 0;
                            padding: 0;
                        }
                        #invoice-print-template {
                            display: block !important;
                            visibility: visible;
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            min-height: 100vh;
                            background-color: white !important;
                            z-index: 9999;
                            padding: 40px;
                            font-family: 'Courier New', Courier, monospace;
                            color: #000;
                        }
                        #invoice-print-template * {
                            visibility: visible;
                        }
                        .no-print {
                            display: none !important;
                        }

                        /* Layout */
                        .print-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            margin-bottom: 40px;
                        }
                        .print-title {
                            font-size: 40px;
                            font-weight: bold;
                        }
                        .print-logo {
                            width: 60px;
                            height: 60px;
                            background-color: #999;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                        }

                        .print-info-row {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 30px;
                        }
                        .print-issuer {
                            width: 45%;
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                        }
                        .print-issuer-label {
                            font-weight: bold;
                            margin-bottom: 5px;
                        }
                        .print-invoice-data {
                            width: 45%;
                            text-align: right;
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                        }
                        .data-row {
                            display: flex;
                            justify-content: flex-end;
                            margin-bottom: 4px;
                        }
                        .data-label {
                            font-weight: bold;
                            margin-right: 10px;
                        }

                        .print-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 30px;
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                        }
                        .print-table th {
                            text-align: left;
                            padding: 8px;
                            border-top: 2px solid #000;
                            border-bottom: 2px solid #000;
                        }
                        .print-table td {
                            padding: 8px;
                            border-bottom: 1px solid #eee;
                        }
                        .text-right { text-align: right; }
                        .text-center { text-align: center; }

                        .print-totals {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                        }
                        .total-row {
                            display: flex;
                            justify-content: flex-end;
                            width: 300px;
                            margin-bottom: 5px;
                        }
                        .total-box {
                            margin-top: 10px;
                            border: 2px solid #000;
                            padding: 10px 20px;
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                            font-size: 18px;
                            font-weight: bold;
                        }
                    }
                `}
            </style>

            {/* Print Template */}
            <div id="invoice-print-template" style={{ display: 'none' }}>
                <div className="print-header">
                    <div className="print-title" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'normal', fontSize: '50px' }}>
                        {(comprobante.tipoComprobante || 'COMPROBANTE').toLowerCase()}
                    </div>
                </div>

                <div className="print-info-row">
                    <div className="print-issuer">
                        <div className="print-issuer-label">DE</div>
                        <div>{comprobante.emisorRazonSocial}</div>
                        <div>{comprobante.emisorDireccion}</div>
                        <div style={{ marginTop: 5 }}>RUC: {comprobante.emisorRuc}</div>
                    </div>
                    <div className="print-invoice-data">
                        <div className="data-row">
                            <span className="data-label">N° DE {(comprobante.tipoComprobante || 'COMPROBANTE').toLowerCase()}</span>
                            <span>{comprobante.serie}-{String(comprobante.correlativo).padStart(8, '0')}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">FECHA</span>
                            <span>{dayjs(comprobante.fechaEmision).format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">N° DE PEDIDO</span>
                            <span>#{comprobante.referenciaId || '-'}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">FECHA VENCIMIENTO</span>
                            <span>{dayjs(comprobante.fechaEmision).add(15, 'day').format('DD/MM/YYYY')}</span>
                        </div>
                    </div>
                </div>

                <table className="print-table">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '10%' }}>CANT.</th>
                            <th style={{ width: '50%' }}>DESCRIPCIÓN</th>
                            <th className="text-right" style={{ width: '20%' }}>PRECIO UNITARIO</th>
                            <th className="text-right" style={{ width: '20%' }}>IMPORTE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comprobante.detalles && comprobante.detalles.map((item, idx) => {
                            const precioUnitario = item.precioUnitario ?? item.precioUnitarioCentimos ?? 0;
                            const subtotal = item.subtotal ?? item.totalItemCentimos ?? item.subtotalLineaCentimos ?? 0;
                            const descripcion = item.descripcion || item.productoNombre || item.nombre || 'Producto';

                            return (
                                <tr key={idx}>
                                    <td className="text-center">{item.cantidad}</td>
                                    <td>{descripcion}</td>
                                    <td className="text-right">{(precioUnitario / 100).toFixed(2)}</td>
                                    <td className="text-right">{(subtotal / 100).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="print-totals">
                    {/* Subtotal and IGV rows removed */}
                    <div className="total-box">
                        <span>TOTAL</span>
                        <span>{comprobante.moneda === 'PEN' ? 'S/' : '$'} {(comprobante.totalImporteCentimos / 100).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Vista Normal de Admin (Oculta al imprimir) */}
            <div className="no-print">
                <Card
                    title={`Detalle del Comprobante: ${comprobante.serie}-${comprobante.correlativo}`}
                    extra={
                        <Space className="no-print">
                            <Divider type="vertical" />
                            <Tooltip title="Exportar PDF">
                                <Button
                                    icon={<FilePdfOutlined style={{ color: '#f5222d' }} />}
                                    onClick={handleExportarPDF}
                                >
                                    PDF
                                </Button>
                            </Tooltip>
                            <Tooltip title="Exportar HTML (Imprimir)">
                                <Button
                                    icon={<Html5Outlined style={{ color: '#fa8c16' }} />}
                                    onClick={() => window.print()}
                                >
                                    HTML
                                </Button>
                            </Tooltip>
                            <Tooltip title="Exportar XML">
                                <Button
                                    icon={<FileTextOutlined style={{ color: '#1890ff' }} />}
                                    onClick={handleExportarXML}
                                >
                                    XML
                                </Button>
                            </Tooltip>
                            <Tooltip title="Exportar CDR (ODRC)">
                                <Button
                                    icon={<FileZipOutlined style={{ color: '#52c41a' }} />}
                                    onClick={handleExportarCDR}
                                    disabled={comprobante.estadoSunat?.toUpperCase() !== 'ACEPTADO'}
                                >
                                    CDR
                                </Button>
                            </Tooltip>
                        </Space>
                    }
                >
                    <Descriptions title="Información General" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                        <Descriptions.Item label="Tipo Comprobante">
                            <Tag color={comprobante.tipoComprobante === 'FACTURA' ? 'blue' : (comprobante.tipoComprobante === 'BOLETA' ? 'green' : 'orange')}>
                                {comprobante.tipoComprobante}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Estado SUNAT">
                            <Tag color={comprobante.estadoSunat?.toUpperCase() === 'ACEPTADO' ? 'success' : (comprobante.estadoSunat?.toUpperCase() === 'PENDIENTE' ? 'warning' : 'error')}>
                                {comprobante.estadoSunat || 'PENDIENTE'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Fecha Emisión">
                            {dayjs(comprobante.fechaEmision).format('DD/MM/YYYY HH:mm')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Moneda">
                            {comprobante.moneda}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider orientation="left">Datos del Cliente</Divider>
                    <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                        <Descriptions.Item label="Nombre / Razón Social">
                            {comprobante.clienteNombre}
                        </Descriptions.Item>
                        <Descriptions.Item label="Documento">
                            {comprobante.clienteTipoDoc}: {comprobante.clienteNumeroDoc}
                        </Descriptions.Item>
                        <Descriptions.Item label="Dirección" span={2}>
                            {comprobante.clienteDireccion || '-'}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider orientation="left">Datos del Emisor</Divider>
                    <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                        <Descriptions.Item label="Razón Social">
                            {comprobante.emisorRazonSocial}
                        </Descriptions.Item>
                        <Descriptions.Item label="RUC">
                            {comprobante.emisorRuc}
                        </Descriptions.Item>
                        <Descriptions.Item label="Dirección" span={2}>
                            {comprobante.emisorDireccion}
                        </Descriptions.Item>
                    </Descriptions>



                    <Divider orientation="left">Detalle de Productos</Divider>
                    <Table
                        dataSource={comprobante.detalles || []}
                        pagination={false}
                        rowKey={(record, index) => index}
                        columns={[
                            { title: 'Cant.', dataIndex: 'cantidad', width: 80, align: 'center' },
                            {
                                title: 'Descripción',
                                key: 'descripcion',
                                render: (_, record) => record.descripcion || record.productoNombre || record.nombre || 'Producto'
                            },
                            {
                                title: 'P. Unitario',
                                key: 'precioUnitario',
                                align: 'right',
                                width: 120,
                                render: (_, record) => {
                                    const val = record.precioUnitario ?? record.precioUnitarioCentimos ?? 0;
                                    return (val / 100).toFixed(2);
                                }
                            },
                            {
                                title: 'Importe',
                                key: 'subtotal',
                                align: 'right',
                                width: 120,
                                render: (_, record) => {
                                    const val = record.subtotal ?? record.totalItemCentimos ?? record.subtotalLineaCentimos ?? 0;
                                    return (val / 100).toFixed(2);
                                }
                            }
                        ]}
                        style={{ marginBottom: 24 }}
                    />

                    <Divider orientation="left">Totales</Divider>
                    <Row justify="end">
                        <Col xs={24} sm={12} md={8}>
                            <Descriptions bordered column={1} size="small">

                                <Descriptions.Item label="Importe Total" contentStyle={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {comprobante.moneda === 'PEN' ? 'S/ ' : '$ '}
                                    {(comprobante.totalImporteCentimos / 100).toFixed(2)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>

                    <Divider orientation="left" className="no-print">Facturación Electrónica SUNAT</Divider>
                    <div style={{ marginBottom: 24 }} className="no-print">
                        {comprobante.estadoSunat?.toUpperCase() === 'ACEPTADO' && (
                            <Alert
                                message={<span style={{ fontWeight: 'bold' }}>Comprobante Aceptado</span>}
                                description={
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ marginBottom: 8 }}>{comprobante.respuestaSunatDescripcion || 'El comprobante ha sido aceptado satisfactoriamente.'}</div>
                                        <Space>
                                            <Button
                                                size="small"
                                                icon={<FileTextOutlined />}
                                                onClick={handleExportarXML}
                                            >
                                                Descargar XML
                                            </Button>
                                            <Button
                                                size="small"
                                                icon={<FileZipOutlined />}
                                                onClick={handleExportarCDR}
                                            >
                                                Descargar CDR
                                            </Button>
                                        </Space>
                                    </div>
                                }
                                type="success"
                                showIcon
                                icon={<CheckCircleOutlined style={{ fontSize: '24px' }} />}
                                style={{ border: '1px solid #b7eb8f', background: '#f6ffed' }}
                            />
                        )}

                        {comprobante.estadoSunat?.toUpperCase() === 'RECHAZADO' && (
                            <Alert
                                message={<span style={{ fontWeight: 'bold' }}>Rechazado por SUNAT</span>}
                                description={
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ marginBottom: 12, padding: '8px', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '4px', color: '#cf1322' }}>
                                            <strong>Error {comprobante.respuestaSunatCodigo || 'Desconocido'}:</strong> {comprobante.respuestaSunatDescripcion || 'Ocurrió un error durante la validación.'}
                                        </div>
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<SyncOutlined />}
                                            onClick={handleValidarSunat}
                                            loading={validating}
                                        >
                                            Reintentar envío
                                        </Button>
                                    </div>
                                }
                                type="error"
                                showIcon
                                icon={<CloseCircleOutlined style={{ fontSize: '24px' }} />}
                                style={{ border: '1px solid #ffa39e', background: '#fff1f0' }}
                            />
                        )}

                        {comprobante.estadoSunat?.toUpperCase() === 'ANULADO' && (
                            <Alert
                                message={<span style={{ fontWeight: 'bold' }}>Comprobante Anulado</span>}
                                description="Este comprobante ha sido dado de baja y no tiene valor tributario."
                                type="error"
                                showIcon
                                icon={<CloseCircleOutlined style={{ fontSize: '24px' }} />}
                                style={{ border: '1px solid #ffa39e', background: '#fff1f0' }}
                            />
                        )}

                        {/* Default to PENDIENTE for any other status (null, undefined, PENDIENTE, or unknown) */}
                        {!['ACEPTADO', 'RECHAZADO', 'ANULADO'].includes(comprobante.estadoSunat?.toUpperCase()) && (
                            <Alert
                                message={<span style={{ fontWeight: 'bold' }}>{validating ? 'Procesando envío a SUNAT...' : 'Pendiente de Envío'}</span>}
                                description={
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ marginBottom: 8, fontSize: '14px', color: validating ? '#1890ff' : 'inherit' }}>
                                            {validating ? (
                                                <Space>
                                                    <Spin size="small" />
                                                    <span style={{ fontWeight: 500 }}>{validationStep}</span>
                                                </Space>
                                            ) : (
                                                <span>
                                                    El comprobante está listo para ser enviado a SUNAT.
                                                    {comprobante.estadoSunat && comprobante.estadoSunat !== 'PENDIENTE' && (
                                                        <span style={{ marginLeft: 8, fontSize: '12px', color: '#888' }}>
                                                            (Estado actual: {comprobante.estadoSunat})
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        <Space>
                                            <Button size="small" onClick={handleExportarXML}>Descargar XML</Button>
                                            <Button disabled size="small">Descargar CDR</Button>
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={handleValidarSunat}
                                                loading={validating}
                                                disabled={validating}
                                            >
                                                Enviar a SUNAT
                                            </Button>
                                        </Space>
                                    </div>
                                }
                                type="info"
                                showIcon
                                icon={!validating && <SyncOutlined style={{ fontSize: '24px' }} />}
                                style={{ border: '1px solid #91d5ff', background: '#e6f7ff' }}
                            />
                        )}
                    </div>

                    {comprobante.pedidoId && (
                        <div style={{ marginTop: 24, color: '#888', fontStyle: 'italic', textAlign: 'right' }}>
                            Referencia: Pedido #{comprobante.pedidoId}
                        </div>
                    )}
                </Card>
            </div>
        </div >
    );
};

export default FacturacionDetallePage;
