import { AppError } from "./base.error";

export class UnauthorizedError extends AppError {
	constructor(message = "Não autorizado") {
		super(message, 401);
	}
}

export class ForbiddenError extends AppError {
	constructor(message = "Acesso proibido") {
		super(message, 403);
	}
}

export class InvalidCredentialsError extends AppError {
	constructor(message = "Credenciais inválidas") {
		super(message, 401);
	}
}

export class TokenExpiredError extends AppError {
	constructor(message = "Token expirado") {
		super(message, 401);
	}
}

export class InvalidTokenError extends AppError {
	constructor(message = "Token inválido") {
		super(message, 401);
	}
}
