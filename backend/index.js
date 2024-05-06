import express from "express";
import "dotenv/config"; //Para usar .env
import "./database/connectbd.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
//para cookies
app.use(cookieParser());
app.use(cors());
app.use("/api/v1/", authRoute);
app.listen(PORT, () => {
  console.log("Running: " + PORT);
});
