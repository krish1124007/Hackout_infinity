import express from "express";
import { user_router } from "./routes/user.routes.js";
import { admin_router } from "./routes/admin.routes.js";
import { machineproduct_router } from "./routes/machineseller.routes.js"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"
import { serve } from "inngest/express";   
import { inngest } from "./inngest/client.js";     
import { onDelete } from "./inngest/functions/on-delete.js"; 
import { helpAiProcess } from "./inngest/functions/ai-process.js"; 

dotenv.config();

const app = express();

app.use(cors({origin:"*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", user_router);
app.use("/api/v1/admin", admin_router);
app.use("/api/v1/machineproduct" , machineproduct_router);


app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onDelete, helpAiProcess],  
  })
);

export { app };
