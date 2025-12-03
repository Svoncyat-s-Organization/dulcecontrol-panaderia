#!/usr/bin/env node

/**
 * Test manual para validar la lógica de transformación de payload
 * en el módulo de Planificación
 */

console.log('=== TEST: Validación de Payload - Módulo Planificación ===\n');

// Simular valores del formulario
const mockFormValues = {
  fechaConteo: {
    format: (fmt) => '2025-12-02'
  },
  responsableId: undefined,
  observaciones: undefined,
  detalles: [
    { productoId: 1, cantidadFisica: 50, cantidadSistema: 45 },
    { productoId: 2, cantidadFisica: '30', cantidadSistema: '28' }, // Strings para probar conversión
    { productoId: undefined, cantidadFisica: 10, cantidadSistema: 10 }, // Sin productoId (debe filtrarse)
    { productoId: 3, cantidadFisica: null, cantidadSistema: 5 }, // Sin cantidadFisica (debe filtrarse)
    { productoId: 4, cantidadFisica: 20, cantidadSistema: null }, // cantidadSistema null (válido)
  ]
};

// Simular la lógica de handleSubmitConteo
const sedeId = 1;
const formattedDate = '2025-12-02';

console.log('1. Form values recibidos:');
console.log(JSON.stringify(mockFormValues, null, 2));

// Validar que haya detalles
if (!mockFormValues.detalles || mockFormValues.detalles.length === 0) {
  console.error('❌ ERROR: Debes agregar al menos un producto al conteo');
  process.exit(1);
}

// Filtrar detalles válidos (con productoId)
const detallesValidos = mockFormValues.detalles.filter(detalle => 
  detalle && detalle.productoId && detalle.cantidadFisica != null
);

console.log('\n2. Detalles después del filtrado:');
console.log(`Total original: ${mockFormValues.detalles.length}`);
console.log(`Válidos: ${detallesValidos.length}`);
console.log(JSON.stringify(detallesValidos, null, 2));

if (detallesValidos.length === 0) {
  console.error('❌ ERROR: Todos los productos deben tener un productoId y cantidad física válidos');
  process.exit(1);
}

// Construir payload
const payload = {
  sedeId,
  fechaConteo: mockFormValues.fechaConteo
    ? mockFormValues.fechaConteo.format('YYYY-MM-DD')
    : formattedDate,
  responsableId: mockFormValues.responsableId || null,
  observaciones: mockFormValues.observaciones || null,
  detalles: detallesValidos.map((detalle) => ({
    productoId: detalle.productoId,
    cantidadFisica: Number(detalle.cantidadFisica),
    cantidadSistema: detalle.cantidadSistema != null ? Number(detalle.cantidadSistema) : null,
  })),
};

console.log('\n3. Payload final a enviar:');
console.log(JSON.stringify(payload, null, 2));

// Validaciones
console.log('\n=== VALIDACIONES ===');

let errores = 0;

// Validar que sedeId existe
if (!payload.sedeId) {
  console.error('❌ sedeId faltante');
  errores++;
} else {
  console.log('✅ sedeId presente:', payload.sedeId);
}

// Validar formato de fecha
if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.fechaConteo)) {
  console.error('❌ fechaConteo con formato inválido:', payload.fechaConteo);
  errores++;
} else {
  console.log('✅ fechaConteo con formato correcto:', payload.fechaConteo);
}

// Validar que hay detalles
if (!payload.detalles || payload.detalles.length === 0) {
  console.error('❌ detalles vacío');
  errores++;
} else {
  console.log('✅ detalles con', payload.detalles.length, 'items');
}

// Validar cada detalle
payload.detalles.forEach((detalle, index) => {
  console.log(`\nValidando detalle ${index + 1}:`);
  
  // productoId debe existir y ser número
  if (!detalle.productoId || typeof detalle.productoId !== 'number') {
    console.error(`  ❌ productoId inválido:`, detalle.productoId);
    errores++;
  } else {
    console.log(`  ✅ productoId: ${detalle.productoId}`);
  }
  
  // cantidadFisica debe ser número
  if (typeof detalle.cantidadFisica !== 'number') {
    console.error(`  ❌ cantidadFisica no es número:`, detalle.cantidadFisica);
    errores++;
  } else {
    console.log(`  ✅ cantidadFisica: ${detalle.cantidadFisica}`);
  }
  
  // cantidadSistema debe ser número o null
  if (detalle.cantidadSistema !== null && typeof detalle.cantidadSistema !== 'number') {
    console.error(`  ❌ cantidadSistema inválido:`, detalle.cantidadSistema);
    errores++;
  } else {
    console.log(`  ✅ cantidadSistema: ${detalle.cantidadSistema}`);
  }
});

console.log('\n=== RESULTADO ===');
if (errores === 0) {
  console.log('✅ TODOS LOS TESTS PASARON');
  console.log('\nPayload válido y listo para enviar al backend');
  process.exit(0);
} else {
  console.error(`❌ ${errores} ERROR(ES) ENCONTRADO(S)`);
  process.exit(1);
}
