import { Router, Request, Response } from "express";
import { DatabaseError } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../database";
import { isString, UserType, UserTypeForToken } from "../utils/types";

const accountRouter = Router();
const saltRounds = 10;

accountRouter.post("/signup", async (req: Request, res: Response) => {
  const email: unknown = req.body.email;
  const loginId: unknown = req.body.loginId;
  const name: unknown = req.body.name;

  if (!isString(email) || !isString(loginId) || !isString(name)) {
    res.status(400).send({ error: "Invalid or missing values" });
    return;
  }
  const loginIdHash = bcrypt.hashSync(loginId, saltRounds);
  try {
    await pool.query(
      "INSERT INTO users(email, name, login_id_hash) VALUES ($1, $2, $3)",
      [email, name, loginIdHash]
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
  const loginId: unknown = req.body.loginId;

  if (!isString(loginId)) {
    res.status(400).send({ error: "Invalid or missing values" });
    return;
  }
  const loginIdHash = bcrypt.hashSync(loginId, saltRounds);

  const queryResponse = (
    await pool.query<UserType>(
      "SELECT user_id, email, login_id_hash FROM users WHERE login_id_hash=$1",
      [loginIdHash]
    )
  ).rows;

  if (queryResponse.length !== 1) {
    res.status(400).send({ error: "User does not exist" });
    return;
  }

  const tokenObject: UserTypeForToken = {
    user_id: queryResponse[0].user_id,
    email: queryResponse[0].email,
  };

  const privateKey = process.env.JWT_PRIVATE_KEY;
  const jwtToken = jwt.sign(tokenObject, privateKey);
  res.status(200).send({ token: jwtToken });
});

export default accountRouter;
