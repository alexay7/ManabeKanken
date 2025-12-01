import dotenv from "dotenv";

dotenv.config();

const {
    MONGO_URI,
    PORT,
    FRONTEND_URL,
} = process.env;

if (!MONGO_URI || !PORT || !FRONTEND_URL) {
    throw new Error("Missing environment variables");
}

export const config = {
    MONGO_URI,
    PORT,
    FRONTEND_URL,
};