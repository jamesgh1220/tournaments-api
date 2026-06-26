# Formato de Respuestas HTTP

## Visión General

Toda respuesta HTTP de la API sigue un **envelope uniforme** con la estructura `ApiResponse<T>`. Esto garantiza que el cliente siempre reciba un objeto con la misma forma, independientemente de si la operación fue exitosa o falló.

## Estructura del Envelope

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;     // true = operación exitosa, false = error
  statusCode: number;   // Código HTTP (200, 201, 204, 400, 401, 404, 409, 500, etc.)
  message: string;      // Mensaje legible para el cliente
  data: T | null;       // Payload de la respuesta (null en errores)
  error: string | null; // Nombre de la excepción (null en respuestas exitosas)
  timestamp: string;    // ISO 8601 del momento en que se generó la respuesta
}
```

## Ejemplos por Tipo de Respuesta

### Éxito — GET /tournaments (200 OK)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operación exitosa",
  "data": [
    {
      "id": 1,
      "name": "Torneo A",
      "state": "TO_COME",
      "startDate": "2026-01-01T00:00:00.000Z"
    }
  ],
  "error": null,
  "timestamp": "2026-06-26T12:00:00.000Z"
}
```

### Éxito — POST /tournaments (201 Created)

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Recurso creado exitosamente",
  "data": {
    "id": 1,
    "name": "Torneo A",
    "state": "TO_COME",
    "startDate": "2026-01-01T00:00:00.000Z"
  },
  "error": null,
  "timestamp": "2026-06-26T12:00:00.000Z"
}
```

### Éxito — DELETE /tournaments/1 (204 No Content)

**No hay body en la respuesta.** El interceptor detecta el status code 204 y pasa la respuesta sin modificarla.

### Error — GET /tournaments/999 (404 Not Found)

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Torneo con id 999 no encontrado",
  "data": null,
  "error": "NotFoundException",
  "timestamp": "2026-06-26T12:00:00.000Z"
}
```

### Error — POST /tournaments con nombre duplicado (409 Conflict)

```json
{
  "success": false,
  "statusCode": 409,
  "message": "Ya existe un torneo con ese nombre.",
  "data": null,
  "error": "ConflictException",
  "timestamp": "2026-06-26T12:00:00.000Z"
}
```

### Error — POST /users/login con credenciales inválidas (401 Unauthorized)

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "data": null,
  "error": "UnauthorizedException",
  "timestamp": "2026-06-26T12:00:00.000Z"
}
```

### Error — DTO inválido (400 Bad Request)

Cuando el `ValidationPipe` rechaza un body mal formado, el mensaje toma el primer error de validación:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "name must be a string",
  "data": null,
  "error": "BadRequestException",
  "timestamp": "2026-06-26T12:00:00.000Z"
}
```

## Mapa de Status Codes

| Método | Endpoint | Status Code | `data` |
|--------|----------|-------------|--------|
| `GET` | `/tournaments` | `200` | `Tournament[]` |
| `GET` | `/tournaments/:id` | `200` | `Tournament` |
| `POST` | `/tournaments` | `201` | `Tournament` |
| `PATCH` | `/tournaments/:id` | `200` | `Tournament` |
| `DELETE` | `/tournaments/:id` | **`204`** | — |
| `POST` | `/tournaments/:id/teams` | `201` | `Tournament` |
| `DELETE` | `/tournaments/:id/teams/:teamId` | **`204`** | — |
| `POST` | `/users/register` | `201` | `User` (sin password) |
| `POST` | `/users/login` | `200` | `{ accessToken, user }` |

> Los DELETE retornan `204 No Content`. El interceptor **no envuelve** las respuestas `204` — se devuelven sin body.

## Arquitectura de la Implementación

```
[Cliente HTTP]
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  HttpExceptionFilter   (global)                          │
│  Captura HttpException → response.status().json(body)    │
│  SOLO si el controlador lanza una excepción              │
└──────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  Controller                                              │
│  Ej: TournamentsController.create()                      │
│  Retorna Promise<Tournament>                             │
│  (si lanza excepción, va al filter)                      │
└──────────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  ResponseInterceptor   (global)                          │
│  Intercepta la respuesta exitosa                         │
│  La envuelve en ApiResponse<T>                           │
│  Si statusCode === 204 → pasa sin cambios                │
└──────────────────────────────────────────────────────────┘
     │
     ▼
[Cliente HTTP ← JSON con ApiResponse]
```

## Componentes

### 1. ApiResponse Interface

**Archivo:** `src/common/interfaces/api-response.interface.ts`

Define el contrato del envelope. Genérica sobre `T` para tipar el `data`.

```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  error: string | null;
  timestamp: string;
}
```

### 2. ResponseInterceptor

**Archivo:** `src/common/interceptors/response.interceptor.ts`

Interceptor global registrado en `main.ts` con `app.useGlobalInterceptors()`.

**Comportamiento:**
1. Obtiene `statusCode` del objeto `Response` de Express
2. Si es `204` → pasa el `Observable` sin modificar (no hay body que wrapper)
3. Si no es `204` → suscribe al `Observable`, mapea el `data` devuelto por el controlador y lo envuelve en `ApiResponse`
4. El `message` se determina según el status code (200 → "Operación exitosa", 201 → "Recurso creado exitosamente", etc.)

```typescript
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | T> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode: number = response.statusCode;

    if (statusCode === 204) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        statusCode,
        message: this.getMessage(statusCode),
        data: data ?? null,
        error: null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
  // ...
}
```

### 3. HttpExceptionFilter

**Archivo:** `src/common/filters/http-exception.filter.ts`

Exception filter global registrado en `main.ts` con `app.useGlobalFilters()`.

**Comportamiento:**
1. Captura cualquier `HttpException` (incluyendo las lanzadas por use cases y por `ValidationPipe`)
2. Extrae `statusCode` y `message` del objeto `exception`
3. Si el mensaje viene como array (caso típico de `ValidationPipe`), toma el primer elemento
4. Responde con `response.status(statusCode).json(body)` donde `body` es `ApiResponse` con `success: false`

**Manejo del mensaje:**

```typescript
let message: string;
if (typeof exceptionResponse === 'string') {
  message = exceptionResponse;
} else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
  const body = exceptionResponse as Record<string, unknown>;
  message = (Array.isArray(body.message) ? body.message[0] : body.message) as string ?? exception.message;
} else {
  message = exception.message;
}
```

Esto cubre tres escenarios:
- **string** → `throw new NotFoundException('mensaje')`
- **objeto con message array** → `ValidationPipe` cuando hay múltiples errores
- **objeto con message string** → otros casos

## NotFoundException en Use Cases

Para evitar que `findById` retorne `null` con status 200, cada use case que busca un recurso por ID ahora lanza `NotFoundException` si no lo encuentra.

**Antes:**
```typescript
async execute(id: number): Promise<Tournament | null> {
  const tournament = await this.tournamentRepo.findById(id);
  return tournament;  // null → cliente recibe 200 con body null
}
```

**Después:**
```typescript
async execute(id: number): Promise<Tournament> {
  const tournament = await this.tournamentRepo.findById(id);
  if (!tournament) {
    throw new NotFoundException(`Torneo con id ${id} no encontrado`);
  }
  return tournament;  // siempre existe → status 200 con data
}
```

Estos 11 use cases fueron modificados siguiendo este patrón:

| Módulo | Use Case |
|--------|----------|
| Tournaments | `find-by-id-tournament.use-case.ts` |
| Tournaments | `update-tournament.use-case.ts` |
| Tournaments | `add-team-tournament.use-case.ts` |
| Tournaments | `remove-team-from-tournament.use-case.ts` |
| Teams | `find-by-id-team.use-case.ts` |
| Teams | `update-team.use-case.ts` |
| Groups | `find-by-id-group.use-case.ts` |
| Groups | `update-group.use-case.ts` |
| Matches | `find-by-id-match.use-case.ts` |
| Matches | `update-match.use-case.ts` |
| Standings | `update-standing.use-case.ts` |

## DELETE con 204 No Content

Todos los endpoints `DELETE` ahora llevan `@HttpCode(HttpStatus.NO_CONTENT)` para retornar `204` sin body.

| Módulo | Endpoint |
|--------|----------|
| Tournaments | `DELETE /tournaments/:id` |
| Tournaments | `DELETE /tournaments/:id/teams/:teamId` |
| Teams | `DELETE /teams/:id` |
| Standings | `DELETE /standings/:id` |
| Groups | `DELETE /groups/:id` |
| Matches | `DELETE /matches/:id` |

El interceptor detecta `statusCode === 204` y **no envuelve** la respuesta (pasa el `Observable` sin el `map`). Esto es necesario porque `204 No Content` no debe tener body — si el interceptor intentara wrapper la respuesta, NestJS forzaría un body y violaría el estándar HTTP.

## Registro Global en main.ts

Los componentes se registran en `src/main.ts` **después** de `enableCors()` y `ValidationPipe`:

```typescript
app.enableCors();
app.useGlobalPipes(new ValidationPipe());
app.useGlobalInterceptors(new ResponseInterceptor());
app.useGlobalFilters(new HttpExceptionFilter());
```

El **orden importa**: los interceptores se ejecutan después de los filters en la cadena NestJS. Si un controlador lanza una excepción, el `HttpExceptionFilter` la captura antes de que llegue al `ResponseInterceptor`.

## Controladores No Modificados

| Controlador | Razón |
|-------------|-------|
| `users.controller.ts` | Ya tenía `@HttpCode(HttpStatus.OK)` en login. Register usa 201 por defecto. No tiene endpoints DELETE. |
| `app.controller.ts` | Solo `GET /` que retorna un string simple. Sin nulls, sin DELETE. |
| `phase.controller.ts` | Solo expone `POST /phases` (create). Sin findById, update o DELETE expuestos. |
