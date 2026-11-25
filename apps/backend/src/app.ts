
import express from "express";
import cors from "cors";
import corsOptions from "./config/cors";
import complaintUpdateRoutes from "./api/v1/routes/complaintUpdateRoutes";
import busRouteRoutes from "./api/v1/routes/busRouteRoutes";
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
// Complaint Update routes
app.use("/api/v1/complaint-updates", complaintUpdateRoutes);


//Bus Route routes
app.use("/api/v1/bus-routes", busRouteRoutes);

app.get("/", (_req, res) => {
  res.send("Back-end is running");
});

export default app;
