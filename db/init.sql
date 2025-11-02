-- Clients
-- Les numéros de téléphone peuvent contenir des signes + pour l’indicatif international (+33), ou même des espaces, tirets ou parenthèses si on garde le format

CREATE TABLE IF NOT EXISTS clients (

  client_id SERIAL PRIMARY KEY,
  email VARCHAR(256) UNIQUE NOT NULL,
  password VARCHAR(256) NOT NULL,
  first_name VARCHAR(256) NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  town TEXT NOT NULL,
  postcode VARCHAR(256) NOT NULL,
  country VARCHAR(256) NOT NULL,
  birth_year TEXT NOT NULL,
  registration_year INT NOT NULL,
  is_subscribed_to_newsletter BOOLEAN DEFAULT FALSE,
  is_2fa_enabled BOOLEAN DEFAULT FALSE,
  twofa_secret TEXT,
  twofa_temp_secret TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


-- Tokens (pour réinitialiser le mot de passe)

CREATE TABLE IF NOT EXISTS reset_password_tokens (

  id SERIAL PRIMARY KEY,
  client_id INT UNIQUE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);


-- Produits 

CREATE TABLE IF NOT EXISTS products (

  product_id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  category VARCHAR(256),
  image_path VARCHAR(256) NOT NULL
);


-- Inventaire des stocks
-- inventory_id identifie distinctement chaque ligne où on a le même id de produit avec des tailles différentes 
-- (ex : inventory_id=1 pour product_id=1 taille=S et inventory_id=2 pour product_id=1 taille=M)
-- dans inventory, on peut avoir le même id de produit sur plusieurs lignes à condition d'avoir une taille différente

CREATE TABLE IF NOT EXISTS inventory (

  inventory_id SERIAL PRIMARY KEY,
  product_id INT,
  size VARCHAR(256),
  unit_price DECIMAL(5,2) NOT NULL,
  currency VARCHAR(256),
  available_quantity INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Paniers

CREATE TABLE IF NOT EXISTS shopping_carts (

  shopping_cart_id SERIAL PRIMARY KEY,
  client_id INT,
  product_id INT,
  product_size VARCHAR(256),
  product_quantity INT NOT NULL,
  inventory_id INT,
  FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) ON DELETE CASCADE
);

-- Clients

INSERT INTO clients (email, password, first_name, last_name, phone_number, address, town, postcode, country, birth_year, registration_year)
VALUES
('alice@example.com', 'password123', 'Alice', 'Martin', '+33 6 00 00 00 01', '12 Rue de Paris', 'Paris', '75001', 'France', '1990', '2020'),
('bob@example.com', 'secret456', 'Bob', 'Durand', '+33 7 11 22 33 44', '34 Avenue Victor Hugo', 'Lyon', '69000', 'France', '1985', '2019'),
('carol@example.com', 'mypassword', 'Carol', 'Petit', '+33 1 23 45 67 89', '56 Boulevard Saint-Germain', 'Paris', '75005', 'France', '1992', '2021'),
('david@example.com', 'davidpass', 'David', 'Moreau', '+33 9 87 65 43 21', '78 Rue Lafayette', 'Marseille', '13001', 'France', '1988', '2018');

-- Produits

INSERT INTO products (name, category, image_path)
VALUES
('Apron', 'Garden', '/assets/VerticalScrollingBoard/img/board/clothes/Apron.jpg'),
('Bandana', 'Winter', '/assets/VerticalScrollingBoard/img/board/clothes/Bandana.jpg'),
('Beret_A', 'Hats', '/assets/VerticalScrollingBoard/img/board/clothes/Beret_A.jpg'),
('Beret_B', 'Hats', '/assets/VerticalScrollingBoard/img/board/clothes/Beret_B.jpg'),
('Bonnet', 'Winter', '/assets/VerticalScrollingBoard/img/board/clothes/Bonnet.jpg'),
('Boots', 'Garden', '/assets/VerticalScrollingBoard/img/board/clothes/Boots.jpg'),
('Bucket_hat', 'Hats', '/assets/VerticalScrollingBoard/img/board/clothes/Bucket_hat.jpg'),
('Cap', 'Hats', '/assets/VerticalScrollingBoard/img/board/clothes/Cap.jpg'),
('Coat', 'Tops', '/assets/VerticalScrollingBoard/img/board/clothes/Coat.jpg'),
('Dress_shirt', 'Tops', '/assets/VerticalScrollingBoard/img/board/clothes/Dress_shirt.jpg'),
('Gloves', 'Winter', '/assets/VerticalScrollingBoard/img/board/clothes/Gloves.jpg'),
('Hat', 'Hats', '/assets/VerticalScrollingBoard/img/board/clothes/Hat.jpg'),
('Hoodie', '2025WinterCollection', '/assets/VerticalScrollingBoard/img/board/clothes/Hoodie.jpg'),
('Oven_mitt', 'Garden', '/assets/VerticalScrollingBoard/img/board/clothes/Oven_mitt.jpg'),
('Overalls', '2025SummerCollection', '/assets/VerticalScrollingBoard/img/board/clothes/Overalls.jpg'),
('Poncho', '2025WinterCollection', '/assets/VerticalScrollingBoard/img/board/clothes/Poncho.jpg'),
('Potholders', 'Garden', '/assets/VerticalScrollingBoard/img/board/clothes/Potholders.jpg'),
('Pullover', 'Winter', '/assets/VerticalScrollingBoard/img/board/clothes/Pullover.jpg'),
('Raincoat', 'Garden', '/assets/VerticalScrollingBoard/img/board/clothes/Raincoat.jpg'),
('Scarf', 'Winter', '/assets/VerticalScrollingBoard/img/board/clothes/Scarf.jpg'),
('Shawl', 'Winter', '/assets/VerticalScrollingBoard/img/board/clothes/Shawl.jpg'),
('Shoes', 'Bottoms', '/assets/VerticalScrollingBoard/img/board/clothes/Shoes.jpg'),
('Short_A', 'Bottoms', '/assets/VerticalScrollingBoard/img/board/clothes/Short_A.jpg'),
('Short_B', 'Bottoms', '/assets/VerticalScrollingBoard/img/board/clothes/Short_B.jpg'),
('Slippers', 'Bottoms', '/assets/VerticalScrollingBoard/img/board/clothes/Slippers.jpg'),
('Socks', 'Bottoms', '/assets/VerticalScrollingBoard/img/board/clothes/Socks.jpg'),
('Support_stockings', 'Bottoms', '/assets/VerticalScrollingBoard/img/board/clothes/Support_stockings.jpg'),
('Tank_top', '2025SummerCollection', '/assets/VerticalScrollingBoard/img/board/clothes/Tank_top.jpg'),
('Tie', 'Tops', '/assets/VerticalScrollingBoard/img/board/clothes/Tie.jpg'),
('Trousers', 'Bottoms', '/assets/VerticalScrollingBoard/img/board/clothes/Trousers.jpg'),
('Tshirt', 'Tops', '/assets/VerticalScrollingBoard/img/board/clothes/Tshirt.jpg'),
('Zipup_hoodie', 'Tops', '/assets/VerticalScrollingBoard/img/board/clothes/Zipzup_hoodie.jpg'),
('Jewellery1', 'Jewellery', '/assets/VerticalScrollingBoard/img/board/clothes/jewellery1.jpg'),
('Jewellery2', 'Jewellery', '/assets/VerticalScrollingBoard/img/board/clothes/jewellery2.jpg'),
('Jewellery3', 'Jewellery', '/assets/VerticalScrollingBoard/img/board/clothes/jewellery3.jpg'),
('Jewellery4', 'Jewellery', '/assets/VerticalScrollingBoard/img/board/clothes/jewellery4.jpg'),
('Jewellery5', 'Jewellery', '/assets/VerticalScrollingBoard/img/board/clothes/jewellery5.jpg'),
('Jewellery6', 'Jewellery', '/assets/VerticalScrollingBoard/img/board/clothes/jewellery6.jpg');

-- Inventaire des stocks

INSERT INTO inventory (inventory_id, product_id, size, unit_price, currency, available_quantity) VALUES
(1, 1, 'S', 12.99, 'EUR', 50),
(2, 1, 'M', 12.99, 'EUR', 40),
(3, 1, 'L', 12.99, 'EUR', 30),
(4, 2, 'S', 8.50, 'EUR', 100),
(5, 2, 'M', 8.50, 'EUR', 80),
(6, 2, 'L', 8.50, 'EUR', 60),
(7, 3, 'S', 15.00, 'EUR', 25),
(8, 3, 'M', 15.00, 'EUR', 20),
(9, 3, 'L', 15.00, 'EUR', 15),
(10, 4, 'S', 14.50, 'EUR', 30),
(11, 4, 'M', 14.50, 'EUR', 25),
(12, 4, 'L', 14.50, 'EUR', 20),
(13, 5, 'S', 10.00, 'EUR', 60),
(14, 5, 'M', 10.00, 'EUR', 50),
(15, 5, 'L', 10.00, 'EUR', 40),
(16, 6, '40', 50.00, 'EUR', 20),
(17, 6, '41', 50.00, 'EUR', 15),
(18, 6, '42', 50.00, 'EUR', 10),
(19, 7, 'S', 13.00, 'EUR', 35),
(20, 7, 'M', 13.00, 'EUR', 30),
(21, 7, 'L', 13.00, 'EUR', 25),
(22, 8, 'S', 9.99, 'EUR', 50),
(23, 8, 'M', 9.99, 'EUR', 40),
(24, 8, 'L', 9.99, 'EUR', 30),
(25, 9, 'S', 60.00, 'EUR', 15),
(26, 9, 'M', 60.00, 'EUR', 10),
(27, 9, 'L', 60.00, 'EUR', 5),
(28, 10, 'S', 20.00, 'EUR', 45),
(29, 10, 'M', 20.00, 'EUR', 40),
(30, 10, 'L', 20.00, 'EUR', 35),
(31, 11, 'S', 7.50, 'EUR', 70),
(32, 11, 'M', 7.50, 'EUR', 60),
(33, 11, 'L', 7.50, 'EUR', 50),
(34, 12, 'S', 25.00, 'EUR', 10),
(35, 12, 'M', 25.00, 'EUR', 8),
(36, 12, 'L', 25.00, 'EUR', 5),
(37, 13, 'S', 35.00, 'EUR', 20),
(38, 13, 'M', 35.00, 'EUR', 15),
(39, 13, 'L', 35.00, 'EUR', 10),
(40, 14, 'S', 6.00, 'EUR', 100),
(41, 14, 'M', 6.00, 'EUR', 80),
(42, 14, 'L', 6.00, 'EUR', 60),
(43, 15, 'S', 22.00, 'EUR', 15),
(44, 15, 'M', 22.00, 'EUR', 10),
(45, 15, 'L', 22.00, 'EUR', 5),
(46, 16, 'S', 18.00, 'EUR', 25),
(47, 16, 'M', 18.00, 'EUR', 20),
(48, 16, 'L', 18.00, 'EUR', 15),
(49, 17, 'S', 5.50, 'EUR', 80),
(50, 17, 'M', 5.50, 'EUR', 70),
(51, 17, 'L', 5.50, 'EUR', 60),
(52, 18, 'S', 30.00, 'EUR', 12),
(53, 18, 'M', 30.00, 'EUR', 10),
(54, 18, 'L', 30.00, 'EUR', 8),
(55, 19, 'S', 55.00, 'EUR', 10),
(56, 19, 'M', 55.00, 'EUR', 8),
(57, 19, 'L', 55.00, 'EUR', 5),
(58, 20, 'S', 12.00, 'EUR', 40),
(59, 20, 'M', 12.00, 'EUR', 35),
(60, 20, 'L', 12.00, 'EUR', 30),
(61, 21, 'S', 16.00, 'EUR', 25),
(62, 21, 'M', 16.00, 'EUR', 20),
(63, 21, 'L', 16.00, 'EUR', 15),
(64, 22, 'S', 45.00, 'EUR', 10),
(65, 22, 'M', 45.00, 'EUR', 8),
(66, 22, 'L', 45.00, 'EUR', 5),
(67, 23, 'S', 11.00, 'EUR', 50),
(68, 23, 'M', 11.00, 'EUR', 40),
(69, 23, 'L', 11.00, 'EUR', 30),
(70, 24, 'S', 9.00, 'EUR', 70),
(71, 24, 'M', 9.00, 'EUR', 60),
(72, 24, 'L', 9.00, 'EUR', 50),
(73, 25, 'S', 7.00, 'EUR', 80),
(74, 25, 'M', 7.00, 'EUR', 70),
(75, 25, 'L', 7.00, 'EUR', 60),
(76, 26, 'S', 8.50, 'EUR', 90),
(77, 26, 'M', 8.50, 'EUR', 80),
(78, 26, 'L', 8.50, 'EUR', 70),
(79, 27, 'S', 14.00, 'EUR', 30),
(80, 27, 'M', 14.00, 'EUR', 25),
(81, 27, 'L', 14.00, 'EUR', 20),
(82, 28, 'S', 20.00, 'EUR', 40),
(83, 28, 'M', 20.00, 'EUR', 35),
(84, 28, 'L', 20.00, 'EUR', 30),
(85, 29, 'S', 13.00, 'EUR', 50),
(86, 29, 'M', 13.00, 'EUR', 40),
(87, 29, 'L', 13.00, 'EUR', 30),
(88, 30, 'S', 28.00, 'EUR', 15),
(89, 30, 'M', 28.00, 'EUR', 10),
(90, 30, 'L', 28.00, 'EUR', 5),
(91, 31, 'S', 32.00, 'EUR', 5),
(92, 32, 'M', 32.00, 'EUR', 5),
(93, 33, '40', 10.00, 'EUR', 5),
(94, 34, '40', 14.00, 'EUR', 5),
(95, 35, '40', 20.00, 'EUR', 5),
(96, 36, '40', 12.00, 'EUR', 5),
(97, 37, '40', 10.00, 'EUR', 5),
(98, 38, '40', 15.00, 'EUR', 5);


-- Paniers

INSERT INTO shopping_carts (client_id, product_id, product_size, product_quantity, inventory_id) VALUES
(1, 1, 'M', 2, 2),
(1, 6, '41', 1, 16),
(1, 25, 'M', 3, 76),
(2, 3, 'S', 1, 7),
(2, 12, 'M', 3, 32),
(2, 9, 'S', 1, 25),
(3, 20, 'L', 2, 60),
(3, 7, 'S', 1, 18),
(4, 28, 'M', 1, 88),
(4, 14, 'L', 2, 41);
