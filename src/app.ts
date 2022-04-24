import express from "express";
import accountRouter from "./controllers/account";
import { tokenExtractor, userExtractor } from "./utils/middleware";

const app = express();
app.use(express.json());

app.use("/account", accountRouter);

app.use(tokenExtractor);
app.use(userExtractor);

export default app;
