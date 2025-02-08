import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: './.env.local' });  // Explicitly point to the .env.local file


export default defineConfig({
    dialect: "postgresql",
    schema: "./utils/schema.js",
    out: "./utils/migrations",
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_URL,
    }
});
