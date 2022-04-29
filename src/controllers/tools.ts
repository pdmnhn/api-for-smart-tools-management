import { Router, Request, Response } from "express";
import pool from "../database";
import { FetchedToolsType } from "../utils/types";

const toolsRouter = Router();

toolsRouter.get("/", async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    res.status(401).send({ error: "User must be logged in" });
    return;
  }

  const queryResponse = await pool.query<FetchedToolsType>(
    `SELECT tool_code,
            tooltype_name,
            subtype_name,
            brand_name,
            category_name,
            usage_type,
            rack,
            current_status,
            last_scan::TIMESTAMPTZ
            
            FROM
        
        (SELECT * FROM
            
            (SELECT * FROM
                (SELECT * FROM tools WHERE user_id = $1) AS tools
                LEFT JOIN tool_subtypes
                ON tool_subtypes.subtype_id = tools.subtype_id
                LEFT JOIN brands
                ON brands.brand_id = tools.brand_id) AS tools

            LEFT JOIN tool_types
            ON tool_types.tooltype_id = tools.tooltype_id) AS tools

        LEFT JOIN categories
        ON categories.category_id = tools.category_id`,
    [user.user_id]
  );

  res.status(200).json(queryResponse.rows);
});

toolsRouter.put("/take", (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).send({ error: "User must be logged in" });
    return;
  }
});

export default toolsRouter;
