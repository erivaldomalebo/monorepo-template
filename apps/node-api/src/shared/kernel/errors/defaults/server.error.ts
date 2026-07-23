import { AppError } from "./base.error";

export class InternalServerError extends AppError {
	constructor(message = "Erro interno do servidor") {
		super(message, 500, false);
	}
}

export class ServiceUnavailableError extends AppError {
	constructor(message = "Serviço temporariamente indisponível") {
		super(message, 503, false);
	}
}

export class ExternalServiceError extends AppError {
	readonly service: string;

	constructor(service: string, message?: string) {
		super(
			message ?? `Falha ao comunicar com o serviço: ${service}`,
			502,
			false,
		);
		this.service = service;
		Object.setPrototypeOf(this, ExternalServiceError.prototype);
	}
}
