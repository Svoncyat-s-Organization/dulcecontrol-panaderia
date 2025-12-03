import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Divider, message, Spin, Space, Row, Col, Tooltip, Alert } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, FileTextOutlined, FileZipOutlined, Html5Outlined } from '@ant-design/icons';
import { facturacionApi } from '../api/facturacion.api';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import JSZip from 'jszip';

const FacturacionDetallePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [comprobante, setComprobante] = useState(null);
    const [detalles, setDetalles] = useState([]);
    const [seriesList, setSeriesList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDetalle = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [dataComprobante, dataDetalles, dataSeries] = await Promise.all([
                facturacionApi.obtenerComprobante(id),
                facturacionApi.listarDetallesComprobante(id),
                facturacionApi.listarSeries()
            ]);
            setComprobante(dataComprobante);
            setDetalles(dataDetalles);
            setSeriesList(dataSeries);
        } catch (error) {
            console.error('Error cargando detalle:', error);
            message.error('No se pudo cargar el detalle del comprobante');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetalle();
    }, [id]);

    // Hardcoded Issuer Info (Superadmin / SaaS Provider)
    const emisorInfo = {
        razonSocial: 'DULCECONTROL S.A.C.',
        ruc: '20601234567', // Example RUC
        direccion: 'Av. Javier Prado Este 1234, San Isidro, Lima'
    };

    const handleExportarPDF = () => {
        if (!comprobante) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // Helper to get series code
        const serieCode = seriesList.find(s => s.id === comprobante.serieId)?.serie || '???';

        // --- Header ---
        // Title (Top Left)
        doc.setFontSize(40);
        doc.setFont('courier', 'bold');
        doc.setFont(undefined, 'bold');
        doc.text(comprobante.tiposComprobante || 'COMPROBANTE', 14, 25);

        // Logo (Top Right) - Placeholder Circle
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
        doc.text(emisorInfo.razonSocial, 14, startY + 6);

        // Wrap address
        const emisorDirLines = doc.splitTextToSize(emisorInfo.direccion, leftColWidth);
        doc.text(emisorDirLines, 14, startY + 11);

        // Adjust Y for RUC based on address lines
        const rucY = startY + 11 + (emisorDirLines.length * 4);
        doc.text(`RUC: ${emisorInfo.ruc}`, 14, rucY);

        // Invoice Details (Right Side)
        const rightColX = 130; // Moved further right to avoid overlap
        doc.setFont(undefined, 'bold');
        doc.text(`N° DE ${comprobante.tiposComprobante}`, rightColX, startY, { align: 'right' });
        doc.setFont(undefined, 'normal');
        doc.text(`${serieCode}-${String(comprobante.correlativo).padStart(8, '0')}`, pageWidth - 14, startY, { align: 'right' });

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

        if (detalles) {
            detalles.forEach(detail => {
                const detailData = [
                    detail.cantidad,
                    detail.descripcion,
                    (detail.precioUnitarioCentimos / 100).toFixed(2),
                    (detail.totalItemCentimos / 100).toFixed(2)
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

        doc.save(`${serieCode}-${String(comprobante.correlativo).padStart(8, '0')}.pdf`);
    };

    const handleDescargarXML = () => {
        if (!comprobante) return;
        const serieCode = seriesList.find(s => s.id === comprobante.serieId)?.serie || '???';
        const filename = `${emisorInfo.ruc}-01-${serieCode}-${String(comprobante.correlativo).padStart(8, '0')}.xml`;

        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2">
    <UBLVersionID>2.1</UBLVersionID>
    <CustomizationID>2.0</CustomizationID>
    <ID>${serieCode}-${String(comprobante.correlativo).padStart(8, '0')}</ID>
    <IssueDate>${dayjs(comprobante.fechaEmision).format('YYYY-MM-DD')}</IssueDate>
    <IssueTime>${dayjs(comprobante.fechaEmision).format('HH:mm:ss')}</IssueTime>
    <InvoiceTypeCode listAgencyName="PE:SUNAT" listName="Tipo de Documento" listURI="urn:pe:gob:sunat:cpe:see:gem:catalogos:catalogo01">01</InvoiceTypeCode>
    <DocumentCurrencyCode>${comprobante.moneda}</DocumentCurrencyCode>
    <AccountingSupplierParty>
        <Party>
            <PartyIdentification>
                <ID schemeID="6">${emisorInfo.ruc}</ID>
            </PartyIdentification>
            <PartyName>
                <Name><![CDATA[${emisorInfo.razonSocial}]]></Name>
            </PartyName>
            <PartyLegalEntity>
                <RegistrationName><![CDATA[${emisorInfo.razonSocial}]]></RegistrationName>
                <RegistrationAddress>
                    <AddressLine>
                        <Line><![CDATA[${emisorInfo.direccion}]]></Line>
                    </AddressLine>
                </RegistrationAddress>
            </PartyLegalEntity>
        </Party>
    </AccountingSupplierParty>
    <AccountingCustomerParty>
        <Party>
            <PartyIdentification>
                <ID schemeID="6">${comprobante.clienteNumDoc}</ID>
            </PartyIdentification>
            <PartyLegalEntity>
                <RegistrationName><![CDATA[${comprobante.clienteNombreDoc}]]></RegistrationName>
            </PartyLegalEntity>
        </Party>
    </AccountingCustomerParty>
    ${detalles.map((det, index) => `
    <InvoiceLine>
        <ID>${index + 1}</ID>
        <InvoicedQuantity unitCode="NIU">${det.cantidad}</InvoicedQuantity>
        <LineExtensionAmount currencyID="${comprobante.moneda}">${(det.totalItemCentimos / 100).toFixed(2)}</LineExtensionAmount>
        <PricingReference>
            <AlternativeConditionPrice>
                <PriceAmount currencyID="${comprobante.moneda}">${(det.precioUnitarioCentimos / 100).toFixed(2)}</PriceAmount>
                <PriceTypeCode>01</PriceTypeCode>
            </AlternativeConditionPrice>
        </PricingReference>
        <Item>
            <Description><![CDATA[${det.descripcion}]]></Description>
        </Item>
        <Price>
            <PriceAmount currencyID="${comprobante.moneda}">${(det.precioUnitarioCentimos / 100).toFixed(2)}</PriceAmount>
        </Price>
    </InvoiceLine>`).join('')}
    <LegalMonetaryTotal>
        <LineExtensionAmount currencyID="${comprobante.moneda}">${(comprobante.totalGravadoCentimos / 100).toFixed(2)}</LineExtensionAmount>
        <TaxInclusiveAmount currencyID="${comprobante.moneda}">${(comprobante.totalImporteCentimos / 100).toFixed(2)}</TaxInclusiveAmount>
        <PayableAmount currencyID="${comprobante.moneda}">${(comprobante.totalImporteCentimos / 100).toFixed(2)}</PayableAmount>
    </LegalMonetaryTotal>
</Invoice>`;

        const blob = new Blob([xmlContent], { type: 'text/xml' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const handleDescargarCDR = async () => {
        if (!comprobante) return;
        const serieCode = seriesList.find(s => s.id === comprobante.serieId)?.serie || '???';
        const filenameXml = `R-${emisorInfo.ruc}-01-${serieCode}-${String(comprobante.correlativo).padStart(8, '0')}.xml`;
        const filenameZip = `R-${emisorInfo.ruc}-01-${serieCode}-${String(comprobante.correlativo).padStart(8, '0')}.zip`;

        const cdrContent = `<?xml version="1.0" encoding="UTF-8"?>
<ApplicationResponse xmlns="urn:oasis:names:specification:ubl:schema:xsd:ApplicationResponse-2">
    <ID>${serieCode}-${String(comprobante.correlativo).padStart(8, '0')}</ID>
    <ResponseDate>${dayjs().format('YYYY-MM-DD')}</ResponseDate>
    <ResponseTime>${dayjs().format('HH:mm:ss')}</ResponseTime>
    <SenderParty>
        <PartyIdentification>
            <ID schemeID="6">20131312955</ID>
        </PartyIdentification>
        <PartyName>
            <Name>SUNAT</Name>
        </PartyName>
    </SenderParty>
    <ReceiverParty>
        <PartyIdentification>
            <ID schemeID="6">${emisorInfo.ruc}</ID>
        </PartyIdentification>
        <PartyName>
            <Name><![CDATA[${emisorInfo.razonSocial}]]></Name>
        </PartyName>
    </ReceiverParty>
    <DocumentResponse>
        <Response>
            <ReferenceID>${serieCode}-${String(comprobante.correlativo).padStart(8, '0')}</ReferenceID>
            <ResponseCode>0</ResponseCode>
            <Description>La Factura numero ${serieCode}-${String(comprobante.correlativo).padStart(8, '0')}, ha sido aceptada</Description>
        </Response>
    </DocumentResponse>
</ApplicationResponse>`;

        const zip = new JSZip();
        zip.file(filenameXml, cdrContent);
        const content = await zip.generateAsync({ type: "blob" });

        const url = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = filenameZip;
        link.click();
        window.URL.revokeObjectURL(url);
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

    // Helper to get series code
    const serieCode = seriesList.find(s => s.id === comprobante.serieId)?.serie || '???';

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
                    <div className="print-title">{comprobante.tiposComprobante || 'COMPROBANTE'}</div>
                    <div className="print-logo">LOGO</div>
                </div>

                <div className="print-info-row">
                    <div className="print-issuer">
                        <div className="print-issuer-label">DE</div>
                        <div>{emisorInfo.razonSocial}</div>
                        <div>{emisorInfo.direccion}</div>
                        <div style={{ marginTop: 5 }}>RUC: {emisorInfo.ruc}</div>
                    </div>
                    <div className="print-invoice-data">
                        <div className="data-row">
                            <span className="data-label">N° DE {comprobante.tiposComprobante}</span>
                            <span>{serieCode}-{String(comprobante.correlativo).padStart(8, '0')}</span>
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
                        {detalles.map((item, idx) => (
                            <tr key={idx}>
                                <td className="text-center">{item.cantidad}</td>
                                <td>{item.descripcion}</td>
                                <td className="text-right">{(item.precioUnitarioCentimos / 100).toFixed(2)}</td>
                                <td className="text-right">{(item.totalItemCentimos / 100).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="print-totals">
                    <div className="total-row">
                        <span style={{ marginRight: 20 }}>Subtotal</span>
                        <span>{(comprobante.totalGravadoCentimos / 100).toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                        <span style={{ marginRight: 20 }}>IGV 18%</span>
                        <span>{(comprobante.totalIgvCentimos / 100).toFixed(2)}</span>
                    </div>
                    <div className="total-box">
                        <span>TOTAL</span>
                        <span>{comprobante.moneda === 'PEN' ? 'S/' : '$'} {(comprobante.totalImporteCentimos / 100).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="no-print">
                <div style={{ marginBottom: 16 }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/superadmin/facturacion/comprobantes')}>
                        Volver al listado
                    </Button>
                </div>

                <Card
                    title={`Detalle del Comprobante: ${comprobante.serie}-${comprobante.correlativo}`}
                    extra={
                        <Space>
                            <Button
                                icon={<FilePdfOutlined style={{ color: '#f5222d' }} />}
                                onClick={handleExportarPDF}
                            >
                                PDF
                            </Button>
                            <Button
                                icon={<Html5Outlined style={{ color: '#fa8c16' }} />}
                                onClick={() => window.print()}
                            >
                                HTML
                            </Button>
                            <Button
                                icon={<FileTextOutlined style={{ color: '#1890ff' }} />}
                                onClick={handleDescargarXML}
                            >
                                XML
                            </Button>
                            <Button
                                icon={<FileZipOutlined style={{ color: '#52c41a' }} />}
                                onClick={handleDescargarCDR}
                            >
                                CDR
                            </Button>
                        </Space>
                    }
                >
                    <Descriptions title="Información General" bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                        <Descriptions.Item label="Tipo Comprobante">
                            <Tag color={comprobante.tiposComprobante === 'FACTURA' ? 'blue' : (comprobante.tiposComprobante === 'BOLETA' ? 'green' : 'orange')}>
                                {comprobante.tiposComprobante}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Estado SUNAT">
                            <Tag color={comprobante.estadosSunat === 'ACEPTADO' ? 'success' : (comprobante.estadosSunat === 'PENDIENTE' ? 'warning' : 'error')}>
                                {comprobante.estadosSunat || 'PENDIENTE'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Fecha Emisión">
                            {dayjs(comprobante.fechaEmision).format('DD/MM/YYYY HH:mm')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Moneda">
                            {comprobante.moneda}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider orientation="left">Datos del Cliente (Tienda)</Divider>
                    <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                        <Descriptions.Item label="Nombre / Razón Social">
                            {comprobante.clienteNombreDoc}
                        </Descriptions.Item>
                        <Descriptions.Item label="Documento">
                            {comprobante.clienteTipoDoc}: {comprobante.clienteNumDoc}
                        </Descriptions.Item>
                        <Descriptions.Item label="Dirección" span={2}>
                            {comprobante.clienteDireccion || '-'}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider orientation="left">Datos del Emisor (DulceControl)</Divider>
                    <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                        <Descriptions.Item label="Razón Social">
                            {emisorInfo.razonSocial}
                        </Descriptions.Item>
                        <Descriptions.Item label="RUC">
                            {emisorInfo.ruc}
                        </Descriptions.Item>
                        <Descriptions.Item label="Dirección" span={2}>
                            {emisorInfo.direccion}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider orientation="left">Detalles</Divider>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                        <thead>
                            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                                <th style={{ padding: 12, textAlign: 'left' }}>Descripción</th>
                                <th style={{ padding: 12, textAlign: 'center', width: 100 }}>Cantidad</th>
                                <th style={{ padding: 12, textAlign: 'right', width: 150 }}>Precio Unit.</th>
                                <th style={{ padding: 12, textAlign: 'right', width: 150 }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalles.map((item, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: 12 }}>{item.descripcion}</td>
                                    <td style={{ padding: 12, textAlign: 'center' }}>{item.cantidad}</td>
                                    <td style={{ padding: 12, textAlign: 'right' }}>
                                        {(item.precioUnitarioCentimos / 100).toFixed(2)}
                                    </td>
                                    <td style={{ padding: 12, textAlign: 'right' }}>
                                        {(item.totalItemCentimos / 100).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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

                    <Divider orientation="left">Facturación Electrónica SUNAT</Divider>
                    <Alert
                        message={<span style={{ fontWeight: 'bold' }}>Pendiente de Envío</span>}
                        description={
                            <div style={{ marginTop: 8 }}>
                                <div style={{ marginBottom: 12 }}>El comprobante está listo para ser enviado a SUNAT. (Estado actual: {comprobante.estadosSunat?.toLowerCase()})</div>
                                <Space>
                                    <Button size="small" onClick={handleDescargarXML}>Descargar XML</Button>
                                    <Button size="small" onClick={handleDescargarCDR}>Descargar CDR</Button>
                                    <Button type="primary" size="small">Forzar Envío</Button>
                                </Space>
                            </div>
                        }
                        type="info"
                        showIcon
                        style={{ marginBottom: 24, border: '1px solid #91caff', background: '#e6f7ff' }}
                    />

                    <div style={{ textAlign: 'right', color: '#888', fontStyle: 'italic', marginTop: 16 }}>
                        Referencia: Pedido #{comprobante.referenciaId || '2'}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FacturacionDetallePage;
