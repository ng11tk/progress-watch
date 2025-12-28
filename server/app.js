import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/database.js";
import { serverPublicRouter, serverPrivateRouter } from "./router/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// use routers
app.use("/server", serverPublicRouter);
app.use("/server", serverPrivateRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
