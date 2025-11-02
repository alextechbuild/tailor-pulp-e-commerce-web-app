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
