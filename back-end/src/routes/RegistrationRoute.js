// ----------------------------------------------- Variables d'environnement

import { RECAPTCHA_SECRET_KEY, PUBLIC_KEY } from "../config.js";

// ----------------------------------------------- Express

import express from "express";
import sanitizeHtml from "sanitize-html";
import Stripe from "stripe";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg from "pg";
import { importJWK, CompactEncrypt } from "jose";

// ----------------------------------------------- Routes

const RegistrationRouter = express.Router();

// ----------------------------------------------- postgreSQL

import pool from "../main.js";




export function clean(front_end_request, back_end_response, next) {

    try {

        if (front_end_request?.body) {

            front_end_request.cleanedBody = Object.fromEntries(

                Object.entries(front_end_request.body).map(([key, value], _) => {

                    if (typeof value === "string") {

                        return [key, sanitizeHtml(value, {allowedTags : []})];
                    }
                    else {

                        return [key, value];
                    }
                })
            );
        }
        else if (front_end_request?.query) {

            front_end_request.cleanedQuery = Object.fromEntries(

                Object.entries(front_end_request.query).map(([key, value], _) => {

                    if (typeof key === "string") {

                        return [key, sanitizeHtml(value, {allowedTags : []})];
                    }
                    else {

                        return [key, value];
                    }
                })
            );
        }

        next();
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
}




RegistrationRouter.post("/signup", clean, async (front_end_request, back_end_response) => {

    const {

        clientEmail,
        clientPassword,
        clientFirstName,
        clientLastName,
        clientCountry,
        clientPhoneNumber,
        clientAddress,
        clientTown,
        clientPostCode,
        clientBirthYear,
        reCaptchaToken,
        newsletterSubscription
    
    } = front_end_request.cleanBody;

    try {

        // Vérification côté serveur avec secret key
        const google_response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${reCaptchaToken}`, { 

                method : "POST"
            }
        );
        const google_result = await google_response.json();

        if (google_result.success) {

            console.log(google_result);
            
            const hashed_password = await bcrypt.hash(clientPassword, 10);

            const public_server_key_jwt = JSON.parse(Buffer.from(PUBLIC_KEY, `base64`).toString(`utf-8`));

            const public_server_key = await importJWK(public_server_key_jwt, `RSA-OAEP-256`);


            const encrypted_last_name = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientLastName)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);
            const encrypted_phone_number = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientPhoneNumber)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);
            const encrypted_address = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientAddress)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);
            const encrypted_town = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientTown)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);
            const encrypted_birth_year = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientBirthYear)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);


            await pool.query(`INSERT INTO clients (email, password, first_name, last_name, phone_number, address, town, postcode, country, birth_year, registration_year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, 
                [clientEmail, hashed_password, clientFirstName, encrypted_last_name, encrypted_phone_number, encrypted_address, encrypted_town, clientPostCode, clientCountry, encrypted_birth_year, new Date().getFullYear()]);

            if (newsletterSubscription) {

                const clients_request = await pool.query(`SELECT client_id FROM clients WHERE email=$1 AND password=$2 AND first_name=$3 AND last_name=$4 AND phone_number=$5`, 
                    [clientEmail, hashed_password, clientFirstName, encrypted_last_name, encrypted_phone_number]);

                if (clients_request?.rowCount !== 0 && clients_request?.rows[0] && clients_request.rows[0]?.client_id) {

                    const clientId = clients_request.rows[0]?.client_id;

                    const clients_new_request = await pool.query(`UPDATE clients SET is_subscribed_to_newsletter=true WHERE client_id=$1`, [clientId]);

                    if (clients_new_request?.rowCount !== 0) {

                        back_end_response.status(200).send({message : "Client successfully subscribed to newsletter"});
                    }
                    else {

                        back_end_response.status(500).send({message : "Empty request"});
                    }
                }
            }

            back_end_response.status(200).send({message : "Account created"});
        }
        else {

            back_end_response.status(500).send({message : "Captcha not matching"});
        }
    }
    catch(error) {

        // le catch attrape la première erreur qui survient dans le try
        back_end_response.status(500).send({message : error.stack});
    }
})

export default RegistrationRouter;
