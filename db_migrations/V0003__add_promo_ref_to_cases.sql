-- Добавляем колонку для промо-ссылки (уникальный идентификатор)
ALTER TABLE cases ADD COLUMN promo_ref VARCHAR(100) UNIQUE;

-- Создаем индекс для быстрого поиска по promo_ref
CREATE INDEX idx_cases_promo_ref ON cases(promo_ref);

-- Генерируем начальные promo_ref для существующих кейсов
UPDATE cases SET promo_ref = 'case-' || id WHERE promo_ref IS NULL;