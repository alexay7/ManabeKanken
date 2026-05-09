import connectDB from "./db";
import {config} from "./config/config";
import {Elysia} from "elysia";
import cors from "@elysiajs/cors";
import examRouter from "./routes/exam.router";
import {dictadoRouter} from "./routes/dictado.router";
import {songRouter} from "./routes/song.router";

// configures dotenv to work in your application
const app = new Elysia()
    .use(cors())
    .use(examRouter)
    .use(dictadoRouter)
    .use(songRouter)
    .listen({port: config.PORT});

// Initialize DB
connectDB();

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)