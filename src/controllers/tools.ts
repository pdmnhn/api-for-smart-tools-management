import { Router, Request, Response } from "express";
import { DatabaseError } from "pg";
import pool from "../database";

const toolsRouter = Router();

toolsRouter.get("/", async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).send({ error: "User must be logged in" });
    return;
  } else {
    console.log(req.user);
  }
});

export default toolsRouter;
