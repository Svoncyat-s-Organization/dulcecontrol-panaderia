import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Divider, message, Spin, Space, Row, Col, Tooltip, Alert, Typography } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, FileTextOutlined, CheckCircleOutlined, FileZipOutlined, Html5Outlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { facturacionApi } from '../api/facturacion.api';
import { useTokenStore } from '../../../../shared/store/tokenStore';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import JSZip from 'jszip';

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
            const data = await facturacionApi.obtenerComprobante(tiendaId, id);
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

        // --- Header ---
        // Company Info (Left)
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(comprobante.emisorRazonSocial || 'EMPRESA', 14, 20);

        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.text(comprobante.emisorDireccion || '', 14, 26);
        doc.text('LIMA - LIMA - PERÚ', 14, 31);
        doc.text('Teléfono: (01) 123-4567', 14, 36);
        doc.text('Email: contacto@dulcecontrol.pe', 14, 41);

        // RUC Box (Right)
        const rucBoxX = 135;
        const rucBoxY = 15;
        const rucBoxWidth = 60;
        const rucBoxHeight = 30;

        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(rucBoxX, rucBoxY, rucBoxWidth, rucBoxHeight);

        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`R.U.C. ${comprobante.emisorRuc}`, rucBoxX + 30, rucBoxY + 8, { align: 'center' });

        // Box Title Background
        doc.setFillColor(240, 240, 240);
        doc.rect(rucBoxX, rucBoxY + 10, rucBoxWidth, 10, 'F');
        doc.setDrawColor(0); // Reset draw color after fill
        doc.rect(rucBoxX, rucBoxY + 10, rucBoxWidth, 10); // Redraw border

        doc.text(`${comprobante.tipoComprobante} ELECTRÓNICA`, rucBoxX + 30, rucBoxY + 17, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`${comprobante.serie} - ${String(comprobante.correlativo).padStart(8, '0')}`, rucBoxX + 30, rucBoxY + 26, { align: 'center' });

        // --- Client Info ---
        const clientY = 55;
        doc.setFontSize(9);

        // Labels
        doc.setFont(undefined, 'bold');
        doc.text('Fecha de Emisión:', 14, clientY);
        doc.text('Señor(es):', 14, clientY + 6);
        doc.text(`${comprobante.clienteTipoDoc}:`, 14, clientY + 12);
        doc.text('Dirección:', 14, clientY + 18);
        doc.text('Moneda:', 14, clientY + 24);

        // Values
        doc.setFont(undefined, 'normal');
        doc.text(dayjs(comprobante.fechaEmision).format('DD/MM/YYYY'), 50, clientY);
        doc.text(comprobante.clienteNombre, 50, clientY + 6);
        doc.text(comprobante.clienteNumeroDoc, 50, clientY + 12);
        doc.text(comprobante.clienteDireccion || '-', 50, clientY + 18);
        doc.text(comprobante.moneda === 'PEN' ? 'SOLES' : 'DOLARES AMERICANOS', 50, clientY + 24);

        // --- Items Table ---
        const tableColumn = ["Cant.", "Unidad", "Descripción", "P. Unit", "Total"];
        const tableRows = [];

        if (comprobante.detalles) {
            comprobante.detalles.forEach(detail => {
                const detailData = [
                    detail.cantidad,
                    'NIU',
                    detail.descripcion,
                    (detail.precioUnitario / 100).toFixed(2),
                    (detail.subtotal / 100).toFixed(2)
                ];
                tableRows.push(detailData);
            });
        }

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: clientY + 32,
            theme: 'plain',
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold', lineWidth: 0.1, lineColor: 0 },
            bodyStyles: { lineWidth: 0.1, lineColor: 0 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 20 },
                1: { halign: 'center', cellWidth: 20 },
                3: { halign: 'right', cellWidth: 30 },
                4: { halign: 'right', cellWidth: 30 }
            }
        });

        // --- Totals ---
        const finalY = doc.lastAutoTable.finalY + 10;
        const rightX = 195;
        const labelX = 140;

        doc.setFontSize(9);

        doc.text(`Op. Gravada:`, labelX, finalY);
        doc.text(`${comprobante.moneda === 'PEN' ? 'S/' : '$'} ${(comprobante.totalGravadoCentimos / 100).toFixed(2)}`, rightX, finalY, { align: 'right' });

        doc.text(`IGV (18%):`, labelX, finalY + 6);
        doc.text(`${comprobante.moneda === 'PEN' ? 'S/' : '$'} ${(comprobante.totalIgvCentimos / 100).toFixed(2)}`, rightX, finalY + 6, { align: 'right' });

        doc.setFont(undefined, 'bold');
        doc.text(`IMPORTE TOTAL:`, labelX, finalY + 14);
        doc.text(`${comprobante.moneda === 'PEN' ? 'S/' : '$'} ${(comprobante.totalImporteCentimos / 100).toFixed(2)}`, rightX, finalY + 14, { align: 'right' });

        // --- Footer ---
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(`Representación Impresa de la ${comprobante.tipoComprobante} ELECTRÓNICA.`, 105, pageHeight - 20, { align: 'center' });
        doc.text('Autorizado mediante Resolución de Intendencia No. 034-005-0005315', 105, pageHeight - 15, { align: 'center' });
        doc.text('Consulte su documento en www.dulcecontrol.pe', 105, pageHeight - 10, { align: 'center' });

        doc.save(`${comprobante.serie}-${comprobante.correlativo}.pdf`);
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
    ${comprobante.detalles ? comprobante.detalles.map((detalle, index) => `
    <cac:InvoiceLine>
        <cbc:ID>${index + 1}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="NIU">${detalle.cantidad}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="${comprobante.moneda}">${(detalle.subtotal / 100).toFixed(2)}</cbc:LineExtensionAmount>
        <cac:PricingReference>
            <cac:AlternativeConditionPrice>
                <cbc:PriceAmount currencyID="${comprobante.moneda}">${(detalle.precioUnitario / 100).toFixed(2)}</cbc:PriceAmount>
                <cbc:PriceTypeCode>01</cbc:PriceTypeCode>
            </cac:AlternativeConditionPrice>
        </cac:PricingReference>
        <cac:TaxTotal>
            <cbc:TaxAmount currencyID="${comprobante.moneda}">${((detalle.subtotal * 0.18) / 100).toFixed(2)}</cbc:TaxAmount>
            <cac:TaxSubtotal>
                <cbc:TaxableAmount currencyID="${comprobante.moneda}">${(detalle.subtotal / 100).toFixed(2)}</cbc:TaxableAmount>
                <cbc:TaxAmount currencyID="${comprobante.moneda}">${((detalle.subtotal * 0.18) / 100).toFixed(2)}</cbc:TaxAmount>
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
            <cbc:Description><![CDATA[${detalle.descripcion}]]></cbc:Description>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="${comprobante.moneda}">${(detalle.precioUnitario / 1.18 / 100).toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>`).join('') : ''}
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
                            font-family: 'Arial', sans-serif;
                            color: #000;
                        }
                        #invoice-print-template * {
                            visibility: visible;
                        }
                        /* Hide everything else */
                        .ant-layout-sider, .ant-layout-header, .ant-breadcrumb, .ant-card, .ant-btn, .ant-alert, .no-print {
                            display: none !important;
                        }
                        
                        /* Invoice Styles */
                        .invoice-header {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 30px;
                        }
                        .company-info {
                            flex: 1;
                        }
                        .company-name {
                            font-size: 24px;
                            font-weight: bold;
                            margin-bottom: 5px;
                            text-transform: uppercase;
                        }
                        .company-details {
                            font-size: 12px;
                            line-height: 1.4;
                        }
                        .invoice-box {
                            width: 300px;
                            border: 2px solid #000;
                            text-align: center;
                            padding: 15px;
                            margin-left: 20px;
                        }
                        .invoice-box-ruc {
                            font-size: 14px;
                            font-weight: bold;
                            margin-bottom: 5px;
                        }
                        .invoice-box-type {
                            font-size: 18px;
                            font-weight: bold;
                            background-color: #eee;
                            padding: 5px 0;
                            margin: 5px 0;
                        }
                        .invoice-box-number {
                            font-size: 16px;
                        }
                        
                        .client-info {
                            border: 1px solid #ccc;
                            padding: 10px;
                            margin-bottom: 20px;
                            font-size: 12px;
                        }
                        .info-row {
                            display: flex;
                            margin-bottom: 5px;
                        }
                        .info-label {
                            font-weight: bold;
                            width: 120px;
                        }
                        
                        .items-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                            font-size: 12px;
                        }
                        .items-table th {
                            border: 1px solid #000;
                            padding: 8px;
                            background-color: #eee;
                            text-align: center;
                            font-weight: bold;
                        }
                        .items-table td {
                            border: 1px solid #000;
                            padding: 8px;
                        }
                        .text-right { text-align: right; }
                        .text-center { text-align: center; }
                        
                        .totals-section {
                            display: flex;
                            justify-content: flex-end;
                            margin-bottom: 40px;
                        }
                        .totals-table {
                            width: 300px;
                            border-collapse: collapse;
                            font-size: 12px;
                        }
                        .totals-table td {
                            padding: 5px;
                            border: 1px solid #ccc;
                        }
                        .total-row td {
                            font-weight: bold;
                            background-color: #eee;
                            border: 1px solid #000;
                        }
                        
                        .footer {
                            border-top: 1px solid #000;
                            padding-top: 10px;
                            text-align: center;
                            font-size: 11px;
                        }
                    }
                `}
            </style>

            <div style={{ marginBottom: 16 }} className="no-print">
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/facturacion/comprobantes')}>
                    Volver al listado
                </Button>
            </div>

            {/* Template de Impresión (Factura/Boleta) */}
            <div id="invoice-print-template" style={{ display: 'none' }}>
                <div className="invoice-header">
                    <div className="company-info">
                        <div className="company-name">{comprobante.emisorRazonSocial}</div>
                        <div className="company-details">
                            {comprobante.emisorDireccion}<br />
                            LIMA - LIMA - PERÚ<br />
                            Teléfono: (01) 123-4567<br />
                            Email: contacto@dulcecontrol.pe
                        </div>
                    </div>
                    <div className="invoice-box">
                        <div className="invoice-box-ruc">R.U.C. {comprobante.emisorRuc}</div>
                        <div className="invoice-box-type">{comprobante.tipoComprobante} ELECTRÓNICA</div>
                        <div className="invoice-box-number">{comprobante.serie} - {String(comprobante.correlativo).padStart(8, '0')}</div>
                    </div>
                </div>

                <div className="client-info">
                    <div className="info-row">
                        <div className="info-label">Fecha de Emisión:</div>
                        <div>{dayjs(comprobante.fechaEmision).format('DD/MM/YYYY')}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Señor(es):</div>
                        <div>{comprobante.clienteNombre}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">{comprobante.clienteTipoDoc}:</div>
                        <div>{comprobante.clienteNumeroDoc}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Dirección:</div>
                        <div>{comprobante.clienteDireccion || '-'}</div>
                    </div>
                    <div className="info-row">
                        <div className="info-label">Moneda:</div>
                        <div>{comprobante.moneda === 'PEN' ? 'SOLES' : 'DOLARES AMERICANOS'}</div>
                    </div>
                </div>

                <table className="items-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>Cant.</th>
                            <th style={{ width: '60px' }}>Unidad</th>
                            <th>Descripción</th>
                            <th style={{ width: '80px' }}>P. Unit</th>
                            <th style={{ width: '80px' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comprobante.detalles && comprobante.detalles.map((item, idx) => (
                            <tr key={idx}>
                                <td className="text-center">{item.cantidad}</td>
                                <td className="text-center">NIU</td>
                                <td>{item.descripcion}</td>
                                <td className="text-right">{(item.precioUnitario / 100).toFixed(2)}</td>
                                <td className="text-right">{(item.subtotal / 100).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="totals-section">
                    <table className="totals-table">
                        <tbody>
                            <tr>
                                <td className="text-right">Op. Gravada:</td>
                                <td className="text-right">{comprobante.moneda === 'PEN' ? 'S/' : '$'} {(comprobante.totalGravadoCentimos / 100).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td className="text-right">IGV (18%):</td>
                                <td className="text-right">{comprobante.moneda === 'PEN' ? 'S/' : '$'} {(comprobante.totalIgvCentimos / 100).toFixed(2)}</td>
                            </tr>
                            <tr className="total-row">
                                <td className="text-right">IMPORTE TOTAL:</td>
                                <td className="text-right">{comprobante.moneda === 'PEN' ? 'S/' : '$'} {(comprobante.totalImporteCentimos / 100).toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="footer">
                    <p>Representación Impresa de la {comprobante.tipoComprobante} ELECTRÓNICA.</p>
                    <p>Autorizado mediante Resolución de Intendencia No. 034-005-0005315</p>
                    <p>Consulte su documento en <strong>www.dulcecontrol.pe</strong></p>
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
                                    disabled={comprobante.estadoSunat !== 'ACEPTADO'}
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
                            <Tag color={comprobante.estadoSunat === 'ACEPTADO' ? 'success' : (comprobante.estadoSunat === 'PENDIENTE' ? 'warning' : 'error')}>
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

                    <Divider orientation="left">Totales</Divider>
                    <Row justify="end">
                        <Col xs={24} sm={12} md={8}>
                            <Descriptions bordered column={1} size="small">
                                <Descriptions.Item label="Op. Gravada">
                                    {comprobante.moneda === 'PEN' ? 'S/ ' : '$ '}
                                    {(comprobante.totalGravadoCentimos / 100).toFixed(2)}
                                </Descriptions.Item>
                                <Descriptions.Item label="IGV (18%)">
                                    {comprobante.moneda === 'PEN' ? 'S/ ' : '$ '}
                                    {(comprobante.totalIgvCentimos / 100).toFixed(2)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Importe Total" contentStyle={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {comprobante.moneda === 'PEN' ? 'S/ ' : '$ '}
                                    {(comprobante.totalImporteCentimos / 100).toFixed(2)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>

                    <Divider orientation="left" className="no-print">Facturación Electrónica SUNAT</Divider>
                    <div style={{ marginBottom: 24 }} className="no-print">
                        {comprobante.estadoSunat === 'ACEPTADO' && (
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

                        {comprobante.estadoSunat === 'RECHAZADO' && (
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

                        {comprobante.estadoSunat === 'ANULADO' && (
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
                        {!['ACEPTADO', 'RECHAZADO', 'ANULADO'].includes(comprobante.estadoSunat) && (
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
                                                Forzar Envío
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
        </div>
    );
};

export default FacturacionDetallePage;
