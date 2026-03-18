import connectDB from "./db";
import {config} from "./config/config";
import {Elysia} from "elysia";
import cors from "@elysiajs/cors";
import examRouter from "./routes/exam.router";
import {dictadoRouter} from "./routes/dictado.router";

// configures dotenv to work in your application
const app = new Elysia()
    .use(cors())
    .use(examRouter)
    .use(dictadoRouter)
    .listen({port: config.PORT});

// Initialize DB
connectDB();

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)