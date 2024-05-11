import express from "express";
import "dotenv/config"; //Para usar .env
import "./database/connectbd.js";

//rutas
import authRoute from "./routes/auth.route.js";
import routerTable from "./routes/table.route.js";
import routerMenu from "./routes/menu.route.js";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
//para cookies
app.use(cookieParser());
app.use(cors());

//lamar rutas
app.use("/api/v1/", authRoute);
app.use('/api/v1/', routerTable);
app.use("/api/v1/", routerMenu)

app.listen(PORT, () => {
  console.log("Running: " + PORT);
});
