import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { corsOptions } from "./constants/config.js";
import testRoute from "./routes/test.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/v1/test", testRoute);

app.get("/", (req, res) => {
    res.send("Hello World");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export { app, server };