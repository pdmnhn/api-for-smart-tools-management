import express, { Request, Response } from "express";
import accountRouter from "./controllers/account";
import toolsRouter from "./controllers/tools";
import { tokenExtractor, userExtractor } from "./utils/middleware";

const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "This application is deployed by EIE students for a DBMS project",
  });
});

app.use("/api/account", accountRouter);

app.use(tokenExtractor);
app.use(userExtractor);

app.use("/api/tools", toolsRouter);

export default app;
