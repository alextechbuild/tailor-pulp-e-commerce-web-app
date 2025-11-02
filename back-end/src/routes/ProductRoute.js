// ----------------------------------------------- Variables d'environnement

import { JWT_SECRET } from "../config.js";

// ----------------------------------------------- Express

import express from "express";
import Stripe from "stripe";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg from "pg";

// ----------------------------------------------- Routes

const ProductRouter = express.Router();

// ----------------------------------------------- postgreSQL

import pool from "../main.js";

// ----------------------------------------------- Functions

import { clean } from "./RegistrationRoute.js";
import { auth } from "./AuthenticationRoute.js";




ProductRouter.get("/getSizesAndQuantities", clean, async (front_end_request, back_end_response) => {

    try {

        const {productId} = front_end_request.cleanedQuery;

        const inventory_request = await pool.query(`SELECT size, available_quantity FROM inventory WHERE product_id=$1`, [productId]);

        if (inventory_request?.rowCount !== 0 && inventory_request?.rows[0]) {

            back_end_response.status(200).send({message : inventory_request.rows});
        }
        else {

            back_end_response.status(500).send({message : "Empty request"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




ProductRouter.get("/getProductQuantity", clean, async (front_end_request, back_end_response) => {

    try {

        const {productId, productSize} = front_end_request.cleanedQuery;

        const inventory_request = await pool.query(`SELECT available_quantity FROM inventory WHERE product_id=$1 AND size=$2`, [productId, productSize]);

        if (inventory_request?.rowCount !== 0 && inventory_request?.rows[0]) {

            back_end_response.status(200).send({message : inventory_request.rows});
        }
        else {

            back_end_response.status(500).send({message : "Empty request"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




ProductRouter.post("/AddProductToShoppingCart", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload?.clientId) {

            const clientId = front_end_request.payload.clientId;
            const {productId, orderedSize, orderedQuantity} = front_end_request.cleanedBody;

            const inventory_request = await pool.query(`SELECT inventory_id FROM inventory WHERE product_id=$1 AND size=$2`, [productId, orderedSize]);

            if (inventory_request?.rowCount !== 0 && inventory_request?.rows[0]) {

                const shopping_carts_request = await pool.query(`SELECT * FROM shopping_carts WHERE product_id=$1 AND product_size=$2`, [productId, orderedSize]);

                if (shopping_carts_request?.rowCount === 0) {

                    const inventory_id = inventory_request.rows[0].inventory_id;

                    await pool.query(`INSERT INTO shopping_carts (client_id, product_id, product_size, product_quantity, inventory_id) VALUES ($1, $2, $3, $4, $5)`, 
                        [clientId, productId, orderedSize, orderedQuantity, inventory_id]);
                    
                    back_end_response.status(200).send({message : "Product added to shopping cart"});
                }
                else {

                    if (shopping_carts_request?.rowCount !== 0) {

                        back_end_response.status(500).send({message : "Product with the same size already added to the shopping cart"});
                    }
                    else {

                        back_end_response.status(500).send({message : "Empty request"});
                    }
                }
            }
            else {

                back_end_response.status(500).send({message : "product_id or product_size not found in inventory"});
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

export default ProductRouter;
