import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url("A VITE_API_URL deve ser uma URL válida"),
  VITE_APP_NAME: z.string().default("AgendLog"),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
  console.error("❌ Variáveis de ambiente inválidas:", _env.error.format());
  throw new Error("Variáveis de ambiente inválidas.");
}

export const env = _env.data;
