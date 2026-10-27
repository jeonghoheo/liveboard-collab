import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgres://liveboard:liveboard@127.0.0.1:5433/liveboard"),
  SERVER_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  WEB_ORIGIN: z.string().min(1).default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
