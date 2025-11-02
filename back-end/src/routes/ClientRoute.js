// ----------------------------------------------- Variables d'environnement

import { PRIVATE_KEY, FRONT_END_URL, STRIPE_SECRET_KEY, HOST_EMAIL, PUBLIC_KEY } from "../config.js";

// ----------------------------------------------- Express

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg, { Client } from "pg";
import { importJWK, compactDecrypt, CompactEncrypt } from "jose";
import Stripe from "stripe";

// ----------------------------------------------- Routes

const ClientRouter = express.Router();

// ----------------------------------------------- postgreSQL

import pool from "../main.js";

// ----------------------------------------------- Functions

import { clean } from "./RegistrationRoute.js";
import { auth } from "./AuthenticationRoute.js";
import { sendEmail } from "./AuthenticationRoute.js";




const email_history = {};




async function getClientShoppingCart(clientId) {

    try {

        const clients_request = await pool.query("SELECT email, first_name, last_name, phone_number, address, town, postcode, country, is_subscribed_to_newsletter FROM clients WHERE client_id=$1", [clientId]);

        if (clients_request?.rowCount !== 0 && clients_request?.rows[0]) {

            let decrypted_last_name = "";
            let decrypted_phone_number = "";
            let decrypted_address = "";
            let decrypted_town = "";


            const private_server_key_jwt = JSON.parse(Buffer.from(PRIVATE_KEY, `base64`).toString(`utf-8`));

            const private_server_key = await importJWK(private_server_key_jwt, `RSA-OAEP-256`);

            const {plaintext : uint8array_last_name} = await compactDecrypt(clients_request.rows[0]?.last_name, private_server_key);
            
            if (clients_request.rows[0]?.phone_number && clients_request.rows[0]?.address && clients_request.rows[0]?.town) {

                const {plaintext : uint8array_phone_number} = await compactDecrypt(clients_request.rows[0]?.phone_number, private_server_key);
                const {plaintext : uint8array_address} = await compactDecrypt(clients_request.rows[0]?.address, private_server_key);
                const {plaintext : uint8array_town} = await compactDecrypt(clients_request.rows[0]?.town, private_server_key);

                decrypted_last_name = new TextDecoder(`utf-8`).decode(uint8array_last_name);
                decrypted_phone_number = new TextDecoder(`utf-8`).decode(uint8array_phone_number);
                decrypted_address = new TextDecoder(`utf-8`).decode(uint8array_address);
                decrypted_town = new TextDecoder(`utf-8`).decode(uint8array_town);
            }


            const plaintext_client_information = {
                
                ...clients_request.rows[0], 
                last_name : decrypted_last_name,
                phone_number : decrypted_phone_number,
                address : decrypted_address,
                town : decrypted_town,
                postcode : clients_request.rows[0].postcode,
                country : clients_request.rows[0].country,
                newsletter : clients_request.rows[0].is_subscribed_to_newsletter ? "subscribed" : "not subscribed"
            };

            delete plaintext_client_information?.is_subscribed_to_newsletter;

            const shopping_carts_request = await pool.query(`

                SELECT sub_request.shopping_cart_id, sub_request.product_id, sub_request.product_name, sub_request.product_size, sub_request.product_quantity, i.unit_price, sub_request.image_path, STRING_AGG(i.size, ',') AS available_sizes, STRING_AGG(CAST(i.available_quantity AS VARCHAR(256)), ',') AS available_quantities
                FROM inventory AS i 
                INNER JOIN (
                    SELECT s.shopping_cart_id, s.product_id, p.name AS product_name, s.product_size, s.product_quantity, p.image_path 
                    FROM shopping_carts AS s 
                    INNER JOIN products AS p ON p.product_id=s.product_id 
                    WHERE client_id=$1
                ) AS sub_request
                ON sub_request.product_id=i.product_id
                WHERE i.product_id IN (
                    SELECT s.product_id 
                    FROM shopping_carts AS s 
                    WHERE s.client_id=$1
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
                    WHERE s.client_id=$1
                )
                )
                GROUP BY sub_request.shopping_cart_id, sub_request.product_id, sub_request.product_name, sub_request.product_size, sub_request.product_quantity, i.unit_price, sub_request.image_path

                `, [clientId]);

            if (shopping_carts_request?.rowCount !== 0 && shopping_carts_request?.rows[0]) {

                return {

                    client : [plaintext_client_information],
                    product : shopping_carts_request.rows
                };
            }
            else {

                return {

                    client : [plaintext_client_information]
                };
            }
        }
        else {

            return "client information not found in clients table";
        }
    }
    catch(error) {

        console.error(error);
        
        // L'exécution de la route s'arrête immédiatement dès le throw et le serveur renvoie par défaut une erreur 500
        throw (error.stack);
    }
}




ClientRouter.get("/me", clean, auth, async (front_end_request, back_end_response) => {

    try {

        // Si l'ID client depuis l'en-tête temporaire payload de la requête client existe
        if (front_end_request?.payload?.clientId) {

            // On récupère l'ID client depuis l'en-tête temporaire payload de la requête client 
            const clientId = front_end_request.payload.clientId;

            const obj = await getClientShoppingCart(clientId);

            if (Object.keys(obj).length > 0) {

                const client_shopping_cart = obj;

                back_end_response.status(200).send({message : client_shopping_cart});
            }
            else {

                back_end_response.status(500).send({message : obj});
            }
        }
        else {

            back_end_response.status(402).send({message : "payload not found in front_end_request /me"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




ClientRouter.post("/sendFormMessage", clean, async (front_end_request, back_end_response) => {

    try {

        const {Email, Message} = front_end_request.cleanedBody;

        if (email_history[Email]) {

            // Si l'utilisateur a déjà envoyé un email dans les 24 heures
            if (Date.now() - email_history[Email] < 24 * 60 * 60 * 1000) {

                back_end_response.status(200).send({message : "Please wait 24 hours before sending another message."});
            }
            else {

                email_history[Email] = Date.now();

                // Remplacer le premier argument HOST_EMAIL par Email et le deuxième argument HOST_EMAIL par ASSISTANCE_EMAIL en mode production
                await sendEmail(

                    `Client <${HOST_EMAIL}>`, 
                    HOST_EMAIL, 
                    `Support Contact Message`, 
                    Message,
                    `<p>${Message}</p>`
                );

                back_end_response.status(200).send({message : "Email successfully sent. We will respond as soon as possible."});
            }
        }
        else {

            email_history[Email] = Date.now();

            // Remplacer le premier argument HOST_EMAIL par Email et le deuxième argument HOST_EMAIL par ASSISTANCE_EMAIL en mode production
            await sendEmail(

                `Client <${HOST_EMAIL}>`, 
                HOST_EMAIL, 
                `Support Contact Message`, 
                Message,
                `<p>${Message}</p>`
            );

            back_end_response.status(200).send({message : "Email successfully sent. We will respond as soon as possible."});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




ClientRouter.post("/modifyClientInfo", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload?.clientId) {

            const clientId = front_end_request.payload.clientId;

            let {

                clientFirstName,
                clientLastName,
                clientCountry,
                clientPhoneNumber,
                clientAddress,
                clientTown,
                clientPostCode, 
                newsletterSubscription
            
            } = front_end_request.cleanedBody;

            
            const public_server_key_jwt = JSON.parse(Buffer.from(PUBLIC_KEY, `base64`).toString(`utf-8`));
            const public_server_key = await importJWK(public_server_key_jwt, `RSA-OAEP-256`);


            if (clientLastName) clientLastName = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientLastName)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);
            if (clientPhoneNumber) clientPhoneNumber = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientPhoneNumber)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);
            if (clientAddress) clientAddress = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientAddress)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);
            if (clientTown) clientTown = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientTown)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);

            if (newsletterSubscription) {

                await pool.query(`UPDATE clients SET is_subscribed_to_newsletter=true WHERE client_id=$1`, [clientId]);
            }
            else {

                await pool.query(`UPDATE clients SET is_subscribed_to_newsletter=false WHERE client_id=$1`, [clientId]);
            }

            const clients_request = await pool.query(`

                UPDATE clients SET 
                first_name=COALESCE(NULLIF($1, ''), first_name),
                last_name=COALESCE(NULLIF($2, ''), last_name),
                phone_number=COALESCE(NULLIF($3, ''), phone_number),
                address=COALESCE(NULLIF($4, ''), address),
                town=COALESCE(NULLIF($5, ''), town),
                postcode=COALESCE(NULLIF($6, ''), postcode),
                country=COALESCE(NULLIF($7, ''), country)
                WHERE
                client_id=$8

            `, [clientFirstName, clientLastName, clientPhoneNumber, clientAddress, clientTown, clientPostCode, clientCountry, clientId]);

            if (clients_request?.rowCount !== 0) {

                back_end_response.status(200).send({message : "Client information modified successfully"});
            }
            else {

                back_end_response.status(500).send({message : "Empty request"});
            }
        }
        else {

            back_end_response.status(402).send({message : "payload not found in front_end_request /me"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




ClientRouter.delete("/deleteOrder", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload?.clientId) {

            const clientId = front_end_request.payload.clientId;
            const {Id} = front_end_request.cleanedQuery;

            const shopping_carts_request = await pool.query(`DELETE FROM shopping_carts WHERE shopping_cart_id=$1 AND client_id=$2`, [Id, clientId]);

            if (shopping_carts_request?.rowCount !== 0) {

                const obj = await getClientShoppingCart(clientId);

                if (Object.keys(obj).length > 0) {

                    const client_shopping_cart = obj;

                    back_end_response.status(200).send({message : client_shopping_cart});
                }
                else {

                    back_end_response.status(500).send({message : obj});
                }
            }
            else {

                back_end_response.status(500).send({message : "Empty request"});
            }
        }
        else {

            back_end_response.status(402).send({message : "payload not found in front_end_request /me"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




ClientRouter.put("/modifyOrder", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload?.clientId) {

            const clientId = front_end_request.payload.clientId;
            const {shoppingCartId, newOrderedProductSize, newOrderedProductQuantity} = front_end_request.cleanedBody;

            const product_id_request = await pool.query(`SELECT product_id FROM shopping_carts WHERE shopping_cart_id=$1`, [shoppingCartId]);

            if (product_id_request?.rowCount !== 0 && product_id_request?.rows[0] && product_id_request.rows[0]?.product_id) {

                const product_id = product_id_request.rows[0].product_id;

                const shopping_carts_request = await pool.query(`SELECT * FROM shopping_carts WHERE client_id=$1 AND product_id=$2 AND product_size=$3`, [clientId, product_id, newOrderedProductSize]);

                if (shopping_carts_request?.rowCount === 0 || shopping_carts_request?.rowCount === 1) {

                    if (shopping_carts_request.rowCount === 1) {

                        const product_quantity_request = await pool.query(`SELECT * FROM shopping_carts WHERE client_id=$1 AND product_id=$2 AND product_size=$3 AND product_quantity=$4`, [clientId, product_id, newOrderedProductSize, newOrderedProductQuantity]);
                    
                        if (product_quantity_request?.rowCount !== 0) {

                            back_end_response.status(500).send({message : "Product with the same size already added to the shopping cart"});
                            return;
                        }
                    }
                    
                    const new_shopping_carts_request = await pool.query(`
                    
                        UPDATE shopping_carts 
                        SET (product_size, product_quantity)=($3, $4)
                        WHERE shopping_cart_id=$2 AND client_id=$1;
                    
                    `, [clientId, shoppingCartId, newOrderedProductSize, newOrderedProductQuantity]);

                    if (new_shopping_carts_request?.rowCount !== 0) {

                        const obj = await getClientShoppingCart(clientId);

                        if (Object.keys(obj).length > 0) {

                            const client_shopping_cart = obj;

                            back_end_response.status(200).send({message : client_shopping_cart});
                        }
                        else {

                            back_end_response.status(500).send({message : obj});
                        }
                    }
                    else {

                        back_end_response.status(500).send({message : "Empty request"});
                    }
                }
                else {

                    if (shopping_carts_request?.rowCount > 1) {

                        back_end_response.status(500).send({message : "Product with the same size already added to the shopping cart"});
                    }
                    else {

                        back_end_response.status(500).send({message : "Empty request"});
                    }
                }
            }
            else {

                back_end_response.status(500).send({message : "Empty request"});
            }
        }
        else {

            back_end_response.status(402).send({message : "payload not found in front_end_request /me"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




ClientRouter.delete("/deleteAllOrders", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload?.clientId) {

            const clientId = front_end_request.payload.clientId;
            
            const shopping_carts_request = await pool.query(`DELETE FROM shopping_carts WHERE client_id=$1`, [clientId]);

            if (shopping_carts_request?.rowCount !== 0) {

                const obj = await getClientShoppingCart(clientId);

                if (Object.keys(obj).length > 0) {

                    const client_shopping_cart = obj;

                    back_end_response.status(200).send({message : client_shopping_cart});
                }
                else {

                    back_end_response.status(500).send({message : obj});
                }
            }
            else {

                back_end_response.status(500).json({message : "Empty request"});
            }
        }
        else {

            back_end_response.status(402).send({message : "payload not found in front_end_request /me"});
        }
    }
    catch(error) {

        back_end_response.status(500).json({message : error.stack});
    }
});




ClientRouter.post("/createCheckoutSession", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload) {

            const {clientShoppingCart} = front_end_request.body;

            const client_products_list = clientShoppingCart.product;

            const stripe = new Stripe(STRIPE_SECRET_KEY);

            const session = await stripe.checkout.sessions.create({

                payment_method_types: [

                    "card",
                    "link",
                    "bancontact",
                    "ideal",
                    "sofort",
                    "klarna",
                ],
                mode : "payment",
                line_items : client_products_list.map((el, _) => ({

                    price_data : {

                        currency : "eur",
                        product_data : {

                            name : el.product_name,
                            metadata : {

                                size : el.product_size
                            }
                        },
                        unit_amount : parseInt(parseFloat(el.unit_price) * 100), // en centimes
                    },
                    quantity : parseInt(el.product_quantity)
                })),
                customer_email : clientShoppingCart.client[0].email,
                billing_address_collection : "required",
                shipping_address_collection : {

                    allowed_countries : ["FR", "BE", "NL", "DE", "AT", "GB"]
                },
                success_url : `${FRONT_END_URL}/success-page?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url : `${FRONT_END_URL}/cancel-page?session_id={CHECKOUT_SESSION_ID}`
            });

            if (session?.url) {

                const obj = {

                    url : session.url
                };

                back_end_response.status(200).send({message : obj});
            }
            else {

                back_end_response.status(500).send({message : "session not found"});
            }
        }
        else {

            back_end_response.status(402).send({message : "payload not found in front_end_request /me"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




ClientRouter.post("/unsubscribeToNewsletter", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload && front_end_request.payload?.clientId) {

            const clientId = front_end_request.payload.clientId;

            const clients_request = await pool.query(`UPDATE clients SET is_subscribed_to_newsletter=false WHERE client_id=$1`, [clientId]);

            if (clients_request?.rowCount !== 0) {

                back_end_response.status(200).send({message : "Client successfully unsubscribed from newsletter"});
            }
            else {

                back_end_response.status(500).send({message : "Empty request"});
            }
        }
        else {

            back_end_response.status(402).send({message : "Payload not found"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




ClientRouter.delete("/removeOrder", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload && front_end_request.payload?.clientId) {

            const clientId = front_end_request.payload.clientId;

            const client_shopping_cart = await getClientShoppingCart(clientId);

            if (client_shopping_cart?.product && Array.isArray(client_shopping_cart.product) && client_shopping_cart.product.length > 0) {

                for (const product_row of client_shopping_cart.product) {

                    await pool.query(`

                        UPDATE inventory AS inv 
                        SET available_quantity=available_quantity-sub_request.quantity
                        FROM (
                            SELECT s.product_quantity AS quantity 
                            FROM shopping_carts AS s
                            WHERE s.client_id=$1 AND s.product_id=$2 AND s.product_size=$3
                        ) AS sub_request 
                        WHERE inv.available_quantity >= 2 AND sub_request.quantity IS NOT NULL AND sub_request.quantity <> 0 AND inv.product_id=$2 AND inv.size=$3

                    `, [clientId, product_row.product_id, product_row.product_size]);

                    await pool.query(`
                    
                        DELETE FROM shopping_carts
                        WHERE client_id=$1 AND product_id=$2 AND product_size=$3
                    
                    `, [clientId, product_row.product_id, product_row.product_size]);
                }

                back_end_response.status(200).send({message : "Client order successfully removed"});
            }
            else {

                back_end_response.status(500).send({message : "shopping_cart not found"});
            }
        }
        else {

            back_end_response.status(402).send({message : "Payload not found"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});

export default ClientRouter;
