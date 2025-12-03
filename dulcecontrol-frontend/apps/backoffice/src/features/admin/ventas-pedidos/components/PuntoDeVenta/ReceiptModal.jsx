import { Modal, Typography, Divider, Empty, Button } from 'antd';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import { useMemo, useRef } from 'react';

const { Title, Text } = Typography;

const formatMoney = (value = 0) => {
	const safeValue = Number.isFinite(value) ? value : 0;
	return `S/ ${(safeValue / 100).toFixed(2)}`;
};

const printTicket = (html) => {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return;
	}

	const iframe = document.createElement('iframe');
	iframe.style.position = 'fixed';
	iframe.style.right = '0';
	iframe.style.bottom = '0';
	iframe.style.width = '0';
	iframe.style.height = '0';
	iframe.style.border = '0';
	iframe.style.visibility = 'hidden';

	document.body.appendChild(iframe);
	const printDocument = iframe.contentWindow?.document;
	if (!printDocument) {
		document.body.removeChild(iframe);
		return;
	}

	printDocument.open();
	printDocument.write(`<!DOCTYPE html><html><head><title>Ticket</title>
		<style>
			body { font-family: 'Fira Mono', 'SFMono-Regular', Consolas, monospace; margin: 0; padding: 16px; color: #0f172a; }
			h1, h2, h3, h4, h5, h6 { margin: 0; }
			table { width: 100%; border-collapse: collapse; }
			th, td { padding: 4px 0; font-size: 12px; }
			th { text-align: left; border-bottom: 1px solid #cbd5f5; }
		</style>
	</head><body>${html}</body></html>`);
	printDocument.close();

	const triggerPrint = () => {
		try {
			iframe.contentWindow?.focus();
			iframe.contentWindow?.print();
		} finally {
			document.body.removeChild(iframe);
		}
	};

	setTimeout(triggerPrint, 100);
};

const ReceiptModal = ({ open, onClose, pedido }) => {
	const printAreaRef = useRef(null);
	const items = useMemo(() => (Array.isArray(pedido?.items) ? pedido.items : []), [pedido]);
	const pagos = useMemo(() => (Array.isArray(pedido?.pagos) ? pedido.pagos : []), [pedido]);

	const totalCentimos = pedido?.totalFinalCentimos ?? pedido?.total_final_centimos ?? 0;
	const totalPagado = pagos.reduce((acc, pago) => acc + (pago.montoPagadoCentimos ?? pago.monto_pagado_centimos ?? 0), 0);
	const cambioCentimos = Math.max(0, totalPagado - totalCentimos);
	const notasPedido = pedido?.notasPedido ?? pedido?.notas_pedido ?? null;
	const comprobante = pedido?.comprobante || null;
	const emisorNombre = comprobante?.emisorRazonSocial || pedido?.emisorRazonSocial || 'DulceControl';
	const emisorDireccion = comprobante?.emisorDireccion || pedido?.emisorDireccion || 'Av. Principal 123, Tarapoto';
	const emisorRuc = comprobante?.emisorRuc || pedido?.emisorRuc || '20123456789';
	const tipoComprobante = (comprobante?.tipoComprobante || pedido?.tipoComprobante || pedido?.tipo_comprobante || 'pedido').toString().toLowerCase();
	const serieCodigo = comprobante?.serieCodigo || pedido?.serieComprobante || pedido?.serie_comprobante || null;
	const correlativoNumero = comprobante?.correlativo || pedido?.numeroComprobante || pedido?.numero_comprobante || null;
	const correlativoTexto = correlativoNumero ? String(correlativoNumero).padStart(8, '0') : null;
	const clienteNombre = comprobante?.clienteNombre
		|| pedido?.cliente?.nombreDoc
		|| pedido?.cliente?.nombre_doc
		|| null;
	const clienteDocTipo = comprobante?.clienteTipoDoc
		|| pedido?.cliente?.tipoDoc
		|| pedido?.cliente?.tipo_doc
		|| null;
	const clienteDocNumero = comprobante?.clienteNumeroDoc
		|| pedido?.cliente?.numeroDoc
		|| pedido?.cliente?.numero_doc
		|| null;
	const clienteDireccion = comprobante?.clienteDireccion
		|| pedido?.cliente?.direccion
		|| (pedido?.shipping?.direccion ?? null);
	const mostrarCliente = clienteNombre || clienteDocNumero || pedido?.cliente;

	const handlePrint = () => {
		if (!printAreaRef.current) {
			return;
		}
		printTicket(printAreaRef.current.innerHTML);
	};

	return (
		<Modal open={open} onCancel={onClose} footer={null} width={420} closable={false} destroyOnClose>
			{!pedido ? (
				<Empty description="No hay recibo disponible" />
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Text strong>Comprobante de Pago</Text>
						<Button type="text" icon={<CloseOutlined />} onClick={onClose} aria-label="Cerrar" />
					</div>

					<div
						ref={printAreaRef}
						id="ticket-print-area"
						style={{
							border: '1px solid #e2e8f0',
							borderRadius: 12,
							padding: 24,
							fontFamily: 'Fira Mono, SFMono-Regular, Consolas, monospace',
							background: '#fff',
						}}
					>
						<div style={{ textAlign: 'center', marginBottom: 16 }}>
							<Title level={4} style={{ marginBottom: 4 }}>{emisorNombre}</Title>
							<Text style={{ display: 'block' }}>{emisorDireccion}</Text>
							<Text style={{ display: 'block' }}>RUC: {emisorRuc}</Text>
							{tipoComprobante && (
								<div
									style={{
										marginTop: 12,
										display: 'inline-block',
										border: '1px solid #0f172a',
										padding: '4px 12px',
										fontWeight: 600,
									}}
								>
									{tipoComprobante === 'pedido' ? 'NOTA DE PEDIDO' : `${tipoComprobante.toUpperCase()} ELECTRÓNICA`}
									<br />
									{serieCodigo && correlativoTexto && (
										<span style={{ fontSize: 12, fontWeight: 500 }}>
											Serie {serieCodigo} · Nº {correlativoTexto}
										</span>
									)}
								</div>
							)}
						</div>

						<div style={{ borderBottom: '1px dashed #cbd5f5', paddingBottom: 8, marginBottom: 8 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<span>Ticket:</span>
								<span>{pedido.codigoPedido ?? pedido.codigo_pedido ?? 'POS'}</span>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
								<span>Fecha:</span>
								<span>
									{new Date(pedido.fechaCreacion || pedido.fecha_creacion || Date.now()).toLocaleDateString()}{' '}
									{new Date(pedido.fechaCreacion || pedido.fecha_creacion || Date.now()).toLocaleTimeString()}
								</span>
							</div>
						</div>

						{mostrarCliente && (
							<div style={{ borderBottom: '1px dashed #cbd5f5', paddingBottom: 8, marginBottom: 8 }}>
								<Text strong style={{ display: 'block', marginBottom: 4 }}>Cliente</Text>
								<div>{clienteNombre || pedido?.cliente?.nombreDoc || pedido?.cliente?.nombre_doc || 'Consumidor final'}</div>
								{(clienteDocTipo || clienteDocNumero) && (
									<div>
										{(clienteDocTipo || 'DOC').toUpperCase()}: {clienteDocNumero || '---'}
									</div>
								)}
								{clienteDireccion && <div>Dir: {clienteDireccion}</div>}
							</div>
						)}

						<table style={{ width: '100%', marginBottom: 12 }}>
							<thead>
								<tr style={{ borderBottom: '1px solid #cbd5f5' }}>
									<th style={{ paddingBottom: 4 }}>Cant.</th>
									<th style={{ paddingBottom: 4 }}>Descripción</th>
									<th style={{ paddingBottom: 4, textAlign: 'right' }}>Total</th>
								</tr>
							</thead>
							<tbody>
								{items.map((item, idx) => (
									<tr key={item.id || idx}>
										<td style={{ padding: '4px 0' }}>{item.quantity ?? item.cantidad ?? 0}</td>
										<td style={{ padding: '4px 0' }}>
											<div>{item.nombre || item.descripcion || 'Producto'}</div>
											{(item.customNotes || item.notasItem || item.notas_item) && (
												<div style={{ fontSize: 10, color: '#64748b' }}>
													{item.customNotes || item.notasItem || item.notas_item}
												</div>
											)}
										</td>
										<td style={{ padding: '4px 0', textAlign: 'right' }}>
											{formatMoney(item.subtotalLineaCentimos ?? item.subtotal_linea_centimos ?? 0)}
										</td>
									</tr>
								))}
								{items.length === 0 && (
									<tr>
										<td colSpan={3} style={{ textAlign: 'center', padding: 12 }}>
											Sin productos registrados
										</td>
									</tr>
								)}
							</tbody>
						</table>
						{notasPedido && (
							<div style={{ borderTop: '1px dashed #cbd5f5', padding: '8px 0', fontSize: 12 }}>
								<Text strong style={{ display: 'block', marginBottom: 4 }}>Notas del pedido</Text>
								<div>{notasPedido}</div>
							</div>
						)}

						<div style={{ borderTop: '1px dashed #cbd5f5', paddingTop: 8 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
								<span>Total</span>
								<span>{formatMoney(totalCentimos)}</span>
							</div>
							<Divider style={{ margin: '12px 0' }} />
							<div>
								<Text strong>Pagos</Text>
								<div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
									{pagos.map((pago) => (
										<div key={pago.id || pago.metodoPago} style={{ display: 'flex', justifyContent: 'space-between' }}>
											<span>{(pago.metodoPago ?? pago.metodo_pago ?? 's/d').toUpperCase()}</span>
											<span>{formatMoney(pago.montoPagadoCentimos ?? pago.monto_pagado_centimos ?? 0)}</span>
										</div>
									))}
									{pagos.length === 0 && <Text type="secondary">Sin pagos registrados</Text>}
									{cambioCentimos > 0 && (
										<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
											<span>Cambio</span>
											<span>{formatMoney(cambioCentimos)}</span>
										</div>
									)}
								</div>
							</div>
						</div>

						<div style={{ textAlign: 'center', marginTop: 16, fontSize: 10, color: '#64748b' }}>
							<div>Representación impresa del comprobante electrónico.</div>
							<div>¡Gracias por su preferencia!</div>
						</div>
					</div>

					<Button type="primary" icon={<PrinterOutlined />} block size="large" onClick={handlePrint}>
						Imprimir ticket
					</Button>
				</div>
			)}
		</Modal>
	);
};

export default ReceiptModal;
