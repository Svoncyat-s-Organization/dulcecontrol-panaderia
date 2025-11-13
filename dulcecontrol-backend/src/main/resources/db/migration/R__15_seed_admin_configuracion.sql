-- ============================================================================
-- R_15: SEED MÓDULO DE CONFIGURACIÓN Y CMS
-- ============================================================================

-- =================================
-- CONFIGURACIÓN DE TIENDAS
-- =================================

INSERT INTO configuracion_tienda (
  tienda_id,
  ruc,
  razon_social,
  direccion_fiscal,
  ubigeo_fiscal,
  usuario_sunat_sol,
  clave_sunat_sol_encriptada,
  certificado_digital_url,
  modo_sunat,
  tasa_igv,
  api_key_yape,
  api_key_plin,
  merchant_id_niubiz,
  banner_principal_url,
  mensaje_bienvenida,
  horario_atencion,
  redes_sociales,
  politicas_envio,
  politicas_devolucion,
  email_notificaciones,
  telegram_bot_token,
  telegram_chat_id
)
VALUES
  -- Configuración Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    '20601234567',
    'Dulce Manjar Sociedad Anónima Cerrada',
    'Av. Larco 789, Miraflores, Lima',
    (SELECT d.codigo_ubigeo FROM ubigeo_distritos d 
     INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id 
     INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id 
     WHERE d.nombre = 'MIRAFLORES' AND p.nombre = 'LIMA' AND dep.nombre = 'LIMA'),
    'MODDATOS',
    'AES256:encrypted_password_here_dm',
    'https://cdn.dulcemanjar.pe/certificados/certificado-digital.pfx',
    'pruebas',
    18.00,
    'yape_api_key_dulcemanjar_prod',
    'plin_api_key_dulcemanjar_prod',
    'merchant_niubiz_456789123',
    'https://cdn.dulcemanjar.pe/banners/principal-navidad-2024.jpg',
    '¡Bienvenidos a Dulce Manjar! La mejor repostería artesanal de Lima. Hacemos tus momentos especiales aún más dulces.',
    JSON_OBJECT(
      'lunes', JSON_OBJECT('abierto', true, 'horario', '07:00 - 21:00'),
      'martes', JSON_OBJECT('abierto', true, 'horario', '07:00 - 21:00'),
      'miercoles', JSON_OBJECT('abierto', true, 'horario', '07:00 - 21:00'),
      'jueves', JSON_OBJECT('abierto', true, 'horario', '07:00 - 21:00'),
      'viernes', JSON_OBJECT('abierto', true, 'horario', '07:00 - 22:00'),
      'sabado', JSON_OBJECT('abierto', true, 'horario', '08:00 - 22:00'),
      'domingo', JSON_OBJECT('abierto', true, 'horario', '08:00 - 20:00')
    ),
    JSON_OBJECT(
      'facebook', 'https://facebook.com/dulcemanjar',
      'instagram', 'https://instagram.com/dulcemanjar_oficial',
      'tiktok', 'https://tiktok.com/@dulcemanjar',
      'whatsapp', '+51987654321'
    ),
    'Realizamos entregas en todo Lima Metropolitana. Tiempo de entrega: 24-48 horas. Costo de envío: S/ 10.00 en Lima y S/ 15.00 en provincia. Entregas gratuitas para compras mayores a S/ 150.00',
    'Aceptamos devoluciones dentro de las primeras 2 horas de entregado el producto, siempre que este se encuentre en perfecto estado y con el empaque original. No aplica para productos personalizados.',
    'pedidos@dulcemanjar.pe',
    'bot_token_telegram_dulcemanjar_123456',
    'chat_id_telegram_dm_789012'
  ),
  -- Configuración Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    '20601234568',
    'Panadería El Sol Empresa Individual de Responsabilidad Limitada',
    'Av. Universitaria 456, Los Olivos, Lima',
    (SELECT d.codigo_ubigeo FROM ubigeo_distritos d 
     INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id 
     INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id 
     WHERE d.nombre = 'LOS OLIVOS' AND p.nombre = 'LIMA' AND dep.nombre = 'LIMA'),
    'MODDATOS',
    'AES256:encrypted_password_here_ps',
    NULL,
    'pruebas',
    18.00,
    NULL,
    NULL,
    NULL,
    'https://cdn.panaderiasol.pe/banners/pan-fresco-banner.jpg',
    'Panadería El Sol - Pan fresco todos los días desde 1995. Calidad y tradición en cada bocado.',
    JSON_OBJECT(
      'lunes', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'martes', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'miercoles', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'jueves', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'viernes', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'sabado', JSON_OBJECT('abierto', true, 'horario', '06:00 - 21:00'),
      'domingo', JSON_OBJECT('abierto', true, 'horario', '07:00 - 19:00')
    ),
    JSON_OBJECT(
      'facebook', 'https://facebook.com/panaderiasol',
      'instagram', 'https://instagram.com/panaderia_elsol',
      'whatsapp', '+51945123456'
    ),
    'Entregas a domicilio en Los Olivos, San Martín de Porres e Independencia. Tiempo de entrega: 1-2 horas. Costo de envío: S/ 5.00. Pedido mínimo: S/ 20.00',
    'Cambios y devoluciones solo el mismo día de la compra, presentando el ticket de compra.',
    'contacto@panaderiasol.pe',
    NULL,
    NULL
  ),
  -- Configuración Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    '20601234569',
    'Tortas & Delicias Sociedad Anónima Cerrada',
    'Av. Benavides 321, Santiago de Surco, Lima',
    (SELECT d.codigo_ubigeo FROM ubigeo_distritos d 
     INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id 
     INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id 
     WHERE d.nombre = 'SANTIAGO DE SURCO' AND p.nombre = 'LIMA' AND dep.nombre = 'LIMA'),
    'MODDATOS',
    'AES256:encrypted_password_here_td',
    'https://cdn.tortasydelicias.pe/certificados/cert-digital.p12',
    'pruebas',
    18.00,
    'yape_api_key_tortasdelicias',
    'plin_api_key_tortasdelicias',
    'merchant_niubiz_987654321',
    'https://cdn.tortasydelicias.pe/banners/tortas-personalizadas.jpg',
    'Bienvenido a Tortas & Delicias. Creamos las tortas más hermosas y deliciosas para tus celebraciones especiales. ¡Hacemos realidad tus sueños más dulces!',
    JSON_OBJECT(
      'lunes', JSON_OBJECT('abierto', false, 'horario', 'Cerrado'),
      'martes', JSON_OBJECT('abierto', true, 'horario', '09:00 - 19:00'),
      'miercoles', JSON_OBJECT('abierto', true, 'horario', '09:00 - 19:00'),
      'jueves', JSON_OBJECT('abierto', true, 'horario', '09:00 - 19:00'),
      'viernes', JSON_OBJECT('abierto', true, 'horario', '09:00 - 20:00'),
      'sabado', JSON_OBJECT('abierto', true, 'horario', '09:00 - 20:00'),
      'domingo', JSON_OBJECT('abierto', true, 'horario', '10:00 - 18:00')
    ),
    JSON_OBJECT(
      'facebook', 'https://facebook.com/tortasydelicias',
      'instagram', 'https://instagram.com/tortas_delicias_oficial',
      'tiktok', 'https://tiktok.com/@tortasydelicias',
      'pinterest', 'https://pinterest.com/tortasydelicias',
      'whatsapp', '+51962345678'
    ),
    'Realizamos entregas en todo Lima. Las tortas personalizadas requieren un pedido anticipado de 48-72 horas. Costo de envío variable según distrito. Consultar disponibilidad.',
    'Las tortas personalizadas no aceptan devoluciones. Para otros productos, aceptamos cambios dentro de las 24 horas posteriores a la entrega si el producto presenta defectos.',
    'ventas@tortasydelicias.pe',
    'bot_token_telegram_td_654321',
    'chat_id_telegram_td_321098'
  )
AS new
ON DUPLICATE KEY UPDATE
  ruc = new.ruc,
  razon_social = new.razon_social,
  direccion_fiscal = new.direccion_fiscal,
  ubigeo_fiscal = new.ubigeo_fiscal,
  usuario_sunat_sol = new.usuario_sunat_sol,
  clave_sunat_sol_encriptada = new.clave_sunat_sol_encriptada,
  certificado_digital_url = new.certificado_digital_url,
  modo_sunat = new.modo_sunat,
  tasa_igv = new.tasa_igv,
  api_key_yape = new.api_key_yape,
  api_key_plin = new.api_key_plin,
  merchant_id_niubiz = new.merchant_id_niubiz,
  banner_principal_url = new.banner_principal_url,
  mensaje_bienvenida = new.mensaje_bienvenida,
  horario_atencion = new.horario_atencion,
  redes_sociales = new.redes_sociales,
  politicas_envio = new.politicas_envio,
  politicas_devolucion = new.politicas_devolucion,
  email_notificaciones = new.email_notificaciones,
  telegram_bot_token = new.telegram_bot_token,
  telegram_chat_id = new.telegram_chat_id;

-- =================================
-- PÁGINAS STOREFRONT (CMS)
-- =================================

INSERT INTO paginas_storefront (tienda_id, slug, titulo, contenido, meta_descripcion, orden_menu, visible_en_menu, activa)
VALUES
  -- Páginas de Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'nosotros',
    'Acerca de Nosotros',
    '<h2>Nuestra Historia</h2>
<p>Dulce Manjar nació en 2010 con un sueño: llevar los mejores sabores de la repostería peruana a cada hogar limeño. Iniciamos como una pequeña panadería familiar en Miraflores y hoy, después de más de 14 años, nos hemos convertido en una de las pastelerías más queridas de Lima.</p>

<h2>Nuestra Misión</h2>
<p>Crear momentos dulces e inolvidables para nuestros clientes, ofreciendo productos de la más alta calidad, elaborados con ingredientes seleccionados y mucho amor.</p>

<h2>Nuestros Valores</h2>
<ul>
<li><strong>Calidad:</strong> Usamos solo los mejores ingredientes</li>
<li><strong>Tradición:</strong> Recetas transmitidas de generación en generación</li>
<li><strong>Innovación:</strong> Constantemente creamos nuevos sabores</li>
<li><strong>Servicio:</strong> Tu satisfacción es nuestra prioridad</li>
</ul>',
    'Conoce la historia de Dulce Manjar, tu panadería y pastelería de confianza en Lima desde 2010',
    1,
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'preguntas-frecuentes',
    'Preguntas Frecuentes',
    '<h2>Pedidos y Entregas</h2>

<h3>¿Cuál es el tiempo de entrega?</h3>
<p>Para productos estándar: 24-48 horas. Para tortas personalizadas: 48-72 horas mínimo.</p>

<h3>¿Cuánto cuesta el delivery?</h3>
<p>S/ 10.00 en Lima Metropolitana y S/ 15.00 en provincia. Gratis para compras mayores a S/ 150.00</p>

<h3>¿Hacen entregas el mismo día?</h3>
<p>Sí, para productos disponibles en stock y dependiendo de la zona. Consulta disponibilidad.</p>

<h2>Productos y Personalizaciones</h2>

<h3>¿Puedo personalizar mi torta?</h3>
<p>¡Por supuesto! Contáctanos con al menos 72 horas de anticipación y te ayudaremos a crear la torta de tus sueños.</p>

<h3>¿Tienen opciones sin azúcar o sin gluten?</h3>
<p>Sí, contamos con una línea de productos light y sin gluten. Consulta disponibilidad.</p>

<h2>Pagos y Facturación</h2>

<h3>¿Qué métodos de pago aceptan?</h3>
<p>Efectivo, tarjetas de débito/crédito, Yape, Plin y transferencia bancaria.</p>

<h3>¿Emiten factura?</h3>
<p>Sí, emitimos boletas y facturas electrónicas. Solicítala al momento de tu compra.</p>',
    'Encuentra respuestas a las preguntas más frecuentes sobre pedidos, entregas y productos en Dulce Manjar',
    2,
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'terminos-y-condiciones',
    'Términos y Condiciones',
    '<h2>Términos y Condiciones de Uso</h2>
<p><em>Última actualización: Noviembre 2024</em></p>

<h3>1. Aceptación de Términos</h3>
<p>Al acceder y utilizar el sitio web de Dulce Manjar, usted acepta estar sujeto a estos términos y condiciones.</p>

<h3>2. Registro de Usuario</h3>
<p>Para realizar compras online, deberá crear una cuenta proporcionando información veraz y actualizada.</p>

<h3>3. Productos y Precios</h3>
<p>Nos reservamos el derecho de modificar precios y disponibilidad sin previo aviso. Los precios incluyen IGV.</p>

<h3>4. Política de Pedidos</h3>
<p>Los pedidos están sujetos a disponibilidad. Nos reservamos el derecho de rechazar pedidos en casos excepcionales.</p>

<h3>5. Entregas</h3>
<p>Los tiempos de entrega son referenciales. Dulce Manjar hará su mejor esfuerzo por cumplir con los plazos establecidos.</p>

<h3>6. Devoluciones y Cambios</h3>
<p>Ver nuestra política de devoluciones específica en la página correspondiente.</p>

<h3>7. Propiedad Intelectual</h3>
<p>Todo el contenido del sitio es propiedad de Dulce Manjar SAC y está protegido por las leyes de propiedad intelectual.</p>

<h3>8. Contacto</h3>
<p>Para cualquier consulta sobre estos términos: pedidos@dulcemanjar.pe</p>',
    'Términos y condiciones de uso del sitio web y servicios de Dulce Manjar',
    99,
    FALSE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'politica-privacidad',
    'Política de Privacidad',
    '<h2>Política de Privacidad</h2>
<p><em>Última actualización: Noviembre 2024</em></p>

<h3>1. Información que Recopilamos</h3>
<p>Recopilamos información personal como nombre, correo electrónico, dirección y teléfono cuando realizas un pedido.</p>

<h3>2. Uso de la Información</h3>
<p>Utilizamos tu información para:</p>
<ul>
<li>Procesar tus pedidos</li>
<li>Enviarte notificaciones sobre tu pedido</li>
<li>Mejorar nuestros servicios</li>
<li>Enviarte promociones (si aceptaste recibirlas)</li>
</ul>

<h3>3. Protección de Datos</h3>
<p>Implementamos medidas de seguridad para proteger tu información personal.</p>

<h3>4. Compartir Información</h3>
<p>No vendemos ni compartimos tu información con terceros, excepto cuando es necesario para procesar tu pedido (servicios de delivery).</p>

<h3>5. Cookies</h3>
<p>Utilizamos cookies para mejorar tu experiencia de navegación.</p>

<h3>6. Tus Derechos</h3>
<p>Tienes derecho a acceder, rectificar o eliminar tus datos personales. Contáctanos en: pedidos@dulcemanjar.pe</p>

<h3>7. Cumplimiento Legal</h3>
<p>Cumplimos con la Ley de Protección de Datos Personales del Perú (Ley N° 29733).</p>',
    'Política de privacidad y protección de datos personales de Dulce Manjar',
    100,
    FALSE,
    TRUE
  ),
  -- Páginas de Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'nosotros',
    'Nuestra Panadería',
    '<h2>Panadería El Sol - Tradición desde 1995</h2>
<p>Por más de 29 años, Panadería El Sol ha sido el lugar favorito de las familias de Los Olivos para disfrutar del mejor pan fresco cada mañana.</p>

<h3>Nuestro Compromiso</h3>
<p>Pan fresco, elaborado diariamente desde las 4 de la mañana con ingredientes de primera calidad. Somos conocidos por nuestro pan francés crujiente y nuestras deliciosas empanadas.</p>

<h3>Ubicación</h3>
<p>Encuéntranos en Av. Universitaria 456, Los Olivos. ¡Te esperamos!</p>',
    'Conoce Panadería El Sol, tu panadería de barrio con pan fresco todos los días desde 1995',
    1,
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'productos',
    'Nuestros Productos',
    '<h2>Lo Mejor de Nuestra Panadería</h2>

<h3>Panes Clásicos</h3>
<p>Pan francés, pan de yema, pan integral, pan de molde y más.</p>

<h3>Especialidades</h3>
<p>Empanadas de carne, pollo y queso. Cachitos, pan con chicharrón.</p>

<h3>Dulces</h3>
<p>Alfajores, suspiros, picarones los fines de semana.</p>

<p>Todos nuestros productos están elaborados con ingredientes frescos y de calidad.</p>',
    'Conoce todos los productos que ofrecemos en Panadería El Sol',
    2,
    TRUE,
    TRUE
  ),
  -- Páginas de Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'nosotros',
    'Sobre Nosotros',
    '<h2>Tortas & Delicias - Arte Comestible</h2>
<p>Somos especialistas en tortas personalizadas y repostería fina. Cada creación es única y está hecha con amor y dedicación.</p>

<h3>Nuestra Especialidad</h3>
<p>Tortas personalizadas para:</p>
<ul>
<li>Cumpleaños infantiles y adultos</li>
<li>Bodas y compromisos</li>
<li>Baby showers</li>
<li>Eventos corporativos</li>
<li>Primeras comuniones y bautizos</li>
</ul>

<h3>¿Por qué elegirnos?</h3>
<p>Trabajamos con fondant, buttercream y las mejores técnicas de decoración. Nuestro equipo de reposteros está altamente capacitado para hacer realidad tus ideas más creativas.</p>',
    'Tortas & Delicias - Especialistas en tortas personalizadas y repostería fina en Lima',
    1,
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'galeria',
    'Galería de Tortas',
    '<h2>Galería de Nuestras Creaciones</h2>
<p>¡Inspírate con algunas de nuestras creaciones más especiales!</p>

<h3>Tortas Infantiles</h3>
<p>Personajes favoritos, superhéroes, princesas y más.</p>

<h3>Tortas de Bodas</h3>
<p>Elegantes diseños de varios pisos, decoradas con flores naturales o de azúcar.</p>

<h3>Tortas Temáticas</h3>
<p>Deportes, profesiones, hobbies - ¡lo que imagines!</p>

<h3>Cupcakes y Mini Tortas</h3>
<p>Perfectos para eventos pequeños y detalles personalizados.</p>

<p>Contáctanos para ver más fotos y cotizar tu torta personalizada.</p>',
    'Galería de tortas personalizadas y creaciones especiales de Tortas & Delicias',
    2,
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'como-ordenar',
    'Cómo Hacer tu Pedido',
    '<h2>Proceso de Pedido de Tortas Personalizadas</h2>

<h3>Paso 1: Cuéntanos tu Idea</h3>
<p>Contáctanos por WhatsApp, correo o visítanos en tienda. Cuéntanos qué tipo de torta deseas, la fecha del evento y el número de porciones.</p>

<h3>Paso 2: Diseño y Cotización</h3>
<p>Te enviaremos diseños de referencia y una cotización detallada.</p>

<h3>Paso 3: Adelanto</h3>
<p>Para confirmar tu pedido, requerimos un adelanto del 50%.</p>

<h3>Paso 4: Confirmación Final</h3>
<p>48 horas antes del evento, confirmamos los detalles finales contigo.</p>

<h3>Paso 5: Entrega</h3>
<p>El día del evento, entregamos tu torta perfecta. Puedes recogerla en tienda o solicitar delivery.</p>

<h3>Tiempos de Anticipación</h3>
<ul>
<li>Tortas personalizadas: 5-7 días</li>
<li>Tortas especiales (3+ pisos): 10-15 días</li>
<li>Bodas: 1 mes mínimo</li>
</ul>',
    'Aprende cómo hacer tu pedido de torta personalizada en Tortas & Delicias',
    3,
    TRUE,
    TRUE
  )
AS new
ON DUPLICATE KEY UPDATE
  titulo = new.titulo,
  contenido = new.contenido,
  meta_descripcion = new.meta_descripcion,
  orden_menu = new.orden_menu,
  visible_en_menu = new.visible_en_menu,
  activa = new.activa;
