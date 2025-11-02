BEGIN;

SELECT available_quantity FROM inventory WHERE product_id=1 AND size='S';

UPDATE 


UPDATE panier SET quantity=quantity+1 WHERE quantity <= 19 AND id=1 AND user_id=2;

SELECT * FROM panier;

ROLLBACK;




SELECT sub_request.shopping_cart_id, sub_request.product_id, sub_request.product_name, sub_request.product_size, sub_request.product_quantity, sub_request.image_path, i.unit_price, STRING_AGG(i.size, ',') AS available_sizes, STRING_AGG(CAST(i.available_quantity AS VARCHAR(256)), ',') AS available_quantities
FROM inventory AS i 
INNER JOIN (
    SELECT s.shopping_cart_id, s.product_id, p.name AS product_name, s.product_size, s.product_quantity, p.image_path 
    FROM shopping_carts AS s 
    INNER JOIN products AS p ON p.product_id=s.product_id 
    WHERE client_id=1
) AS sub_request
ON sub_request.product_id=i.product_id
WHERE i.product_id IN (
    SELECT s.product_id 
    FROM shopping_carts AS s 
    WHERE s.client_id=1
) 
AND 
(
(
SELECT COUNT(inv.size)
FROM inventory AS inv
WHERE inv.product_id=sub_request.product_id
)=1
OR
i.size NOT IN (
    SELECT s.product_size 
    FROM shopping_carts AS s 
    WHERE s.client_id=1
)
)
GROUP BY sub_request.shopping_cart_id, sub_request.product_id, sub_request.product_name, sub_request.product_size, sub_request.product_quantity, sub_request.image_path, i.unit_price;




SELECT s.shopping_cart_id, s.product_id, p.name AS product_name, s.product_size, s.product_quantity 
FROM shopping_carts AS s 
INNER JOIN products AS p ON p.product_id=s.product_id 
WHERE client_id=6;


SELECT i.size FROM inventory AS i WHERE i.product_id=(SELECT s.product_id FROM shopping_carts AS s WHERE s.client_id=6) AND i.size NOT IN (SELECT s.product_size FROM shopping_carts AS s WHERE s.client_id=6);




BEGIN;

UPDATE clients SET is_subscribed_to_newsletter=false WHERE client_id=1;

SELECT * FROM clients WHERE client_id=1;

ROLLBACK;
