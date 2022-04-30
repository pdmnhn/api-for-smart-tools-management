import { Router, Request, Response } from "express";
import { DatabaseError } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database";
import { isString, UserType, UserTypeForToken } from "../utils/types";

const accountRouter = Router();

accountRouter.post("/signup", async (req: Request, res: Response) => {
  const email: unknown = req.body.email;
  const password: unknown = req.body.password;
  const name: unknown = req.body.name;

  if (!isString(email) || !isString(password) || !isString(name)) {
    res.status(400).send({ error: "Invalid or missing values" });
    return;
  } else if (password.length < 8) {
    res.status(400).send({ error: "Password must have atleast 8 characters" });
    return;
  }

  const saltRounds = 10;
  const passwordHash = bcrypt.hashSync(password, saltRounds);
  try {
    await pool.query(
      "INSERT INTO users(email, name, password_hash) VALUES ($1, $2, $3)",
      [email, name, passwordHash]
    );
    res.status(200).end();
  } catch (err: unknown) {
    if (err instanceof DatabaseError) {
      res.status(400).send({ error: err.detail });
    } else {
      res.status(500).send({ error: "Error registering the user" });
    }
    console.log(err);
  }
});

accountRouter.post("/signin", async (req, res) => {
  const email: unknown = req.body.email;
  const password: unknown = req.body.password;

  if (!isString(email) || !isString(password)) {
    res.status(400).send({ error: "Invalid or missing values" });
    return;
  }

  const queryResponse = (
    await pool.query<UserType>(
      "SELECT user_id, email, password_hash FROM users WHERE email=$1",
      [email]
    )
  ).rows;

  if (queryResponse.length !== 1) {
    res.status(400).send({ error: "User does not exist" });
    return;
  }
  const passwordHash = queryResponse[0].password_hash;

  const tokenObject: UserTypeForToken = {
    user_id: queryResponse[0].user_id,
    email: queryResponse[0].email,
  };

  if (!bcrypt.compareSync(password, passwordHash)) {
    res.status(401).send({ error: "Invalid password" });
    return;
  } else {
    const privateKey = process.env.JWT_PRIVATE_KEY;
    const jwtToken = jwt.sign(tokenObject, privateKey);
    res.status(200).send({ token: jwtToken });
    return;
  }
});

export default accountRouter;
