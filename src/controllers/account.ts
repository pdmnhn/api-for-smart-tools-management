import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { isString } from "../utils/types";
import pool from "../database";

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
  const password_hash = bcrypt.hashSync(password, saltRounds);
  try {
    await pool.query(
      "INSERT INTO users(email, name, password_hash) VALUES ($1 $2 $3)",
      [email, name, password_hash]
    );
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error registering the user");
  }
});

export default accountRouter;
