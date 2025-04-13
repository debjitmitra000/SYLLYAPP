import express from "express";
import { getResult } from "../controllers/test.js";

const app = express.Router();

app.post("/upload",getResult)

export default app;
