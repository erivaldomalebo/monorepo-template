import type { FastifyReply, FastifyRequest } from "fastify";

export const ensureAuthenticated = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		await request.jwtVerify();
	} catch {
		reply.code(401).send({
			status: 401,
			message:
				"Acesso negado. Você precisa estar autenticado para acessar este recurso.",
		});
	}
};
