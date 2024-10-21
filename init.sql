CREATE TABLE IF NOT EXISTS income_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS expense_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL,
    date DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_date ON income_items (date);
CREATE INDEX IF NOT EXISTS idx_date ON expense_items (date);

INSERT INTO income_items (title, amount, date) VALUES
('給与', 300000, '2024-01-01'),
('副収入', 100000, '2024-01-01');

INSERT INTO expense_items (title, amount, date) VALUES
('食費', 100000, '2024-01-01'),
('光熱費', 50000, '2024-01-01'),
('家事費', 30000, '2024-01-01'),
('交際費', 20000, '2024-01-01'),
('その他', 10000, '2024-01-01');
