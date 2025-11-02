// ----------------------------------------------- Express

import express from "express";
import Stripe from "stripe";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pkg from "pg";

// ----------------------------------------------- Routes

const FirstLoadingRouter = express.Router();

// ----------------------------------------------- postgreSQL

import pool from "../main.js";




FirstLoadingRouter.get("/loadImgs", async (front_end_request, back_end_response) => {

    try {

        const {Category} = front_end_request.query;

        const request = await pool.query(`SELECT * FROM products WHERE category=$1`, [Category]);

        if (request.rowCount !== 0) {

            back_end_response.status(200).send({message : request.rows});
        }
        else {

            back_end_response.status(500).send({message : "Error : empty request"});
        }
    }
    catch(error) {

        back_end_response.status(500).send({message : error.stack});
    }
});

export default FirstLoadingRouter;
