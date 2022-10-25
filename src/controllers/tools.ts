import { Router, Request, Response } from "express";
import { DatabaseError } from "pg";
import pool from "../database";
import {
  FetchedToolsType,
  isString,
  ReturnToolType,
  TakeToolType,
} from "../utils/types";

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

toolsRouter.post("/take", async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).send({ error: "User must be logged in" });
    return;
  }
  const encryptionCode: unknown = req.body.encryptionCode;

  if (!isString(encryptionCode)) {
    res.status(400).send({ error: "Encryption code must be provided" });
    return;
  }

  const { rows } = await pool.query<TakeToolType>(
    `SELECT tool_code, user_id, usage_type, rack, current_status FROM tools WHERE encryption_code = $1`,
    [encryptionCode]
  );

  if (rows.length != 1) {
    res.status(400).send({ error: "Invalid encryption code" });
    return;
  }

  const { tool_code, user_id, usage_type, rack, current_status } = rows[0];

  if (user_id !== null) {
    res.status(400).send({ error: "The tool is already taken" });
    return;
  }

  if (usage_type === "once") {
    await pool.query(`DELETE FROM scan_log WHERE tool_code = $1`, [tool_code]);
    await pool.query(`DELETE FROM tools WHERE tool_code = $1`, [tool_code]);
  } else {
    await pool.query(
      `UPDATE tools SET user_id = $1, last_scan = NOW() WHERE tool_code = $2;`,
      [req.user.user_id, tool_code]
    );
    await pool.query(
      `INSERT INTO scan_log(user_id, tool_code, status, taken)
      VALUES
      ($1, $2, $3, true);`,
      [req.user.user_id, tool_code, current_status]
    );
  }

  res.status(200).json({
    rack,
    current_status,
    usage_type,
  });
});

toolsRouter.post("/return", async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).send({ error: "User must be logged in" });
    return;
  }

  const encryptionCode: unknown = req.body.encryptionCode;

  if (!isString(encryptionCode)) {
    res.status(400).send({ error: "Encryption code must be provided" });
    return;
  }

  const { rows } = await pool.query<ReturnToolType>(
    `SELECT tool_code, user_id, rack FROM tools WHERE encryption_code = $1`,
    [encryptionCode]
  );

  if (rows.length != 1) {
    res
      .status(400)
      .send({ error: "There is no tool with that encryption code" });
  }

  const row = rows[0];
  const user_id = row.user_id;
  const tool_code = row.tool_code;
  const rack = row.rack;

  if (user_id != req.user.user_id) {
    res.status(400).send({ error: "The tool is not taken by the user" });
    return;
  }

  const remarksByUser: unknown = req.body.remarks;
  let status: unknown = req.body.status;

  if (!isString(status)) {
    res.status(400).send({ error: "Status of the tool must be included" });
    return;
  } else {
    status = status.toLowerCase();
  }

  const remarks = isString(remarksByUser) ? remarksByUser : null;

  try {
    await pool.query(
      `INSERT INTO scan_log(tool_code, user_id, status, taken, remarks)
    VALUES ($1, $2, $3, false, $4);`,
      [tool_code, user_id, status, remarks]
    );
    await pool.query(
      `UPDATE tools SET user_id = null, last_scan = NOW() WHERE tool_code = $1`,
      [tool_code]
    );
    res.status(200).json({ rack });
  } catch (err: unknown) {
    if (err instanceof DatabaseError) {
      res.status(400).send({ error: err.message });
    } else {
      res.status(500).end();
    }
    console.log(err);
  }
});

export default toolsRouter;
