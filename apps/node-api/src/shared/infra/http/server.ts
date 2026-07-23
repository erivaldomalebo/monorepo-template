import "tsconfig-paths/register";
import { fastifyCors } from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { FastifyServerOptions, fastify } from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "@/shared/infra/config/env.config";
import { AppError, getHttpStatusText } from "@/shared/kernel/errors/defaults";
import { MainRoute } from "./routes";

const getLoggerConfig = (): FastifyServerOptions["logger"] => {
	if (env.NODE_ENV === "test") return false;

	if (env.NODE_ENV === "development") {
		return {
			level: "debug",
			transport: {
				target: "pino-pretty",
				options: {
					translateTime: "HH:MM:ss Z",
					ignore: "pid,hostname",
				},
			},
		};
	}

	return {
		level: "info",
		transport: {
			target: "pino/file",
			options: {
				destination: "./logs/app.log",
				mkdir: true,
			},
		},
	};
};

export const server = fastify({
	logger: getLoggerConfig(),
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(fastifyCors, {
	origin: true,
	methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	// credentials: true,
});

server.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	formatUser(payload) {
		return payload;
	},
});

/*
 * Registro do Rate limit
 * max - Máximo de requisições permitidas
 * timeWindow - Tempo para renovação do limite
 */
server.register(fastifyRateLimit, {
	max: 100,
	timeWindow: "1 minute",
	errorResponseBuilder: (_, context) => ({
		status: 429,
		error: "Too Many Requests",
		message: `Você atingiu o limite de ${context.max} requisições por minuto.`,
	}),
});

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Node-API",
			description:
				"Boilerplate para uma api usando typescript, fastify, swagger e scalar",
			version: "1.0.3",
		},
	},
	transform: jsonSchemaTransform,
});

server.register(ScalarApiReference, {
	routePrefix: "/docs",
	configuration: {
		theme: "default",
		showDeveloperTools: "never",
		mcp: {
			disabled: true,
		},
	},
});

server.register(MainRoute);

server.setNotFoundHandler((req, reply) => {
	reply.status(404).send({ error: "Rota não encontrada", path: req.url });
});

server.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			error: "Bad Request",
			message: "Erro de validação nos dados da requisição",
			status: 400,
			issues: error.validation,
		});
	}

	if (error instanceof AppError) {
		return reply.status(error.statusCode).send({
			error: getHttpStatusText(error.statusCode),
			message: error.message,
			status: error.statusCode,
		});
	}

	if (error instanceof Error) {
		const status = (error as { statusCode?: number }).statusCode ?? 500;
		return reply.status(status).send({
			error: getHttpStatusText(status),
			message: error.message,
			status,
		});
	}

	request.log.error(error);
	reply.status(500).send({
		error: "Internal Server Error",
		message: "Erro interno do servidor",
		status: 500,
	});
});

async function main() {
	try {
		await server.listen({ port: Number(env.PORT), host: "0.0.0.0" });
		console.log(`🔥 HTTP server running on http://localhost:${env.PORT}`);
		console.log(`📚 Docs available at http://localhost:${env.PORT}/docs`);
	} catch (err) {
		server.log.error(err, "Falha ao iniciar o servidor:");
		process.exit(1);
	}
}

const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
for (const signal of signals) {
	process.on(signal, async () => {
		try {
			await server.close();
			console.log("\n🛑 Servidor encerrado com sucesso.");
			process.exit(0);
		} catch (err) {
			console.error("Erro ao encerrar o servidor:", err);
			process.exit(1);
		}
	});
}

main();
