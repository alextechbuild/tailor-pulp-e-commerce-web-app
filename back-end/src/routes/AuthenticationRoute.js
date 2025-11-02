// ----------------------------------------------- Variables d'environnement

import { JWT_SECRET, SMTP_DOMAIN, SMTP_PORT, HOST_EMAIL, HOST_PASSWORD, ASSISTANCE_EMAIL, GOOGLE_OAUTH_CLIENT_ID, PUBLIC_KEY } from "../config.js";

// ----------------------------------------------- Express

import express from "express";
import Stripe from "stripe";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg from "pg";
import crypto from "crypto";
import nodemailer from "nodemailer";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { importJWK, CompactEncrypt } from "jose";


// ----------------------------------------------- Routes

const AuthenticationRouter = express.Router();

// ----------------------------------------------- postgreSQL

import pool from "../main.js";

// ----------------------------------------------- Functions

import { clean } from "./RegistrationRoute.js";




AuthenticationRouter.post("/login", clean, async (front_end_request, back_end_response) => {

    try {

        const {clientEmail, clientPassword} = front_end_request.cleanedBody;

        const clients_request = await pool.query(`SELECT * FROM clients WHERE email=$1`, [clientEmail]);

        if (clients_request?.rowCount !== 0 && clients_request?.rows[0] && clients_request.rows[0]?.client_id && clients_request.rows[0]?.email) {

            const is_client_password_checked = await bcrypt.compare(clientPassword, clients_request.rows[0].password);

            if (is_client_password_checked) {

                const clients_new_request = await pool.query(`SELECT twofa_secret FROM clients WHERE client_id=$1`, [clients_request.rows[0].client_id]);

                if (clients_new_request?.rowCount !== 0 && clients_new_request?.rows[0] && clients_new_request.rows[0]?.twofa_secret) {

                    const obj = {

                        twofa_enabled : true
                    };

                    // 2FA activé : client redirigé vers TwoFAPage
                    back_end_response.status(200).send({message : obj});
                }
                else {

                    const token = jwt.sign({clientId : clients_request.rows[0].client_id, clientEmail : clients_request.rows[0].email, role : "user"}, JWT_SECRET, {expiresIn : "15m"});

                    if (token) {

                        // Mettre le token dans un cookie permet de le conserver entre les sessions, à condition de bien configurer le cookie (maxAge + httpOnly + secure)
                        back_end_response.cookie('token', token, {

                            httpOnly: true, // N'est pas accessible en JS
                            secure: true, // Accessible en https
                            maxAge: 15 * 60 * 1000, // 15 minutes en millisecondes converties en secondes
                            sameSite: 'None', // Accessible depuis front et back
                            signed: true // Signé
                        });

                        const obj = {

                            token : token,
                            clientFirstName : clients_request.rows[0].email.split("@")[0]
                        };

                        back_end_response.status(200).send({message : obj});
                    }
                    else {

                        back_end_response.status(402).send({message : "Token not found"});
                    }
                }
            }
            else {

                back_end_response.status(500).send({message : "password not found"});
            }
        }
        else {

            back_end_response.status(500).send({message : "Empty request"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




AuthenticationRouter.post("/GoogleLogin", clean, async (front_end_request, back_end_response) => {

    try {

        const {Credential} = front_end_request.cleanedBody;

        // Vérification token Google
        const googlelogin_response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${Credential}`);
        
        const result = await googlelogin_response.json();

        if (result) {

            const isEmailVerified = result?.email_verified;

            if (isEmailVerified === "true") {

                if (result?.aud === GOOGLE_OAUTH_CLIENT_ID) {

                    const {email : clientEmail, given_name : clientFirstName, family_name : clientLastName} = result;

                    const clients_request = await pool.query(`SELECT email FROM clients WHERE email=$1`, [clientEmail]);


                    const public_server_key_jwt = JSON.parse(Buffer.from(PUBLIC_KEY, `base64`).toString(`utf-8`));
                    const public_server_key = await importJWK(public_server_key_jwt, `RSA-OAEP-256`);
        
                    const encrypted_last_name = await new CompactEncrypt(new TextEncoder(`utf-8`).encode(clientLastName)).setProtectedHeader({alg : `RSA-OAEP-256`, enc : `A256GCM`}).encrypt(public_server_key);


                    if (clients_request.rowCount === 0) {
                    
                        // Pas NULL car permet d'ajouter de la flexibilité pour les tests de requête (centralisation de la chaîne vide pour comptes Google et pour pouvoir insérer de nouvelles infos directement côté front éventuellement)
                        await pool.query(`INSERT INTO clients (email, password, first_name, last_name, phone_number, address, town, postcode, country, birth_year, registration_year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, 
                            [clientEmail, '', clientFirstName, encrypted_last_name, '', '', '', '', '', '', new Date().getFullYear()]);
                    }
                    
                    const clients_new_request = await pool.query(`SELECT client_id, email FROM clients WHERE email=$1 AND first_name=$2`, 
                        [clientEmail, clientFirstName]);

                    if (clients_new_request?.rowCount !== 0 && clients_new_request?.rows[0] && clients_new_request.rows[0]?.client_id && clients_new_request.rows[0]?.email) {

                        const token = jwt.sign({clientId : clients_new_request.rows[0].client_id, clientEmail : clients_new_request.rows[0].email, role : "user"}, JWT_SECRET, {expiresIn : "15m"});

                        if (token) {

                            // Mettre le token dans un cookie permet de le conserver entre les sessions, à condition de bien configurer le cookie (maxAge + httpOnly + secure)
                            back_end_response.cookie('token', token, {

                                httpOnly: true, // N'est pas accessible en JS
                                secure: true, // Accessible en https
                                maxAge: 15 * 60 * 1000, // 15 minutes en millisecondes converties en secondes
                                sameSite: 'None', // Accessible depuis front et back
                                signed: true // Signé
                            });

                            const obj = {

                                token : token,
                                clientFirstName : clients_new_request.rows[0].email.split("@")[0]
                            };

                            back_end_response.status(200).send({message : obj});
                        }
                        else {

                            back_end_response.status(402).send({message : "Token not found"});
                        }
                    }
                    else {

                        back_end_response.status(500).send({message : "GoogleLogin : client not found"});
                    }
                }
                else {

                    back_end_response.status(500).send({message : "GoogleLogin : token not intended for this application"});
                }
            }
            else {

                back_end_response.status(500).send({message : "GoogleLogin : email not verified by Google"});
            }
        }
        else {

            back_end_response.status(402).send({message : "GoogleLogin Token not found"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




export function auth(front_end_request, back_end_response, next) {

    try {

        const extracted_token = front_end_request?.signedCookies?.token || front_end_request?.headers?.authorization?.split(" ")[1];

        if (extracted_token) {

            const payload_token = jwt.verify(extracted_token, JWT_SECRET);

            if (payload_token) {

                console.log("Token matching");
                // En-tête provisoire disponible uniquement côté serveur
                front_end_request.payload = payload_token;
                next();
            }
            else {

                back_end_response.status(402).send({message : "token not matching"});
            }
        }
        else {

            back_end_response.status(402).send({message : "extracted token not found"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
};




AuthenticationRouter.get("/me", clean, auth, async (front_end_request, back_end_response) => {

    try {

        // Si l'utilisateur refresh depuis la page Login, le useState associé au token n'est pas trouvable donc n'est pas dans le header authorization
        // Donc on vérifie uniquement la présence du token dans le cookie
        if (front_end_request?.payload?.clientId && front_end_request?.payload?.clientEmail) {

            const clientId = front_end_request.payload.clientId;

            const clients_request = await pool.query(`SELECT is_2fa_enabled, is_subscribed_to_newsletter FROM clients WHERE client_id=$1`, [clientId]);

            if (clients_request?.rowCount !== 0 && clients_request?.rows[0]) {

                const is_2fa_enabled = clients_request.rows[0].is_2fa_enabled;
                const is_subscribed_to_newsletter = clients_request.rows[0].is_subscribed_to_newsletter;

                const obj = {

                    token : front_end_request?.signedCookies?.token,
                    clientFirstName : front_end_request?.payload?.clientEmail.split('@')[0],
                    is2FAEnabled : is_2fa_enabled,
                    isSubscribedToNewsletter : is_subscribed_to_newsletter
                }

                back_end_response.status(200).send({message : obj});
            }
            else {

                back_end_response.status(500).send({message : "Empty request"});
            }
        }
        else {

            back_end_response.send({message : "Token not found"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




// post car modifie les données côté serveur
AuthenticationRouter.post("/logout", clean, async (front_end_request, back_end_response) => {

    try {

        const extracted_token = front_end_request?.signedCookies?.token || front_end_request?.headers?.authorization?.split(" ")[1];

        if (extracted_token) {

            back_end_response.clearCookie('token', {

                httpOnly: true,
                secure: true,
                maxAge: 15 * 60 * 1000,
                sameSite: 'None',
                signed: true
            });

            back_end_response.status(200).send({message : "Logout successful"});
        }
        else {

            back_end_response.status(200).send({message : "Logout successful"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




AuthenticationRouter.delete("/signout", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload && front_end_request.payload?.clientId && front_end_request.payload?.clientEmail) {

            const clientId = front_end_request.payload.clientId;

            // ON DELETE CASCADE gère la suppression automatique
            await pool.query(`DELETE FROM clients WHERE client_id=$1`, [clientId]);

            back_end_response.status(200).send({message : "Signout successful"});
        }
        else {

            back_end_response.status(402).send({message : "Payload not found"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




export const sendEmail = async (from, to, subject, text, html) => {

    const transporter = nodemailer.createTransport({

        host : SMTP_DOMAIN,
        port : parseInt(SMTP_PORT),
        secure : false,
        auth : {

            user : HOST_EMAIL,
            pass : HOST_PASSWORD
        },
        debug : true,
        logger : true
    });

    return transporter.sendMail({

        from : from,
        to : to,
        subject : subject,
        text : text,
        html : html
    });
}




AuthenticationRouter.get("/sendVerificationCode", clean, async (front_end_request, back_end_response) => {

    try {

        const {Email} = front_end_request.cleanedQuery;

        const reset_password_token = crypto.randomBytes(32).toString('hex');

        const clients_request = await pool.query(`SELECT client_id FROM clients WHERE email=$1`, [Email]);

        if (clients_request?.rowCount !== 0 && clients_request?.rows[0] && clients_request.rows[0]?.client_id) {

            const clientId = clients_request.rows[0].client_id;

            const reset_password_tokens_request = await pool.query(`
                
                INSERT INTO reset_password_tokens (client_id, token, expires_at) 
                VALUES ($1, $2, NOW() + INTERVAL '1 hour')
                ON CONFLICT (client_id) 
                DO
                UPDATE SET (token, expires_at)=($2, NOW() + INTERVAL '1 hour') WHERE reset_password_tokens.client_id=$1
            
                `, [clientId, reset_password_token]);
        
            if (reset_password_tokens_request?.rowCount !== 0) {

                // Remplacer le premier argument HOST_EMAIL par ASSISTANCE_EMAIL et le deuxième argument HOST_EMAIL par Email en mode production
                await sendEmail(

                    `Tailor Pulp Company <${HOST_EMAIL}>`, 
                    HOST_EMAIL, 
                    `(Password Reset) Your Temporary Verification Code`, 
                    `
                    You asked us to reset your password account.
                    \nHere is your temporary verification code :\t ${reset_password_token}
                    \nIt will expires in >>5 MINUTES<<.
                    \n\n
                    Please do not reply. This is an automated message.
                    \nFor any information or assistance, please contact us at the following email address: ${ASSISTANCE_EMAIL}
                    `,
                    `
                    <p>You asked us to reset your password account.</p>
                    <h1>Here is your temporary verification code : ${reset_password_token}</h1>
                    <p>It will expires in <b>5 MINUTES</b>.</p>
                    <p>Please do not reply. This is an automated message.</p>
                    <p>For any information or assistance, please contact us at the following email address: ${ASSISTANCE_EMAIL}</p>
                    `
                );

                back_end_response.status(200).send({message : "Message sent if the account exists"});
            }
            else {

                back_end_response.status(402).send({message : "token not found"});
            }
        }
        else {

            back_end_response.status(500).send({message : "client_id not found"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




AuthenticationRouter.patch("/modifyClientPassword", clean, async (front_end_request, back_end_response) => {

    try {

        const {Email, code, clientNewPassword} = front_end_request.cleanedBody;

        const clients_request = await pool.query(`SELECT client_id FROM clients WHERE email=$1`, [Email]);

        if (clients_request?.rowCount !== 0 && clients_request?.rows[0] && clients_request.rows[0]?.client_id) {

            const reset_password_tokens_request = await pool.query(`SELECT * FROM reset_password_tokens WHERE token=$1 AND NOW() < expires_at`, [code]);

            if (reset_password_tokens_request?.rowCount !== 0 && reset_password_tokens_request?.rows[0]) {

                const clientId = clients_request.rows[0].client_id;

                const encrypted_new_password = await bcrypt.hash(clientNewPassword, 10);

                const clients_new_request = await pool.query(`UPDATE clients SET password=$1 WHERE client_id=$2`, [encrypted_new_password, clientId]);

                if (clients_new_request?.rowCount !== 0) {

                    back_end_response.status(200).send({message : "The client password has been reset successfully"});
                }
                else {

                    back_end_response.status(500).send({message : "encrypted_new_password not found"});
                }
            }
            else {

                back_end_response.status(402).send({message : "Token has expired"});
            }
        }
        else {

            back_end_response.status(500).send({message : "client_id not found"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});




AuthenticationRouter.get("/generateTOTPSecret", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload && front_end_request.payload?.clientId && front_end_request.payload?.clientEmail) {

            const clientId = front_end_request.payload.clientId;
            const clientName = front_end_request.payload.clientEmail.split("@")[0];

            const totp_secret = speakeasy.generateSecret({name : `TailorPulpClient : ${clientName || clientId}`, issuer : `TailorPulp`});

            const clients_request = await pool.query(`UPDATE clients SET twofa_temp_secret=$1 WHERE client_id=$2`, [totp_secret, clientId]);

            if (clients_request?.rowCount !== 0) {

                qrcode.toDataURL(totp_secret.otpauth_url, (error, data_url) => {

                    if (error) {

                        back_end_response.status(500).send({message : error});
                    }
                    else {

                        const obj = {

                            dataURL : data_url,
                            secretBase32 : totp_secret.base32
                        };

                        back_end_response.status(200).send({message : obj});
                    }
                });
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




AuthenticationRouter.post("/enable-2fa", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload && front_end_request?.payload?.clientId) {

            const {code, secret} = front_end_request.cleanedBody;

            const isTOTPCodeMatching = speakeasy.totp.verify({

                secret : secret,
                encoding : "base32",
                token : code,
                window : 2
            });

            if (isTOTPCodeMatching) {

                const clientId = front_end_request.payload.clientId;

                const clients_request = await pool.query(`UPDATE clients SET (is_2fa_enabled, twofa_secret, twofa_temp_secret)=(true, $1, NULL) WHERE client_id=$2 AND is_2fa_enabled=false`, [secret, clientId]);
            
                if (clients_request?.rowCount !== 0) {

                    back_end_response.status(200).send({message : "2fa enabled successfully"});
                }
                else {

                    back_end_response.status(500).send({message : "Empty request"});
                }
            }
            else {

                back_end_response.status(500).send({message : "TOTP Code not matching"});
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




AuthenticationRouter.delete("/disable-2fa", clean, auth, async (front_end_request, back_end_response) => {

    try {

        if (front_end_request?.payload && front_end_request?.payload?.clientId) {

            const clientId = front_end_request.payload.clientId;

            const {code} = front_end_request.cleanedQuery;

            const clients_new_request = await pool.query(`SELECT twofa_secret FROM clients WHERE client_id=$1`, [clientId]);

            if (clients_new_request?.rowCount !== 0 && clients_new_request?.rows[0] && clients_new_request.rows[0]?.twofa_secret) {

                const totp_secret = clients_new_request.rows[0].twofa_secret;

                const isTOTPCodeMatching = speakeasy.totp.verify({

                    secret : totp_secret,
                    encoding : "base32",
                    token : code,
                    window : 1
                });

                if (isTOTPCodeMatching) {

                    const clientId = front_end_request.payload.clientId;

                    const clients_request = await pool.query(`UPDATE clients SET (is_2fa_enabled, twofa_secret)=(false, NULL) WHERE client_id=$1 AND is_2fa_enabled=true`, [clientId]);
                
                    if (clients_request?.rowCount !== 0) {

                        back_end_response.status(200).send({message : "2fa disabled successfully"});
                    }
                    else {

                        back_end_response.status(500).send({message : "Empty request"});
                    }
                }
                else {

                    back_end_response.status(500).send({message : "TOTP Code not matching"});
                }
            }
            else {

                back_end_response.status(500).send({message : "twofa_secret not found"});
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




AuthenticationRouter.post("/confirm-2fa", clean, async (front_end_request, back_end_response) => {

    try {

        const {clientEmail, clientPassword, code} = front_end_request.cleanedBody;

        const clients_request = await pool.query(`SELECT * FROM clients WHERE email=$1`, [clientEmail]);

        if (clients_request?.rowCount !== 0 && clients_request?.rows[0]) {

            const is_client_password_checked = await bcrypt.compare(clientPassword, clients_request.rows[0].password);

            if (is_client_password_checked) {

                const clients_new_request = await pool.query(`SELECT twofa_secret FROM clients WHERE client_id=$1`, [clients_request.rows[0].client_id]);

                if (clients_new_request?.rowCount !== 0 && clients_new_request?.rows[0] && clients_new_request.rows[0]?.twofa_secret) {

                    const totp_secret = clients_new_request.rows[0].twofa_secret;

                    const isTOTPCodeMatching = speakeasy.totp.verify({

                        secret : totp_secret,
                        encoding : "base32",
                        token : code,
                        window : 1
                    });

                    if (isTOTPCodeMatching) {

                        const token = jwt.sign({clientId : clients_request.rows[0].client_id, clientEmail : clients_request.rows[0].email, role : "user"}, JWT_SECRET, {expiresIn : "1m"});

                        if (token) {

                            back_end_response.cookie('token', token, {

                                httpOnly: true,
                                secure: true,
                                maxAge: 60 * 1000,
                                sameSite: 'None',
                                signed: true
                            });

                            const obj = {

                                token : token,
                                clientFirstName : clients_request.rows[0].email.split("@")[0]
                            };

                            back_end_response.status(200).send({message : obj});
                        }
                        else {

                            back_end_response.status(402).send({message : "Token not found"});
                        }
                    }
                    else {

                        back_end_response.status(500).send({message : "TOTP Code not matching"});
                    }
                }
                else {

                    back_end_response.status(500).send({message : "twofa_secret not found"});
                }
            }
            else {

                back_end_response.status(500).send({message : "password not found"});
            }
        }
        else {

            back_end_response.status(500).send({message : "Empty request"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});

export default AuthenticationRouter;
