
import express from "express";
import cors from "cors";
import corsOptions from "./config/cors";
import complaintUpdateRoutes from "./api/v1/routes/complaintUpdateRoutes";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
// Complaint Update routes
app.use("/api/v1/complaint-updates", complaintUpdateRoutes);

app.get("/", (_req, res) => {
  res.send("Back-end is running");
});

export default app;
