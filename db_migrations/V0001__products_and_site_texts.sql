CREATE TABLE t_p76524370_stylish_premium_stor.products (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL, old_price INTEGER, category TEXT NOT NULL, gender TEXT NOT NULL,
 colors JSONB NOT NULL DEFAULT '[]', sizes JSONB NOT NULL DEFAULT '[]', image TEXT NOT NULL DEFAULT '', badge TEXT, material TEXT NOT NULL DEFAULT '',
 description TEXT NOT NULL DEFAULT '', position TEXT, sort_order INTEGER NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT TRUE, is_hero BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMP NOT NULL DEFAULT NOW());
INSERT INTO t_p76524370_stylish_premium_stor.products (id,name,price,old_price,category,gender,colors,sizes,image,badge,material,description,position,sort_order) VALUES
('coat-oversize','Пальто оверсайз, шерсть',24900,NULL,'Верхняя одежда','Женщинам','[{"name": "Кэмел", "hex": "#B08A63"}, {"name": "Чёрный", "hex": "#121826"}, {"name": "Серый", "hex": "#9AA0AB"}]','["XS", "S", "M", "L"]','https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/a10dd1d2-63f2-463a-a480-e5b4961fe8c7.jpg','Бестселлер','80% шерсть, 20% кашемир','Свободный силуэт, спущенное плечо и глубокие карманы. Держит форму и тепло до −10 °C.','70% 50%',0),
('knit-cashmere','Свитер из кашемира',14500,NULL,'Трикотаж','Женщинам','[{"name": "Молочный", "hex": "#E8E1D3"}, {"name": "Серый", "hex": "#9AA0AB"}, {"name": "Чёрный", "hex": "#121826"}]','["XS", "S", "M", "L", "XL"]','https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/84f2fe58-5e11-48c7-b2a8-f39657916b2d.jpg','Новинка','100% кашемир, Монголия','Объёмная вязка, мягкий рукав и высокий ворот. Не колется, не скатывается.',NULL,1),
('blazer-navy','Двубортный пиджак',21900,NULL,'Пиджаки','Мужчинам','[{"name": "Тёмно-синий", "hex": "#1D2A4A"}, {"name": "Чёрный", "hex": "#121826"}]','["S", "M", "L", "XL"]','https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/93cb6911-5b71-49e8-acf6-10d5b6fcdb45.jpg','Новинка','100% тонкая шерсть','Шесть пуговиц, мягкое плечо без подплечников, полуподкладка из купро.',NULL,2),
('dress-linen','Платье-комбинация, лён',11900,14900,'Платья','Женщинам','[{"name": "Чёрный", "hex": "#121826"}, {"name": "Молочный", "hex": "#E8E1D3"}]','["XS", "S", "M"]','https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/f7a23ce2-e6b9-4a0b-bcd4-073a31c3dc99.jpg',NULL,'100% европейский лён','Длина миди, тонкие бретели, косой крой — садится по фигуре без лишних деталей.',NULL,3),
('shirt-poplin','Рубашка оверсайз, поплин',7900,NULL,'Рубашки','Мужчинам','[{"name": "Белый", "hex": "#F4F4F2"}, {"name": "Тёмно-синий", "hex": "#1D2A4A"}]','["S", "M", "L", "XL"]','https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/8338b75d-4e73-43d1-885b-7686f38a3495.jpg','Бестселлер','100% хлопок поплин','Плотный хлопок, удлинённая спинка, перламутровые пуговицы.',NULL,4),
('trousers-wool','Брюки широкие, шерсть',12400,NULL,'Брюки','Женщинам','[{"name": "Серый", "hex": "#9AA0AB"}, {"name": "Чёрный", "hex": "#121826"}]','["XS", "S", "M", "L"]','https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/84f2fe58-5e11-48c7-b2a8-f39657916b2d.jpg',NULL,'70% шерсть, 30% вискоза','Высокая посадка, заутюженные стрелки, длина в пол.','50% 85%',5),
('coat-men','Пальто прямое, кашемир',32900,NULL,'Верхняя одежда','Мужчинам','[{"name": "Тёмно-синий", "hex": "#1D2A4A"}, {"name": "Кэмел", "hex": "#B08A63"}]','["M", "L", "XL"]','https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/93cb6911-5b71-49e8-acf6-10d5b6fcdb45.jpg','Новинка','90% шерсть, 10% кашемир','Классика с потайной застёжкой и шлицей. На каждый день и на десять лет вперёд.','50% 20%',6),
('trousers-men','Брюки со стрелками',9900,11900,'Брюки','Мужчинам','[{"name": "Серый", "hex": "#9AA0AB"}, {"name": "Чёрный", "hex": "#121826"}]','["S", "M", "L", "XL"]','https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/8338b75d-4e73-43d1-885b-7686f38a3495.jpg',NULL,'Шерсть с эластаном','Прямой крой, средняя посадка, ткань не мнётся в поездках.','50% 80%',7);
UPDATE t_p76524370_stylish_premium_stor.products SET is_hero=TRUE WHERE id='coat-oversize';
CREATE TABLE t_p76524370_stylish_premium_stor.site_texts (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '', label TEXT NOT NULL, section TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0);
INSERT INTO t_p76524370_stylish_premium_stor.site_texts (key,value,label,section,sort_order) VALUES
('brand.logo','норд','Слово-логотип','Бренд',0),
('hero.title','Осень–зима 2026.
Шерсть, кашемир, лён','Заголовок коллекции','Первый экран',1),
('hero.button','Смотреть коллекцию','Кнопка коллекции','Первый экран',2),
('hero.image','https://cdn.poehali.dev/projects/0a858c52-a45b-4398-b9f5-a590a9e3f5e0/files/a10dd1d2-63f2-463a-a480-e5b4961fe8c7.jpg','Фото коллекции (ссылка)','Первый экран',3),
('hero.badge','БЕСТСЕЛЛЕР','Бейдж бестселлера','Первый экран',4),
('hero.cta','В корзину','Кнопка бестселлера','Первый экран',5),
('catalog.label','Каталог','Надпись над заголовком','Каталог',6),
('catalog.title','Вся коллекция','Заголовок каталога','Каталог',7),
('footer.fact1_n','30 дней','Факт 1 — цифра','Подвал',8),
('footer.fact1_t','на возврат без вопросов','Факт 1 — текст','Подвал',9),
('footer.fact2_n','1–3 дня','Факт 2 — цифра','Подвал',10),
('footer.fact2_t','доставка по России','Факт 2 — текст','Подвал',11),
('footer.fact3_n','от 15 000 ₽','Факт 3 — цифра','Подвал',12),
('footer.fact3_t','бесплатная доставка','Факт 3 — текст','Подвал',13),
('footer.fact4_n','100%','Факт 4 — цифра','Подвал',14),
('footer.fact4_t','натуральные ткани','Факт 4 — текст','Подвал',15),
('footer.subscribe_title','Новая коллекция — раньше всех','Заголовок подписки','Подвал',16),
('footer.subscribe_button','Подписаться','Кнопка подписки','Подвал',17),
('footer.phone','8 800 000-00-00','Телефон','Подвал',18),
('footer.copyright','© 2026 норд. Одежда без сезона.','Подпись внизу','Подвал',19);