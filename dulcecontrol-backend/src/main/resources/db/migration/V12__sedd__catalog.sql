-- =============================================================================
-- DULCE CONTROL - V12: Datos Iniciales de Catálogos
-- Fecha: 2025-10-11
-- Descripción: Inserts base para categorías, productos, insumos, recetas, inventarios y clientes
-- =============================================================================

SET search_path = dulce_control, public;

-- =============================================================================
-- 1. CATEGORÍAS DE PRODUCTO
-- =============================================================================
INSERT INTO categoria_producto (nombre, descripcion, activo) VALUES
('Panes', 'Variedad de panes artesanales y comerciales', TRUE),
('Pasteles', 'Tortas, queques y postres decorativos', TRUE),
('Bebidas', 'Bebidas calientes y frías para acompañar', TRUE),
('Snacks', 'Productos ligeros y empaquetados para llevar', TRUE);

-- =============================================================================
-- 2. PRODUCTOS
-- =============================================================================
INSERT INTO producto (codigo, nombre, descripcion, categoria_id, unidad_medida, precio_venta, visible_storefront, slug, activo)
VALUES
-- PANES (1)
('PAN001', 'Pan Francés', 'Pan tradicional de corteza crujiente', 1, 'unidad', 0.80, TRUE, 'pan-frances', TRUE),
('PAN002', 'Pan Integral', 'Pan saludable elaborado con harina integral', 1, 'unidad', 1.20, TRUE, 'pan-integral', TRUE),
('PAN003', 'Pan de Centeno', 'Pan oscuro con harina de centeno', 1, 'unidad', 1.50, TRUE, 'pan-centeno', TRUE),
('PAN004', 'Pan de Yema', 'Pan suave tradicional con yema de huevo', 1, 'unidad', 1.00, TRUE, 'pan-yema', TRUE),
('PAN005', 'Pan de Molde', 'Pan cuadrado ideal para sándwiches', 1, 'unidad', 1.80, TRUE, 'pan-molde', TRUE),
('PAN006', 'Pan de Avena', 'Pan con granos de avena y miel natural', 1, 'unidad', 1.50, TRUE, 'pan-avena', TRUE),
('PAN007', 'Pan Ciabatta', 'Pan artesanal italiano con miga aireada', 1, 'unidad', 2.00, TRUE, 'pan-ciabatta', TRUE),
('PAN008', 'Pan de Maíz', 'Pan ligeramente dulce con harina de maíz', 1, 'unidad', 1.40, TRUE, 'pan-maiz', TRUE),
('PAN009', 'Pan de Quinua', 'Pan andino con harina de quinua', 1, 'unidad', 1.80, TRUE, 'pan-quinua', TRUE),
('PAN010', 'Pan de Salvado', 'Pan rico en fibra con salvado de trigo', 1, 'unidad', 1.50, TRUE, 'pan-salvado', TRUE),
('PAN011', 'Pan de Ajo', 'Pan con mantequilla de ajo horneado', 1, 'unidad', 2.00, TRUE, 'pan-ajo', TRUE),
('PAN012', 'Pan Brioche', 'Pan dulce y esponjoso con mantequilla', 1, 'unidad', 2.50, TRUE, 'pan-brioche', TRUE),
('PAN013', 'Pan Baguette', 'Clásico pan francés alargado y crujiente', 1, 'unidad', 1.40, TRUE, 'pan-baguette', TRUE),
('PAN014', 'Pan de Queso', 'Panecillo relleno con queso fundido', 1, 'unidad', 2.00, TRUE, 'pan-queso', TRUE),
('PAN015', 'Pan de Papa', 'Pan tierno hecho con puré de papa', 1, 'unidad', 1.90, TRUE, 'pan-papa', TRUE),

-- PASTELES (2)
('PAS001', 'Torta de Chocolate', 'Bizcocho húmedo de cacao con cobertura', 2, 'unidad', 25.00, TRUE, 'torta-chocolate', TRUE),
('PAS002', 'Torta de Fresa', 'Bizcocho relleno de crema y fresas naturales', 2, 'unidad', 28.00, TRUE, 'torta-fresa', TRUE),
('PAS003', 'Torta Tres Leches', 'Bizcocho bañado en mezcla de tres leches', 2, 'unidad', 27.00, TRUE, 'torta-tres-leches', TRUE),
('PAS004', 'Tarta de Manzana', 'Base de masa quebrada con relleno de manzana', 2, 'unidad', 20.00, TRUE, 'tarta-manzana', TRUE),
('PAS005', 'Cheesecake de Maracuyá', 'Pastel de queso con cobertura tropical', 2, 'unidad', 30.00, TRUE, 'cheesecake-maracuya', TRUE),
('PAS006', 'Queque de Zanahoria', 'Bizcocho húmedo con ralladura de zanahoria', 2, 'unidad', 15.00, TRUE, 'queque-zanahoria', TRUE),
('PAS007', 'Brownie de Chocolate', 'Brownie denso con nueces y cacao puro', 2, 'unidad', 5.00, TRUE, 'brownie-chocolate', TRUE),
('PAS008', 'Cupcake de Vainilla', 'Mini pastel decorado con crema batida', 2, 'unidad', 4.00, TRUE, 'cupcake-vainilla', TRUE),
('PAS009', 'Torta Selva Negra', 'Bizcocho de chocolate con cerezas y crema', 2, 'unidad', 32.00, TRUE, 'torta-selva-negra', TRUE),
('PAS010', 'Torta Red Velvet', 'Pastel rojo con glaseado de queso crema', 2, 'unidad', 30.00, TRUE, 'torta-red-velvet', TRUE),
('PAS011', 'Cheesecake de Fresa', 'Pastel cremoso con cobertura de fresa', 2, 'unidad', 28.00, TRUE, 'cheesecake-fresa', TRUE),
('PAS012', 'Pie de Limón', 'Postre ácido y dulce con merengue', 2, 'unidad', 18.00, TRUE, 'pie-limon', TRUE),
('PAS013', 'Cupcake de Red Velvet', 'Mini pastel con crema de queso', 2, 'unidad', 5.00, TRUE, 'cupcake-red-velvet', TRUE),
('PAS014', 'Queque Marmoleado', 'Bizcocho bicolor de vainilla y chocolate', 2, 'unidad', 16.00, TRUE, 'queque-marmoleado', TRUE),
('PAS015', 'Cupcake de Chocolate', 'Mini pastel de cacao con frosting', 2, 'unidad', 4.50, TRUE, 'cupcake-chocolate', TRUE),

-- BEBIDAS (3)
('BEB001', 'Café Americano', 'Café negro caliente servido en taza', 3, 'taza', 4.00, TRUE, 'cafe-americano', TRUE),
('BEB002', 'Café Capuccino', 'Café espresso con leche espumada', 3, 'taza', 5.50, TRUE, 'cafe-capuccino', TRUE),
('BEB003', 'Chocolate Caliente', 'Bebida de cacao natural con leche', 3, 'taza', 6.00, TRUE, 'chocolate-caliente', TRUE),
('BEB004', 'Limonada Natural', 'Refrescante jugo de limón con hielo', 3, 'vaso', 4.00, TRUE, 'limonada-natural', TRUE),
('BEB005', 'Jugo de Naranja', 'Zumo de naranja recién exprimido', 3, 'vaso', 5.00, TRUE, 'jugo-naranja', TRUE),
('BEB006', 'Batido de Fresa', 'Bebida fría de leche con fresas naturales', 3, 'vaso', 6.00, TRUE, 'batido-fresa', TRUE),
('BEB007', 'Agua Mineral', 'Agua embotellada sin gas', 3, 'botella', 2.00, TRUE, 'agua-mineral', TRUE),
('BEB008', 'Café Latte', 'Café con leche vaporizada', 3, 'taza', 6.00, TRUE, 'cafe-latte', TRUE),
('BEB009', 'Té de Manzanilla', 'Infusión relajante natural', 3, 'taza', 3.50, TRUE, 'te-manzanilla', TRUE),
('BEB010', 'Smoothie de Mango', 'Batido de mango con yogurt natural', 3, 'vaso', 6.00, TRUE, 'smoothie-mango', TRUE),

-- SNACKS (4)
('SNK001', 'Empanada de Pollo', 'Empanada rellena de pollo y especias', 4, 'unidad', 3.00, TRUE, 'empanada-pollo', TRUE),
('SNK002', 'Empanada de Carne', 'Empanada de carne molida sazonada', 4, 'unidad', 3.50, TRUE, 'empanada-carne', TRUE),
('SNK003', 'Galleta de Avena', 'Galleta casera con avena y pasas', 4, 'unidad', 1.50, TRUE, 'galleta-avena', TRUE),
('SNK004', 'Galleta de Chips', 'Galleta con chispas de chocolate', 4, 'unidad', 1.80, TRUE, 'galleta-chips', TRUE),
('SNK005', 'Mini Sandwich Jamón y Queso', 'Sandwich pequeño de pan artesanal', 4, 'unidad', 4.00, TRUE, 'mini-sandwich-jamon-queso', TRUE),
('SNK006', 'Palitos de Queso', 'Bastones de masa rellenos de queso fundido', 4, 'unidad', 3.00, TRUE, 'palitos-queso', TRUE),
('SNK007', 'Rollito de Canela', 'Pan enrollado con canela y azúcar morena', 4, 'unidad', 2.50, TRUE, 'rollito-canela', TRUE),
('SNK008', 'Pastelito de Manzana', 'Mini pastel relleno de compota de manzana', 4, 'unidad', 3.00, TRUE, 'pastelito-manzana', TRUE),
('SNK009', 'Alfajor de Maicena', 'Dulce tradicional con manjar blanco', 4, 'unidad', 2.00, TRUE, 'alfajor-maicena', TRUE),
('SNK010', 'Mini Pizza', 'Bocadillo con salsa y queso derretido', 4, 'unidad', 4.50, TRUE, 'mini-pizza', TRUE),
('SNK011', 'Tequeños', 'Deditos rellenos de queso', 4, 'porción', 6.00, TRUE, 'tequenos', TRUE),
('SNK012', 'Empanada de Queso', 'Empanada rellena con queso fresco', 4, 'unidad', 3.00, TRUE, 'empanada-queso', TRUE);


-- =============================================================================
-- 3. IMÁGENES DE PRODUCTO (CORREGIDO)
-- =============================================================================
INSERT INTO producto_imagen (producto_id, url, orden)
SELECT p.id, i.url, i.orden
FROM (VALUES
    -- panes
    ('PAN001','https://panoli.pe/wp-content/uploads/2020/02/MG_3604.jpg',1),
    ('PAN002','https://wongfood.vtexassets.com/arquivos/ids/672489/Pan-Integral-5un-1-351660505.jpg?v=638345434421500000',1),
    ('PAN003','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4itbyjpFXsCSnzfdKGvcsaObU3x0tKyYUsQ&s',1),
    ('PAN004','https://plazavea.vteximg.com.br/arquivos/ids/169432-450-450/76371.jpg?v=635769970954370000',1),
    ('PAN005','https://cdn.elcocinerocasero.com/imagen/receta/1200/2024-03-10-20-14-57/pan-de-molde-casero.jpeg',1),
    ('PAN006','https://imag.bonviveur.com/pan-de-avena.jpg',1),
    ('PAN007','https://i.blogs.es/977907/pan-ciabatta-o-chapata/840_560.jpg',1),
    ('PAN008','https://bonpanperu.com/wp-content/uploads/2023/10/Pan-de-maizweb-1.jpg',1),
    ('PAN009','https://comedera.com/wp-content/uploads/sites/9/2022/03/Pan-de-quinoa-shutterstock_2064537989.jpg',1),
    ('PAN010','https://resizer.glanacion.com/resizer/v2/pan-casero-de-salvado-de-GJLJBX77UJGF7L3ROBQ3WC6OLY.jpg?auth=b8eea4606971e22e498cc05f2460f40d15731041a0036c412f970ae68e084947&width=1280&height=854&quality=70&smart=true',1),
    ('PAN011','https://i.blogs.es/8e3bfe/pan_ajo/840_560.jpg',1),
    ('PAN012','https://cdn0.uncomo.com/es/posts/9/1/9/como_hacer_brioche_casero_23919_600.jpg',1),
    ('PAN013','https://cuk-it.com/wp-content/uploads/2020/07/pan-baguette-casero.webp',1),
    ('PAN014','https://imag.bonviveur.com/pan-de-queso.jpg',1),
    ('PAN015','https://cuk-it.com/wp-content/uploads/2022/07/pan-papa-web-3.webp',1),
    -- pasteles
    ('PAS001','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDOcHMGBbuR8XR737BVuDcS1mTJgf51bWobQ&s',1),
    ('PAS002','https://i.ytimg.com/vi/VYyDb1D4YPc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAQUB0z5ORFyrMFKN19tE61V4X3YQ',1),
    ('PAS003','https://rauletti.com/413-large_default/torta-tres-leches-vainilla-22.jpg',1),
    ('PAS004','https://cdn0.recetasgratis.net/es/posts/7/3/3/torta_invertida_de_manzanas_56337_orig.jpg',1),
    ('PAS005','https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/997faf56321975c360c0a50d5b77448c.jpg',1),
    ('PAS006','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfVwg3nyvc4Xn5K7sG-e7e_6Dh-o0PfKjVrQ&s',1),
    ('PAS007','https://images.aws.nestle.recipes/original/2024_10_28T12_26_14_badun_images.badun.es_42c16b87405b_brownie_de_chocolate_con_leche.jpg',1),
    ('PAS008','https://www.apega.pe/wp-content/uploads/2025/07/receta-de-cupcakes-de-vainilla-800x445.jpg.webp',1),
    ('PAS009','https://www.vlady.com.pe/reposteria/img_chantilly/selvanegra_detalles.jpg',1),
    ('PAS010','https://www.infobae.com/new-resizer/DGoMOTuyK29Gwu_0GG0rzZg4VGk=/arc-anglerfish-arc2-prod-infobae/public/52E6H6YM2NHAHHAR6S7SL47SEM.jpg',1),
    ('PAS011','https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/7f9ebeaceea909a80306da27f0495c59.jpg',1),
    ('PAS012','https://www.recetasnestle.com.pe/sites/default/files/srh_recipes/048eaabd06e27a57624b5ed079537b08.jpg',1),
    ('PAS013','https://cloudfront-us-east-1.images.arcpublishing.com/infobae/DYURSDMUVBHNPISHWNRZMUK5GA.jpg',1),
    ('PAS014','https://www.apega.pe/wp-content/uploads/2025/06/receta-de-queque-marmoleado-800x445.jpg.webp',1),
    ('PAS015','https://img-global.cpcdn.com/recipes/07e9e74b4d4e501f/1200x630cq80/photo.jpg',1),
    -- bebidas
    ('BEB001','https://cdn.recetasderechupete.com/wp-content/uploads/2023/11/Cafe-americano-portada.jpg',1),
    ('BEB002','https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Cappuccino_PeB.jpg/1200px-Cappuccino_PeB.jpg',1),
    ('BEB003','https://www.splenda.com/wp-content/themes/bistrotheme/assets/recipe-images/make-ahead-hot-cocoa-mix.jpg',1),
    ('BEB004','https://d36fw6y2wq3bat.cloudfront.net/recipes/limonada-refrescante/900/limonada-refrescante_version_1652876871.jpg',1),
    ('BEB005','https://libbys.es/wordpress/wp-content/uploads/2019/07/jugonaranja.jpg',1),
    ('BEB006','https://enrilemoine.com/wp-content/uploads/2014/09/Batido-de-fresas-y-avena-SAVOIR-FAIRE-by-enrilemoine-scaled.webp',1),
    ('BEB007','https://media.falabella.com/tottusPE/10225059_1/w=1500,h=1500,fit=pad',1),
    ('BEB008','https://cdn7.kiwilimon.com/recetaimagen/36986/640x640/46349.jpg.jpg',1),
    ('BEB009','https://image.tuasaude.com/media/article/l4/4r/beneficios-do-cha-de-camomila_13768.jpghttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc0049BEB009',1),
    ('BEB010','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP8WH2D5BgPHcYgXJzHC_y0W-R3oftIZKlzg&s',1),
    -- snacks
    ('SNK001','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtI0Xy_Aus-gUo2it1Wbl9i2X1AN4FijUcGQ&s',1),
    ('SNK002','https://comedera.com/wp-content/uploads/sites/9/2022/07/Empanada-peruana-shutterstock_102114526.jpg',1),
    ('SNK003','https://cdn0.recetasgratis.net/es/posts/3/0/3/galletas_de_avena_faciles_y_rapidas_67303_orig.jpg',1),
    ('SNK004','https://www.gourmet.cl/wp-content/uploads/2018/02/Galletas-2-1-570x458.jpg',1),
    ('SNK005','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSujDfwVPYh39-1-8wEJOpRaunsQg0luBnAgA&s',1),
    ('SNK006','https://3.bp.blogspot.com/-cfe-6hbMNxw/VS3jAi4tUZI/AAAAAAAACMI/06H6HcpjrgI/s1600/DedosQueso%2BSyS1.jpg',1),
    ('SNK007','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXWhV5Xaf7i80TfL9atQsbJurUQNYgFg6AuA&s',1),
    ('SNK008','https://resizer.glanacion.com/resizer/v2/-6HMTUWA62BCWDOKM4BYOXBPPZI.jpg?auth=dc733d2785f0bd5017d584b1427b4c3cc601edd0f795ce73c845dd9c3ae1096b&width=420&height=280&quality=70&smart=true',1),
    ('SNK009','https://www.gourmet.cl/wp-content/uploads/2019/10/Alfajor-de-maicena.jpg',1),
    ('SNK010','https://www.kingarthurbaking.com/sites/default/files/styles/featured_image/public/2024-11/Personal-Pan-Pizzas_Hero1_HOR_BOTW_058.jpg?itok=gAMYi3T9',1),
    ('SNK011','https://jameaperu.com/assets/images/tequenos_800x534.webp',1),
    ('SNK012','https://i.ytimg.com/vi/RKZrqSeSXEE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA2wr8xqXSJ-2cCYBWDP5MYq8xqLA',1)
) AS i(codigo, url, orden)
JOIN producto p ON p.codigo = i.codigo;

-- =============================================================================
-- 4. INSUMOS (EXPANDIDOS)
-- =============================================================================
INSERT INTO insumo (codigo, nombre, descripcion, unidad_medida, costo_referencia, activo) VALUES
('INS001', 'Harina de Trigo', 'Harina refinada para panadería', 'kg', 3.50, TRUE),
('INS002', 'Azúcar Blanca', 'Azúcar refinada de mesa', 'kg', 2.80, TRUE),
('INS003', 'Levadura Seca', 'Levadura para fermentación de masas', 'kg', 25.00, TRUE),
('INS004', 'Huevos', 'Huevos frescos para repostería', 'docena', 9.00, TRUE),
('INS005', 'Leche Evaporada', 'Leche evaporada enlatada', 'lt', 6.00, TRUE),
('INS006', 'Chocolate en Polvo', 'Polvo de cacao puro para repostería', 'kg', 18.00, TRUE),
('INS007', 'Mantequilla', 'Grasa natural para hornear', 'kg', 15.00, TRUE),
('INS008', 'Pollo Desmenuzado', 'Relleno para empanadas', 'kg', 22.00, TRUE),
('INS009', 'Café Molido', 'Café tostado y molido para bebidas', 'kg', 40.00, TRUE),
('INS010', 'Harina Integral', 'Harina de trigo integral', 'kg', 4.20, TRUE),
('INS011', 'Harina de Centeno', 'Harina oscura de centeno', 'kg', 5.50, TRUE),
('INS012', 'Avena en Hojuelas', 'Avena tradicional para panadería', 'kg', 3.80, TRUE),
('INS013', 'Maíz Molido', 'Harina de maíz amarillo', 'kg', 3.20, TRUE),
('INS014', 'Quinua', 'Granos de quinua lavada', 'kg', 8.00, TRUE),
('INS015', 'Salvado de Trigo', 'Salvado para panes integrales', 'kg', 4.50, TRUE),
('INS016', 'Ajo Molido', 'Ajo deshidratado molido', 'kg', 28.00, TRUE),
('INS017', 'Queso Mozzarella', 'Queso para derretir', 'kg', 32.00, TRUE),
('INS018', 'Papa', 'Papa amarilla para panadería', 'kg', 2.50, TRUE),
('INS019', 'Fresas Naturales', 'Fresas frescas para repostería', 'kg', 12.00, TRUE),
('INS020', 'Maracuyá', 'Pulpa de maracuyá natural', 'kg', 15.00, TRUE),
('INS021', 'Zanahoria', 'Zanahoria fresca rallada', 'kg', 3.00, TRUE),
('INS022', 'Nueces', 'Nueces peladas para brownies', 'kg', 25.00, TRUE),
('INS023', 'Vainilla', 'Esencia de vainilla natural', 'lt', 45.00, TRUE),
('INS024', 'Cerezas', 'Cerezas en almíbar', 'kg', 18.00, TRUE),
('INS025', 'Limón', 'Limón fresco para repostería', 'kg', 4.00, TRUE),
('INS026', 'Canela Molida', 'Canela en polvo para aromatizar', 'kg', 35.00, TRUE),
('INS027', 'Jamón de Pavo', 'Jamón para sándwiches', 'kg', 28.00, TRUE),
('INS028', 'Manzana', 'Manzana para rellenos', 'kg', 5.00, TRUE),
('INS029', 'Maicena', 'Almidón de maíz para alfajores', 'kg', 4.80, TRUE),
('INS030', 'Manjar Blanco', 'Dulce de leche tradicional', 'kg', 12.00, TRUE),
('INS031', 'Salsa de Tomate', 'Salsa para pizzas', 'lt', 8.00, TRUE),
('INS032', 'Masa de Hojaldre', 'Masa preformada para tequeños', 'kg', 18.00, TRUE),
('INS033', 'Queso Fresco', 'Queso blanco para empanadas', 'kg', 26.00, TRUE),
('INS034', 'Carne Molida', 'Carne de res molida', 'kg', 30.00, TRUE),
('INS035', 'Especias para Carne', 'Mezcla de especias', 'kg', 42.00, TRUE),
('INS036', 'Pasas', 'Pasas de uva para galletas', 'kg', 15.00, TRUE),
('INS037', 'Chips de Chocolate', 'Chispas de chocolate', 'kg', 22.00, TRUE),
('INS038', 'Azúcar Morena', 'Azúcar sin refinar', 'kg', 3.50, TRUE),
('INS039', 'Miel de Abeja', 'Miel natural para endulzar', 'kg', 20.00, TRUE),
('INS040', 'Yogurt Natural', 'Yogurt para smoothies', 'lt', 12.00, TRUE),
('INS041', 'Té de Manzanilla', 'Té en bolsitas', 'caja', 15.00, TRUE),
('INS042', 'Agua Mineral', 'Agua embotellada', 'botella', 1.20, TRUE),
('INS043', 'Naranjas', 'Naranjas para jugo', 'kg', 4.00, TRUE),
('INS044', 'Mango', 'Mango para smoothies', 'kg', 6.00, TRUE),
('INS045', 'Limones', 'Limones para limonada', 'kg', 3.50, TRUE);

-- =============================================================================
-- 5. RECETAS (PARA TODOS LOS PRODUCTOS)
-- =============================================================================
INSERT INTO receta (producto_id, descripcion, activo) VALUES
(1, 'Preparación clásica de pan francés con levadura y harina', TRUE),
(2, 'Pan integral con mezcla de harinas y azúcar rubia', TRUE),
(3, 'Pan de centeno con harina especial y melaza', TRUE),
(4, 'Pan suave con yema de huevo y mantequilla', TRUE),
(5, 'Pan de molde blanco para sándwiches', TRUE),
(6, 'Pan con copos de avena y miel natural', TRUE),
(7, 'Pan artesanal italiano de miga alveolada', TRUE),
(8, 'Pan dulce con harina de maíz', TRUE),
(9, 'Pan andino nutritivo con quinua', TRUE),
(10, 'Pan rico en fibra con salvado de trigo', TRUE),
(11, 'Pan aromatizado con mantequilla de ajo', TRUE),
(12, 'Pan dulce y esponjoso estilo francés', TRUE),
(13, 'Pan baguette tradicional de corteza crujiente', TRUE),
(14, 'Panecillos rellenos de queso fundido', TRUE),
(15, 'Pan tierno con puré de papa natural', TRUE),
(16, 'Bizcocho húmedo de chocolate con cobertura', TRUE),
(17, 'Torta de fresa con crema batida natural', TRUE),
(18, 'Bizcocho bañado en mezcla de tres leches', TRUE),
(19, 'Tarta de manzana con base de masa quebrada', TRUE),
(20, 'Cheesecake cremoso con topping de maracuyá', TRUE),
(21, 'Queque húmedo con zanahoria rallada', TRUE),
(22, 'Brownie denso con nueces y chocolate', TRUE),
(23, 'Cupcake de vainilla con frosting', TRUE),
(24, 'Torta alemana con cerezas y chocolate', TRUE),
(25, 'Pastel rojo velvet con crema de queso', TRUE),
(26, 'Cheesecake con coulis de fresa', TRUE),
(27, 'Pie de limón con merengue italiano', TRUE),
(28, 'Cupcake red velvet mini', TRUE),
(29, 'Queque marmoleado de vainilla y chocolate', TRUE),
(30, 'Cupcake de chocolate con buttercream', TRUE),
-- Snacks (31-42)
(31, 'Masa de empanada rellena con pollo desmenuzado', TRUE),
(32, 'Masa de empanada rellena con carne molida sazonada', TRUE),
(33, 'Galletas de avena con pasas', TRUE),
(34, 'Galletas con chispas de chocolate', TRUE),
(35, 'Mini sándwich de jamón y queso', TRUE),
(36, 'Bastones de masa rellenos de queso', TRUE),
(37, 'Pan enrollado con canela y azúcar morena', TRUE),
(38, 'Mini pastel relleno de compota de manzana', TRUE),
(39, 'Alfajores de maicena con manjar blanco', TRUE),
(40, 'Mini pizza con salsa y queso', TRUE),
(41, 'Deditos de queso envueltos en masa', TRUE),
(42, 'Empanada rellena con queso fresco', TRUE),
-- Bebidas (43-45)
(43, 'Bebida de cacao natural con leche', TRUE),
(44, 'Refrescante jugo de limón con hielo', TRUE),
(45, 'Zumo de naranja recién exprimido', TRUE);

-- =============================================================================
-- 6. INGREDIENTES - RECETA_ITEM (EXPANDIDOS)
-- =============================================================================
-- Pan Francés (1)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(1, 1, 1.000, 'kg'),
(1, 2, 0.050, 'kg'),
(1, 3, 0.025, 'kg'),
(1, 7, 0.040, 'kg');

-- Pan Integral (2)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(2, 10, 0.700, 'kg'),
(2, 1, 0.300, 'kg'),
(2, 2, 0.030, 'kg'),
(2, 3, 0.020, 'kg'),
(2, 39, 0.020, 'kg');

-- Pan de Centeno (3)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(3, 11, 0.800, 'kg'),
(3, 1, 0.200, 'kg'),
(3, 3, 0.025, 'kg'),
(3, 38, 0.040, 'kg');

-- Pan de Yema (4)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(4, 1, 1.000, 'kg'),
(4, 4, 0.250, 'docena'),
(4, 7, 0.080, 'kg'),
(4, 2, 0.060, 'kg');

-- Pan de Avena (6)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(6, 1, 0.800, 'kg'),
(6, 12, 0.200, 'kg'),
(6, 39, 0.050, 'kg'),
(6, 3, 0.020, 'kg');

-- Pan de Ajo (11)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(11, 1, 1.000, 'kg'),
(11, 7, 0.100, 'kg'),
(11, 16, 0.030, 'kg'),
(11, 26, 0.010, 'kg');

-- Pan de Queso (14)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(14, 1, 0.900, 'kg'),
(14, 17, 0.300, 'kg'),
(14, 4, 0.167, 'docena'),
(14, 7, 0.060, 'kg');

-- Torta de Chocolate (16)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(16, 1, 0.500, 'kg'),
(16, 2, 0.400, 'kg'),
(16, 4, 0.500, 'docena'),
(16, 6, 0.200, 'kg'),
(16, 7, 0.300, 'kg'),
(16, 5, 0.300, 'lt');

-- Torta de Fresa (17)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(17, 1, 0.450, 'kg'),
(17, 2, 0.350, 'kg'),
(17, 4, 0.417, 'docena'),
(17, 19, 0.500, 'kg'),
(17, 7, 0.250, 'kg'),
(17, 23, 0.020, 'lt');

-- Cheesecake de Maracuyá (20)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(20, 7, 0.200, 'kg'),
(20, 2, 0.150, 'kg'),
(20, 4, 0.333, 'docena'),
(20, 20, 0.400, 'kg'),
(20, 23, 0.015, 'lt');

-- Brownie de Chocolate (22)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(22, 1, 0.300, 'kg'),
(22, 2, 0.450, 'kg'),
(22, 6, 0.250, 'kg'),
(22, 7, 0.200, 'kg'),
(22, 4, 0.250, 'docena'),
(22, 22, 0.100, 'kg');

-- Empanada de Pollo (31 - SNK001)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(31, 1, 0.300, 'kg'),
(31, 8, 0.250, 'kg'),
(31, 7, 0.050, 'kg'),
(31, 4, 0.083, 'docena');

-- Empanada de Carne (32 - SNK002)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(32, 1, 0.300, 'kg'),
(32, 34, 0.250, 'kg'),
(32, 35, 0.010, 'kg'),
(32, 7, 0.050, 'kg');

-- Galleta de Avena (33 - SNK003)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(33, 1, 0.400, 'kg'),
(33, 12, 0.200, 'kg'),
(33, 2, 0.150, 'kg'),
(33, 7, 0.100, 'kg'),
(33, 36, 0.080, 'kg');

-- Galleta de Chips (34 - SNK004)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(34, 1, 0.450, 'kg'),
(34, 2, 0.200, 'kg'),
(34, 7, 0.120, 'kg'),
(34, 37, 0.180, 'kg');

-- Café Americano (41 - BEB001)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(41, 9, 0.020, 'kg');

-- Chocolate Caliente (43 - BEB003)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(43, 6, 0.050, 'kg'),
(43, 5, 0.200, 'lt'),
(43, 2, 0.030, 'kg');

-- Limonada Natural (44 - BEB004)
INSERT INTO receta_item (receta_id, insumo_id, cantidad, unidad_medida) VALUES
(44, 45, 0.150, 'kg'),
(44, 2, 0.080, 'kg'),
(44, 42, 1.000, 'botella');

-- =============================================================================
-- 7. INVENTARIO POR SEDE (EXPANDIDO)
-- =============================================================================
-- Sede Principal (1) - Inventario completo
INSERT INTO inventario_producto (sede_id, producto_id, stock_actual, stock_minimo) VALUES
(1, 1, 200, 50), (1, 2, 150, 30), (1, 3, 80, 20), (1, 4, 120, 25), (1, 5, 90, 20),
(1, 6, 70, 15), (1, 7, 60, 12), (1, 8, 85, 18), (1, 9, 50, 10), (1, 10, 65, 15),
(1, 11, 45, 10), (1, 12, 55, 12), (1, 13, 75, 15), (1, 14, 40, 8), (1, 15, 35, 8),
(1, 16, 15, 3), (1, 17, 12, 2), (1, 18, 18, 3), (1, 19, 10, 2), (1, 20, 8, 2),
(1, 21, 20, 4), (1, 22, 25, 5), (1, 23, 30, 6), (1, 24, 12, 2), (1, 25, 10, 2),
(1, 26, 14, 3), (1, 27, 16, 3), (1, 28, 22, 5), (1, 29, 18, 4), (1, 30, 20, 4),
(1, 31, 35, 8), (1, 32, 28, 6), (1, 33, 40, 10), (1, 34, 45, 10), (1, 35, 25, 6),
(1, 36, 30, 7), (1, 37, 20, 5), (1, 38, 22, 5), (1, 39, 18, 4), (1, 40, 15, 3),
(1, 41, 50, 12), (1, 42, 100, 25), (1, 43, 80, 20), (1, 44, 60, 15), (1, 45, 70, 18);

-- Sucursal Norte (2) - Inventario selectivo
INSERT INTO inventario_producto (sede_id, producto_id, stock_actual, stock_minimo) VALUES
(2, 1, 120, 30), (2, 2, 90, 20), (2, 3, 50, 12), (2, 4, 80, 18), (2, 5, 60, 15),
(2, 6, 40, 10), (2, 7, 35, 8), (2, 11, 25, 6), (2, 13, 45, 10), (2, 14, 20, 5),
(2, 16, 8, 2), (2, 17, 6, 1), (2, 22, 15, 4), (2, 23, 18, 4), (2, 31, 20, 5),
(2, 32, 15, 4), (2, 33, 25, 6), (2, 34, 30, 7), (2, 41, 30, 8), (2, 42, 60, 15),
(2, 43, 40, 10), (2, 44, 35, 9);

-- Sucursal Sur (3) - Inventario selectivo
INSERT INTO inventario_producto (sede_id, producto_id, stock_actual, stock_minimo) VALUES
(3, 1, 150, 35), (3, 2, 80, 18), (3, 4, 60, 15), (3, 5, 45, 10), (3, 8, 35, 8),
(3, 10, 40, 10), (3, 12, 30, 7), (3, 15, 25, 6), (3, 16, 10, 2), (3, 18, 12, 3),
(3, 21, 15, 4), (3, 22, 20, 5), (3, 27, 18, 4), (3, 31, 25, 6), (3, 35, 20, 5),
(3, 37, 15, 4), (3, 39, 12, 3), (3, 41, 25, 6), (3, 42, 50, 12), (3, 44, 30, 8),
(3, 45, 40, 10);

-- =============================================================================
-- 8. CONFIGURACIÓN DE STOCK IDEAL (EXPANDIDO)
-- =============================================================================
-- Sede Principal (1)
INSERT INTO inventario_config (sede_id, producto_id, stock_ideal) VALUES
(1, 1, 250), (1, 2, 200), (1, 3, 100), (1, 4, 150), (1, 5, 120),
(1, 6, 90), (1, 7, 80), (1, 8, 110), (1, 9, 70), (1, 10, 85),
(1, 11, 60), (1, 12, 70), (1, 13, 100), (1, 14, 55), (1, 15, 50),
(1, 16, 25), (1, 17, 20), (1, 18, 25), (1, 19, 15), (1, 20, 12),
(1, 21, 30), (1, 22, 35), (1, 23, 40), (1, 24, 18), (1, 25, 15),
(1, 26, 20), (1, 27, 22), (1, 28, 30), (1, 29, 25), (1, 30, 28);

-- Sucursal Norte (2)
INSERT INTO inventario_config (sede_id, producto_id, stock_ideal) VALUES
(2, 1, 150), (2, 2, 120), (2, 3, 70), (2, 4, 100), (2, 5, 80),
(2, 6, 55), (2, 7, 50), (2, 11, 35), (2, 13, 60), (2, 14, 30),
(2, 16, 12), (2, 17, 10), (2, 22, 20), (2, 23, 25), (2, 31, 30);

-- Sucursal Sur (3)
INSERT INTO inventario_config (sede_id, producto_id, stock_ideal) VALUES
(3, 1, 180), (3, 2, 100), (3, 4, 80), (3, 5, 60), (3, 8, 45),
(3, 10, 55), (3, 12, 40), (3, 15, 35), (3, 16, 15), (3, 18, 18),
(3, 21, 20), (3, 22, 25), (3, 27, 25), (3, 31, 35), (3, 35, 25);

-- =============================================================================
-- 9. CLIENTES DE PRUEBA (EXPANDIDOS)
-- =============================================================================
INSERT INTO cliente (nombre, telefono, email, direccion) VALUES
('Pedro Castillo', '+51 999 111 888', 'pedro.castillo@example.com', 'Av. Los Álamos 123, Lima'),
('Lucía Ramírez', '+51 999 222 999', 'lucia.ramirez@example.com', 'Jr. Las Flores 456, San Martín de Porres'),
('Roberto Gómez', '+51 999 333 000', 'roberto.gomez@example.com', 'Av. Miraflores 789, Miraflores'),
('Elena Torres', '+51 999 444 111', 'elena.torres@example.com', 'Calle Los Jazmines 321, Surco'),
('Empresa DulceManía S.A.C.', '+51 999 555 222', 'ventas@dulcemania.pe', 'Parque Industrial 456, Ate'),
('María Fernández', '+51 999 666 333', 'maria.fernandez@example.com', 'Av. La Marina 2345, San Miguel'),
('Carlos Rodríguez', '+51 999 777 444', 'carlos.rodriguez@example.com', 'Jr. Unión 567, Centro de Lima'),
('Ana Mendoza', '+51 999 888 555', 'ana.mendoza@example.com', 'Calle Las Gardenias 890, La Molina'),
('Javier López', '+51 999 999 666', 'javier.lopez@example.com', 'Av. Javier Prado 1234, San Isidro'),
('Isabel Castro', '+51 999 000 777', 'isabel.castro@example.com', 'Urb. Los Próceres 456, Surquillo'),
('Restaurant El Hornero', '+51 999 111 999', 'reservas@elhornero.pe', 'Av. Reducto 789, Miraflores'),
('Cafetería Aromas', '+51 999 222 000', 'pedidos@aromas.com', 'Calle Schell 234, Miraflores'),
('Hotel Plaza Mayor', '+51 999 333 111', 'compras@plazamayor.com', 'Av. Garcilaso de la Vega 1456, Cercado'),
('Colegio San Agustín', '+51 999 444 222', 'administracion@sanagustin.edu.pe', 'Av. San Agustín 789, Surco'),
('Oficinas Corporativas ABC', '+51 999 555 333', 'servicios@abccorporacion.com', 'Av. República de Panamá 3456, La Victoria'),
('Sofía Gutierrez', '+51 999 666 444', 'sofia.gutierrez@example.com', 'Jr. Los Pinos 123, Barranco'),
('Miguel Ángel Ruiz', '+51 999 777 555', 'miguel.ruiz@example.com', 'Av. Benavides 2789, Miraflores'),
('Carmen Vallejo', '+51 999 888 666', 'carmen.vallejo@example.com', 'Calle Los Olivos 456, Lince'),
('David Paredes', '+51 999 999 777', 'david.paredes@example.com', 'Av. Arequipa 2345, Lince'),
('Restaurant La Tradición', '+51 999 000 888', 'contacto@latradicion.com', 'Jr. De la Unión 678, Centro de Lima');