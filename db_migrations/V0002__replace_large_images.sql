-- Замена больших base64 изображений на эмодзи
UPDATE cases SET image = '🎁' WHERE LENGTH(image) > 100000;
UPDATE case_items SET image = '🎁' WHERE LENGTH(image) > 100000;
