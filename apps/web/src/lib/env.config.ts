import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	NEXT_PUBLIC_BASE_URL: z.url(
		"A variável NEXT_PUBLIC_BASE_URL deve ser uma URL válida.",
	),
	NEXT_PUBLIC_API_URL: z.url(
		"A variável NEXT_PUBLIC_API_URL deve ser uma URL válida.",
	),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error(
		"❌ Variáveis de ambiente inválidas:",
		JSON.stringify(_env.error.cause, null, 2),
	);
	throw new Error("Falha na validação das variáveis de ambiente.");
}

export const env = _env.data;
