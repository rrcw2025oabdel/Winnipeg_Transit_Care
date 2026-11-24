
import express from "express";
import cors from "cors";
import corsOptions from "./config/cors";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Back-end is running");
});

export default app;
