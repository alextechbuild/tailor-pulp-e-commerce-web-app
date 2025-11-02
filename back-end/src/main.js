// ----------------------------------------------- Variables d'environnement

import { DB_HOST, PORT, COOKIE_SECRET, IS_LEADER, SMTP_DOMAIN, SMTP_PORT, HOST_EMAIL, HOST_PASSWORD } from "./config.js";

// ----------------------------------------------- Express

import fs from 'fs';
import https from 'https';
import express from "express";
import Stripe from "stripe";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg from "pg";
import cookieParser from 'cookie-parser';
import nodemailer from "nodemailer";
import cron from "node-cron";
import * as pdf2html from "pdf2html";
import { htmlToText } from 'html-to-text';
import path from 'path';
import { fileURLToPath } from 'url';

// ----------------------------------------------- Routes

import FirstLoadingRouter from './routes/FirstLoadingRoute.js';
import ProductRouter from "./routes/ProductRoute.js";
import RegistrationRouter from './routes/RegistrationRoute.js';
import AuthenticationRouter from './routes/AuthenticationRoute.js';
import ClientRouter from './routes/ClientRoute.js';

// ----------------------------------------------- postgreSQL

const { Pool } = pkg;

const pool = new Pool({

    user: "db_user",
    host: DB_HOST, // localhost en mode dev
    database: "tailor_pulp_db",
    password: "db_user",
    port: 5432
});




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();

app.use(cors({
    origin : "https://localhost:3000",
    credentials: true, // crucial pour autoriser l'envoi de cookies
}));

app.use(express.json());

app.use(cookieParser(COOKIE_SECRET));

app.use("/firstLoading", FirstLoadingRouter);
app.use("/product", ProductRouter);
app.use("/registration", RegistrationRouter);
app.use("/authentication", AuthenticationRouter);
app.use("/client", ClientRouter);




// Exécuté sur une seule instance (le leader spécifiquement)
if (IS_LEADER) {

    const sendNewsletter = async (from, subject, input_file_path, output_file_path) => {

        function get_newsletter_html_content(input_file_path, output_file_path) {

            return new Promise((resolve, reject) => {

                pdf2html.html(input_file_path, (error, html) => {

                    if (error) {

                        reject(error);
                    }
                    else {

                        try {

                            fs.writeFileSync(output_file_path, html);
                            const newsletter_html_content = fs.readFileSync(output_file_path, "utf-8");
                            const newsletter_text_content = htmlToText(output_file_path, {wordwrap : 80});

                            resolve([newsletter_html_content, newsletter_text_content]);
                        }
                        catch(new_error) {

                            reject(new_error);
                        }
                    }
                });
            });
        }

        try {

            const [newsletter_html_content, newsletter_text_content] = await get_newsletter_html_content(input_file_path, output_file_path);

            const clients_request = await pool.query(`SELECT client_id FROM clients WHERE is_subscribed_to_newsletter=true`, []);

            if (clients_request?.rows[0]?.rowCount !== 0 && clients_request.rows[0]?.client_id) {

                const clients_list = clients_request.rows.map((el, _) => (el.client_id));

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

                // Remplacer le deuxième argument to : HOST_EMAIL par to : clients_list en mode production
                await transporter.sendMail({

                    from : from,
                    to : HOST_EMAIL,
                    subject : subject,
                    text : newsletter_text_content,
                    html : newsletter_html_content
                });

                // sendMail() sera géré par le catch pour la réception (ici on précise que l'envoi spécifiquement a bien eu lieu)
                console.log("Newsletter successfully sent");
            }
            else {

                throw (error);
            }
        }
        catch(error) {

            throw (error);
        }
    }

    // Remplacer le premier argument HOST_EMAIL par ASSISTANCE_EMAIL en mode production
    cron.schedule(`0 30 11 * * Fri`, () => (sendNewsletter(`Tailor Pulp Company <${HOST_EMAIL}>`, "Your Newsletter", path.resolve(__dirname, "../../newsletter/newsletter.pdf"), path.resolve(__dirname,"../../newsletter/newsletter.html"))), {scheduled : true, timezone : "Europe/Paris"});
}




// Serveur HTTPS
const options = {

    key : fs.readFileSync(`./certs/localhost+2-key.pem`),
    cert : fs.readFileSync(`./certs/localhost+2.pem`)
};

https.createServer(options, app).listen(PORT, () => {

    console.log(`Ecoute du back-end sur le port ${PORT}`);

});

export default pool;
