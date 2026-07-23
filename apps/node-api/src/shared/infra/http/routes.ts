import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const MainRoute: FastifyPluginAsyncZod = async (server) => {
	server.get(
		"/health",
		{
			schema: {
				tags: ["Health"],
				summary: "Verifica se o servidor está operacional",
				response: {
					200: z.object({
						status: z.literal("ok"),
						uptime: z
							.date()
							.transform((u) =>
								u.toISOString().substring(11, 19),
							),
						timestamp: z.date().transform((t) => t.toISOString()),
					}),
				},
			},
		},
		async (_request, reply) => {
			return reply.status(200).send({
				status: "ok",
				uptime: new Date(process.uptime() * 1000), // "HH:MM:SS"
				timestamp: new Date(),
			});
		},
	);
};
