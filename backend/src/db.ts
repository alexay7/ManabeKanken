import mongoose from "mongoose";
import {config} from "./config/config";

export default function connectDB() {
    const url = config.MONGO_URI as string;

    try {
        void mongoose.connect(url,);
    } catch (err) {
        const error = err as Error;

        console.error(error.message);
        process.exit(1);
    }
    const dbConnection = mongoose.connection;
    dbConnection.once("open", (_) => {
        console.log(`Database connected: ${url}`);
    });

    dbConnection.on("error", (err) => {
        console.error(`connection error: ${err}`);
    });
    return;
}

export const db = mongoose.createConnection(config.MONGO_URI!);

db.on('connected', function () {
    console.log(`Conectado a la base de datos`);
});