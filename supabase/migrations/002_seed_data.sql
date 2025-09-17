-- Insert categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Óculos de Sol', 'oculos-de-sol', 'Proteção e estilo para seus olhos', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=stylish%20sunglasses%20collection%20modern%20display%20luxury%20eyewear&image_size=landscape_4_3'),
('Óculos de Grau', 'oculos-de-grau', 'Correção visual com design moderno', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=prescription%20glasses%20collection%20modern%20optical%20frames&image_size=landscape_4_3'),
('Óculos Esportivos', 'oculos-esportivos', 'Performance e proteção para atividades físicas', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sports%20eyewear%20collection%20athletic%20performance%20glasses&image_size=landscape_4_3');

-- Insert brands
INSERT INTO brands (name, slug, description, logo_url, website_url) VALUES
('Ray-Ban', 'ray-ban', 'Marca icônica de óculos desde 1937', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Ray-Ban%20logo%20iconic%20sunglasses%20brand&image_size=square', 'https://www.ray-ban.com'),
('Oakley', 'oakley', 'Inovação em óculos esportivos e lifestyle', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Oakley%20logo%20sports%20eyewear%20brand&image_size=square', 'https://www.oakley.com'),
('Persol', 'persol', 'Elegância italiana em óculos de luxo', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Persol%20logo%20luxury%20italian%20eyewear&image_size=square', 'https://www.persol.com'),
('Tom Ford', 'tom-ford', 'Luxo e sofisticação em eyewear', 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Tom%20Ford%20logo%20luxury%20fashion%20eyewear&image_size=square', 'https://www.tomford.com');

-- Insert products
INSERT INTO products (name, slug, description, price, sale_price, sku, stock_quantity, category_id, brand_id, images, specifications, features, is_featured, is_active, meta_title, meta_description) VALUES
(
  'Ray-Ban Aviator Classic',
  'ray-ban-aviator-classic',
  'O icônico óculos de sol Aviator da Ray-Ban, criado originalmente para pilotos da força aérea americana. Design atemporal com lentes de cristal e armação em metal dourado.',
  299.99,
  249.99,
  'RB-AV-001',
  25,
  (SELECT id FROM categories WHERE slug = 'oculos-de-sol'),
  (SELECT id FROM brands WHERE slug = 'ray-ban'),
  '["https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Ray-Ban%20Aviator%20classic%20sunglasses%20gold%20frame%20green%20lenses&image_size=square_hd", "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Ray-Ban%20Aviator%20side%20view%20gold%20metal%20frame&image_size=square_hd"]',
  '{"frame_material": "Metal", "lens_material": "Cristal", "lens_width": "58mm", "bridge_width": "14mm", "temple_length": "135mm", "uv_protection": "100%"}',
  '["Proteção UV 100%", "Lentes de cristal", "Armação em metal", "Design icônico", "Estojo incluído"]',
  true,
  true,
  'Ray-Ban Aviator Classic - Óculos de Sol Icônico',
  'Compre o clássico Ray-Ban Aviator com proteção UV 100% e design atemporal. Entrega rápida e garantia.'
),
(
  'Oakley Holbrook',
  'oakley-holbrook',
  'Óculos de sol Oakley Holbrook com design inspirado nos anos 40, 50 e 60. Combina estilo clássico com tecnologia moderna Oakley.',
  189.99,
  NULL,
  'OAK-HOL-001',
  30,
  (SELECT id FROM categories WHERE slug = 'oculos-de-sol'),
  (SELECT id FROM brands WHERE slug = 'oakley'),
  '["https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Oakley%20Holbrook%20sunglasses%20black%20frame%20modern%20design&image_size=square_hd", "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Oakley%20Holbrook%20side%20profile%20sporty%20sunglasses&image_size=square_hd"]',
  '{"frame_material": "O Matter", "lens_material": "Plutonite", "lens_width": "55mm", "bridge_width": "18mm", "temple_length": "137mm", "uv_protection": "100%"}',
  '["Tecnologia Plutonite", "Armação O Matter", "Proteção UV 100%", "Design vintage", "Resistente a impactos"]',
  true,
  true,
  'Oakley Holbrook - Óculos de Sol Vintage',
  'Oakley Holbrook com tecnologia Plutonite e design vintage. Proteção superior e estilo único.'
),
(
  'Persol PO3019S',
  'persol-po3019s',
  'Óculos de sol Persol com design italiano sofisticado. Armação em acetato premium com detalhes únicos da marca italiana.',
  399.99,
  359.99,
  'PER-3019-001',
  15,
  (SELECT id FROM categories WHERE slug = 'oculos-de-sol'),
  (SELECT id FROM brands WHERE slug = 'persol'),
  '["https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Persol%20sunglasses%20italian%20luxury%20acetate%20frame%20elegant&image_size=square_hd", "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Persol%20sunglasses%20side%20view%20luxury%20italian%20design&image_size=square_hd"]',
  '{"frame_material": "Acetato", "lens_material": "Cristal", "lens_width": "54mm", "bridge_width": "20mm", "temple_length": "145mm", "uv_protection": "100%"}',
  '["Acetato italiano premium", "Lentes de cristal", "Design exclusivo", "Proteção UV 100%", "Artesanato italiano"]',
  true,
  true,
  'Persol PO3019S - Luxo Italiano em Óculos',
  'Persol PO3019S com acetato premium italiano. Elegância e sofisticação em cada detalhe.'
),
(
  'Tom Ford Henry',
  'tom-ford-henry',
  'Óculos de grau Tom Ford Henry com design contemporâneo e luxuoso. Armação em acetato premium com detalhes em metal.',
  549.99,
  NULL,
  'TF-HEN-001',
  20,
  (SELECT id FROM categories WHERE slug = 'oculos-de-grau'),
  (SELECT id FROM brands WHERE slug = 'tom-ford'),
  '["https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Tom%20Ford%20prescription%20glasses%20luxury%20acetate%20frame%20contemporary&image_size=square_hd", "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Tom%20Ford%20glasses%20side%20view%20luxury%20eyewear%20design&image_size=square_hd"]',
  '{"frame_material": "Acetato/Metal", "lens_width": "52mm", "bridge_width": "19mm", "temple_length": "145mm", "frame_type": "Full Rim"}',
  '["Acetato premium", "Detalhes em metal", "Design contemporâneo", "Luxo e sofisticação", "Ajuste confortável"]',
  false,
  true,
  'Tom Ford Henry - Óculos de Grau Luxo',
  'Tom Ford Henry com acetato premium e design contemporâneo. Luxo e funcionalidade em óculos de grau.'
),
(
  'Oakley Radar EV Path',
  'oakley-radar-ev-path',
  'Óculos esportivo Oakley Radar EV Path desenvolvido para alta performance. Tecnologia Prizm para melhor visão e contraste.',
  229.99,
  199.99,
  'OAK-RAD-001',
  40,
  (SELECT id FROM categories WHERE slug = 'oculos-esportivos'),
  (SELECT id FROM brands WHERE slug = 'oakley'),
  '["https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Oakley%20Radar%20EV%20Path%20sports%20sunglasses%20performance%20cycling&image_size=square_hd", "https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Oakley%20Radar%20sports%20glasses%20side%20view%20athletic%20performance&image_size=square_hd"]',
  '{"frame_material": "O Matter", "lens_material": "Plutonite", "lens_width": "38mm", "lens_height": "47mm", "uv_protection": "100%", "technology": "Prizm"}',
  '["Tecnologia Prizm", "Design aerodinâmico", "Proteção UV 100%", "Resistente a impactos", "Ideal para esportes"]',
  true,
  true,
  'Oakley Radar EV Path - Óculos Esportivo',
  'Oakley Radar EV Path com tecnologia Prizm para performance esportiva superior. Proteção e visão aprimorada.'
);

-- Data insertion completed successfully