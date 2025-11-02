-- Afficher la table de chaque même produit choisi par le client ayant une même id et une même taille

SELECT s.client_id, s.product_id, s.product_size, s.product_quantity, p.name, p.category, i.size, i.unit_price, i.currency, i.available_quantity 
FROM shopping_carts AS s 
INNER JOIN products AS p ON p.product_id=s.product_id 
INNER JOIN inventory AS i ON i.product_id=p.product_id 
WHERE s.client_id=1 AND s.product_id=1 AND i.size='M';

-- Mettre à jour dans inventory la quantité maximale associée aux produits ayant la même id et la même taille spécifiées dans la requête précédente (Transaction)
-- lorsque le client à passer la commande

BEGIN;

UPDATE inventory AS inv 
SET available_quantity=available_quantity-(
    SELECT s.product_quantity 
    FROm shopping_carts AS s
    WHERE s.client_id=1 AND s.product_id=1 AND s.product_size='M'
)
WHERE inv.available_quantity >= 2 AND inv.product_id=1 AND inv.size='M';

SELECT * FROM inventory AS inv WHERE inv.product_id=1 AND inv.size='M';

-- Supprimer les produits de la table lorsque le client passe la commande (transaction)

DELETE FROM shopping_carts
WHERE client_id=1 AND product_id=1 AND product_size='M';

ROLLBACK;

-- Vérifier en comparant avec la table actuelle

SELECT * FROM inventory AS inv WHERE inv.product_id=1 AND inv.size='M';
