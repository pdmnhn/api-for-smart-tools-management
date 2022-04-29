import express from "express";
import accountRouter from "./controllers/account";
import toolsRouter from "./controllers/tools";
import { tokenExtractor, userExtractor } from "./utils/middleware";

const app = express();
app.use(express.json());

app.use("/api/account", accountRouter);

app.use(tokenExtractor);
app.use(userExtractor);

app.use("/api/tools", toolsRouter);

export default app;
