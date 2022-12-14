import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/index.js";
import { errorHandling } from "./middlewares/errorHandlingMiddleware.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(router);
app.use(errorHandling)

const PORT: number = Number(process.env.PORT) || 5000

app.listen(PORT, () => {console.log(`Server listening on ${PORT}`)});