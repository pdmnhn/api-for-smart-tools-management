import express from "express";
import accountRouter from "./src/controllers/account";

const app = express();
app.use(express.json());

app.use("/account", accountRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
