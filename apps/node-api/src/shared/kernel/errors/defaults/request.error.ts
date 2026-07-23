import type { ZodIssue } from "zod";
import { AppError } from "./base.error";

export class BadRequestError extends AppError {
	constructor(message = "Requisição inválida") {
		super(message, 400);
	}
}

export class ValidationError extends AppError {
	readonly issues: ZodIssue[];

	constructor(issues: ZodIssue[], message = "Erro de validação") {
		super(message, 422); // fix: validação semântica é 422, não 400
		this.issues = issues;
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

export class MissingFieldError extends AppError {
	readonly field: string;

	constructor(field: string) {
		super(`Campo obrigatório em falta: ${field}`, 400);
		this.field = field;
		Object.setPrototypeOf(this, MissingFieldError.prototype);
	}
}

export class RateLimitError extends AppError {
	readonly retryAfter?: number; // segundos

	constructor(retryAfter?: number) {
		super("Demasiadas requisições. Tente mais tarde.", 429);
		this.retryAfter = retryAfter;
		Object.setPrototypeOf(this, RateLimitError.prototype);
	}
}
