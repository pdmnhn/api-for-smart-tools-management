import express, { Request, Response } from "express";
import accountRouter from "./controllers/account";
import toolsRouter from "./controllers/tools";
import { tokenExtractor, userExtractor } from "./utils/middleware";
import cors from "cors";

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "Smart Inventory Tools and Asset Tracking",
  });
});

app.use("/api/account", accountRouter);

app.use(tokenExtractor);
app.use(userExtractor);

app.use("/api/tools", toolsRouter);

export default app;
