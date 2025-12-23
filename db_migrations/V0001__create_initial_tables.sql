-- Таблица для глобальных настроек сайта
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для кейсов
CREATE TABLE cases (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для предметов в кейсах
CREATE TABLE case_items (
    id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    price INTEGER NOT NULL,
    rarity VARCHAR(50) DEFAULT 'common',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_case FOREIGN KEY (case_id) REFERENCES cases(id)
);

-- Таблица для истории открытий кейсов
CREATE TABLE case_openings (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    user_session VARCHAR(255),
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_opening_case FOREIGN KEY (case_id) REFERENCES cases(id),
    CONSTRAINT fk_opening_item FOREIGN KEY (item_id) REFERENCES case_items(id)
);

-- Индексы для быстрого поиска
CREATE INDEX idx_case_items_case_id ON case_items(case_id);
CREATE INDEX idx_case_openings_case_id ON case_openings(case_id);
CREATE INDEX idx_case_openings_user_session ON case_openings(user_session);
CREATE INDEX idx_case_openings_opened_at ON case_openings(opened_at DESC);

-- Вставляем дефолтные настройки сайта
INSERT INTO site_settings (key, value) VALUES
('title', 'CS2 КЕЙСЫ'),
('logo', '🎮'),
('font', 'Rubik'),
('currencyIcon', ''),
('banners', '[]'),
('sections', '[]'),
('navItems', '[{"id":"1","path":"/","label":"Главная","icon":"Home","isVisible":true,"order":1},{"id":"2","path":"/cases","label":"Кейсы","icon":"Package","isVisible":true,"order":2},{"id":"3","path":"/profile","label":"Профиль","icon":"User","isVisible":true,"order":3},{"id":"4","path":"/inventory","label":"Инвентарь","icon":"Backpack","isVisible":true,"order":4},{"id":"5","path":"/free","label":"Халява","icon":"Gift","isVisible":true,"order":5},{"id":"6","path":"/admin","label":"Админ","icon":"Settings","isVisible":true,"order":6}]'),
('styles', '{"primaryColor":"#ff6b35","secondaryColor":"#f72585","accentColor":"#7209b7","backgroundColor":"#0a0a0a","cardColor":"#1a1a1a","borderRadius":"12px"}');