import { AppError } from "./base.error";

export class NotFoundError extends AppError {
	constructor(resource?: string) {
		super(
			resource ? `${resource} não encontrado` : "Recurso não encontrado",
			404,
		);
	}
}

// Removido AlreadyExistsError — redundante com ConflictError
export class ConflictError extends AppError {
	constructor(message = "Conflito de dados") {
		super(message, 409);
	}
}

export class GoneError extends AppError {
	constructor(message = "Recurso removido permanentemente") {
		super(message, 410);
	}
}
