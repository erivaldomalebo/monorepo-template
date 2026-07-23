# Guia de Erros da API

## Auth Errors — `auth.error.ts`

| Classe | Status | Quando usar |
|---|---|---|
| `UnauthorizedError` | 401 | Requisição sem token ou sem sessão ativa |
| `InvalidCredentialsError` | 401 | Login com email/senha incorretos |
| `TokenExpiredError` | 401 | Token JWT expirado |
| `InvalidTokenError` | 401 | Token malformado ou assinatura inválida |
| `ForbiddenError` | 403 | Utilizador autenticado mas sem permissão para o recurso |

---

## Request Errors — `request.error.ts`

| Classe | Status | Quando usar |
|---|---|---|
| `BadRequestError` | 400 | Requisição malformada, parâmetros inválidos no geral |
| `MissingFieldError` | 400 | Campo obrigatório ausente no body/query/params |
| `ValidationError` | 422 | Schema Zod falhou — dados recebidos mas semanticamente inválidos |
| `RateLimitError` | 429 | Limite de requisições atingido — passa `retryAfter` em segundos |

---

## Resource Errors — `resource.error.ts`

| Classe | Status | Quando usar |
|---|---|---|
| `NotFoundError` | 404 | Recurso não existe no banco — passa o nome: `new NotFoundError("Utilizador")` |
| `ConflictError` | 409 | Operação viola uma regra de integridade — ex: email duplicado, estado inválido |
| `GoneError` | 410 | Recurso existiu mas foi deletado permanentemente |

---

## Server Errors — `server.error.ts`

| Classe | Status | Quando usar |
|---|---|---|
| `InternalServerError` | 500 | Erro inesperado sem causa identificada — `isOperational: false` |
| `ServiceUnavailableError` | 503 | Servidor em manutenção ou sobrecarga — `isOperational: false` |
| `ExternalServiceError` | 502 | Falha ao chamar serviço externo — ex: Stripe, S3, serviço de email |

---

## Regra rápida

- Utilizador fez algo errado → **400 / 401 / 403 / 404 / 409 / 422**
- O teu servidor falhou → **500 / 502 / 503**
- Utilizador está a abusar → **429**