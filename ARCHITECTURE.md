# Arquitectura del Módulo de Torneos

## Stack Tecnológico

| Capa       | Tecnología                     |
| ---------- | ------------------------------ |
| Framework  | NestJS                         |
| ORM        | TypeORM                        |
| BD         | PostgreSQL                     |
| Validación | class-validator                |
| Auth       | Passport (JWT)                 |
| Lenguaje   | TypeScript                     |

---

## Clean Architecture — Principios Aplicados

El módulo `tournaments` sigue una arquitectura limpia en 3 capas:

```
+---------------------------+
|      Infrastructure       |  ← HTTP, Persistencia (TypeORM)
+---------------------------+
           ▲ depende
+---------------------------+
|       Application         |  ← Casos de uso, orquestación
+---------------------------+
           ▲ depende
+---------------------------+
|         Domain            |  ← Entidades, reglas de negocio
+---------------------------+
```

**Regla fundamental:** Cada capa solo depende de la capa inferior. El dominio no depende de nada externo.

---

## Árbol de Directorios

```
src/modules/tournaments/
├── tournaments.module.ts              ← Módulo NestJS (DI)
│
├── domain/
│   ├── entities/
│   │   └── tournament.entity.ts       ← Entidad TypeORM + factory
│   ├── interfaces/
│   │   └── tournament-repository.interface.ts  ← Puerto del repositorio
│   └── value-objects/
│       ├── name.vo.ts                 ← VO: nombre no vacío
│       └── date.vo.ts                 ← VO: fecha válida
│
├── application/
│   ├── dto/
│   │   ├── tournament.dto.ts          ← DTO creación/actualización
│   │   ├── update-tournament.dto.ts   ← (sin usar, duplicado)
│   │   └── add-team-to-tournament.dto.ts ← DTO equipo-torneo
│   ├── services/
│   │   └── tournaments.service.ts     ← Fachada (facade)
│   └── use-cases/
│       ├── create-tournament.use-case.ts
│       ├── find-tournaments.use-case.ts
│       ├── find-by-id-tournament.use-case.ts
│       ├── update-tournament.use-case.ts
│       ├── delete-tournament.use-case.ts
│       ├── add-team-tournament.use-case.ts
│       └── remove-team-tournament.use-case.ts
│
└── infrastructure/
    ├── http/
    │   └── tournaments.controller.ts  ← Controlador REST
    └── persistence/
        └── tournament.repository.ts   ← Implementación TypeORM del puerto
```

---

## Desglose por Capas

### 1. Domain

Es la capa más interna. Contiene la lógica de negocio pura. No debe importar nada de NestJS, TypeORM ni de otras capas.

#### Entidades

| Archivo | Responsabilidad |
|---------|----------------|
| `tournament.entity.ts` | Define el agregado `Tournament`. Mapea la tabla `tournaments`. Tiene relaciones ManyToMany con `Team` y OneToMany con `Phase` / `Standing`. Provee un factory method `create()` estático. |

#### Value Objects

| Archivo | Responsabilidad |
|---------|----------------|
| `name.vo.ts` | Envuelve un string `name`. Garantiza que no esté vacío. Inmutable (`readonly value`). |
| `date.vo.ts` | Envuelve un `Date`. Valida que sea una fecha válida. Provee `toString()` en formato `YYYY-MM-DD`. |

#### Interfaces de Repositorio (Puertos)

| Archivo | Responsabilidad |
|---------|----------------|
| `tournament-repository.interface.ts` | Define el contrato que debe cumplir cualquier implementación de persistencia. Métodos: `find`, `create`, `findById`, `findByName`, `update`, `delete`, `addTeamToTournament`, `removeTeamToTournament`. |

**Reglas:**
- ✅ Puede definir *tipos* e *interfaces*.
- ✅ Puede crear instancias de entidades con validación de negocio.
- ❌ NO debe importar NestJS, TypeORM ni frameworks externos (leak conocido: los decoradores `@Entity`, `@Column` están presentes en la entidad).
- ❌ NO debe tener lógica de infraestructura (HTTP, BD, etc.).

---

### 2. Application

Capa de orquestación. Coordina los casos de uso del sistema. Depende de Domain.

#### DTOs

| Archivo | Responsabilidad |
|---------|----------------|
| `tournament.dto.ts` | Define la estructura y validación (`class-validator`) para crear y actualizar torneos. |
| `update-tournament.dto.ts` | Duplicado de `TournamentDto`. Sin uso actual. |
| `add-team-to-tournament.dto.ts` | DTO para las operaciones de agregar/remover equipo de un torneo. |

#### Casos de Uso (Use Cases)

Cada uno encapsula **una** operación específica. Todos siguen el patrón: un `execute()` que recibe datos y retorna un resultado.

| Archivo | Método `execute()` | Responsabilidad |
|---------|--------------------|-----------------|
| `create-tournament.use-case.ts` | `(dto: TournamentDto)` | Valida con VOs, verifica duplicado por nombre, crea y persiste. |
| `find-tournaments.use-case.ts` | `()` | Obtiene todos los torneos. |
| `find-by-id-tournament.use-case.ts` | `(id: number)` | Busca torneo por ID. |
| `update-tournament.use-case.ts` | `(id: number, dto: TournamentDto)` | Valida con VOs y actualiza. |
| `delete-tournament.use-case.ts` | `(id: number)` | Elimina un torneo por ID. |
| `add-team-tournament.use-case.ts` | `(tournamentId, teamId)` | Agrega un equipo al torneo. |
| `remove-team-tournament.use-case.ts` | `(tournamentId, teamId)` | Remueve un equipo del torneo. |

#### Service (Facade)

| Archivo | Responsabilidad |
|---------|----------------|
| `tournaments.service.ts` | Fachada que inyecta todos los Use Cases y delega en ellos. El controller solo conoce al Service, no a los Use Cases individuales. |

**Reglas:**
- ✅ Puede usar DTOs y Value Objects para validar entrada.
- ✅ Puede orquestar múltiples operaciones de dominio.
- ✅ Puede lanzar excepciones HTTP (`ConflictException`, `NotFoundException`).
- ❌ NO debe tener lógica de negocio pura (eso es del dominio).
- ❌ NO debe depender de infraestructura (HTTP, TypeORM directamente).

---

### 3. Infrastructure

Capa externa que conecta la aplicación con el mundo real. Depende de Domain y Application.

#### HTTP

| Archivo | Responsabilidad |
|---------|----------------|
| `tournaments.controller.ts` | Controlador REST con rutas bajo `/tournaments`. Todos los endpoints están protegidos con `@UseGuards(JwtAuthGuard)`. Inyecta el `TournamentsService`. |

**Endpoints:**

| Método | Ruta | Acción |
|--------|------|--------|
| `POST` | `/tournaments` | Crear torneo |
| `GET` | `/tournaments` | Listar todos |
| `GET` | `/tournaments/:id` | Obtener por ID |
| `PATCH` | `/tournaments/:id` | Actualizar |
| `DELETE` | `/tournaments/:id` | Eliminar |
| `POST` | `/tournaments/add-team` | Agregar equipo |
| `POST` | `/tournaments/remove-team` | Remover equipo |

#### Persistencia

| Archivo | Responsabilidad |
|---------|----------------|
| `tournament.repository.ts` | Implementación concreta de `ITournamentRepository` usando TypeORM. Inyecta los repositorios de `Tournament` y `Team`. Contiene la lógica de relaciones ManyToMany (push/filter teams). |

**Reglas:**
- ✅ Puede usar decoradores NestJS/TypeORM.
- ✅ Puede implementar interfaces definidas en Domain.
- ✅ Puede hacer consultas a la BD, transformar respuestas.
- ❌ NO debe contener reglas de negocio.
- ❌ NO debe ser importado por Domain o Application (solo a través de la interfaz).

---

### 4. Module

| Archivo | Responsabilidad |
|---------|----------------|
| `tournaments.module.ts` | Ensambla el módulo: declara imports de TypeORM (`Tournament`, `Team`), registra todos los providers (Service, Use Cases, Repository) y el Controller. Usa string token `'ITournamentRepository'` para el binding del repositorio. |

---

## Flujo de Comunicación entre Capas

### Diagrama General

```
[Cliente HTTP]
      │
      ▼
┌─────────────────────────────────────┐
│  tournaments.controller.ts          │  ← INFRASTRUCTURE (HTTP)
│  Recibe request, extrae params/DTO  │
└──────────┬──────────────────────────┘
           │ inyecta
           ▼
┌─────────────────────────────────────┐
│  tournaments.service.ts             │  ← APPLICATION (Facade)
│  Delega en el Use Case adecuado     │
└──────────┬──────────────────────────┘
           │ inyecta
           ▼
┌─────────────────────────────────────┐
│  create-tournament.use-case.ts      │  ← APPLICATION (Use Case)
│  Valida con VOs, orquesta lógica    │
└──────────┬──────────────────────────┘
           │ inyecta (vía interfaz)
           ▼
┌─────────────────────────────────────┐
│  ITournamentRepository (interface)  │  ← DOMAIN (Puerto)
└──────────┬──────────────────────────┘
           │ implementa
           ▼
┌─────────────────────────────────────┐
│  tournament.repository.ts           │  ← INFRASTRUCTURE (Persistencia)
│  TypeORM: consulta/escribe en BD    │
└─────────────────────────────────────┘
```

### Ejemplo Concreto: Crear Torneo

```
POST /tournaments
Body: { name: "Torneo A", state: "TO_COME", configuration: {...}, startDate: "2025-01-01" }
```

1. **Controller** recibe el request, aplica `ValidationPipe` global, inyecta `TournamentsService`.
2. **Service** recibe el `TournamentDto`, llama a `createTournamentUseCase.execute(dto)`.
3. **Use Case**:
   - Crea `Name` VO → valida que no esté vacío.
   - Crea `MatchDate` VO → valida que la fecha sea válida.
   - Llama a `tournamentRepo.findByName(name)` → verifica que no exista duplicado.
   - Si existe, lanza `ConflictException`.
   - Si no existe, crea la entidad con `Tournament.create(...)`.
   - Llama a `tournamentRepo.create(tournament)`.
4. **Repository** (TypeORM) ejecuta `save(tournament)` y retorna la entidad persistida.
5. La respuesta fluye de regreso: Repository → Use Case → Service → Controller → Cliente.

---

## Convenciones del Proyecto

| Aspecto | Convención |
|---------|------------|
| Entidades | Clase con decoradores TypeORM + método estático `create()` |
| Value Objects | Clase con `readonly value`, validación en constructor |
| Interfaces de repositorio | Prefijo `I` (ej. `ITournamentRepository`), definidas en domain |
| Binding de repositorio | String token `'ITournamentRepository'` con `useClass` |
| Use Cases | Clase `@Injectable()` con único método `execute()` |
| Service | Fachada que inyecta use cases y delega |
| DTOs | Clases con decoradores `class-validator` |
| Controladores | `@UseGuards(JwtAuthGuard)` global, nombres descriptivos |
| Errores | Excepciones HTTP de NestJS (`NotFoundException`, `ConflictException`) |
| Naming archivos | `kebab-case` con sufijo del tipo: `.use-case.ts`, `.vo.ts`, `.dto.ts`, `.entity.ts` |

---

## Catálogo de Componentes

### Domain (4 archivos)

| # | Ruta relativa | Responsabilidad |
|---|---------------|-----------------|
| 1 | `domain/entities/tournament.entity.ts` | Entidad `Tournament` con TypeORM. Relaciones con Team, Phase, Standing. Factory `create()`. |
| 2 | `domain/interfaces/tournament-repository.interface.ts` | Puerto `ITournamentRepository` con 8 métodos de persistencia. |
| 3 | `domain/value-objects/name.vo.ts` | Value Object `Name`. Valida string no vacío. |
| 4 | `domain/value-objects/date.vo.ts` | Value Object `MatchDate`. Valida Date válido. Formato `toString()`. |

### Application (11 archivos)

| # | Ruta relativa | Responsabilidad |
|---|---------------|-----------------|
| 5 | `application/dto/tournament.dto.ts` | DTO con validación para crear/actualizar torneo. |
| 6 | `application/dto/update-tournament.dto.ts` | DTO duplicado sin uso. |
| 7 | `application/dto/add-team-to-tournament.dto.ts` | DTO con `tournamentId` y `teamId`. |
| 8 | `application/use-cases/create-tournament.use-case.ts` | Crea torneo con VOs, evita duplicados. |
| 9 | `application/use-cases/find-tournaments.use-case.ts` | Lista todos los torneos. |
| 10 | `application/use-cases/find-by-id-tournament.use-case.ts` | Busca torneo por ID. |
| 11 | `application/use-cases/update-tournament.use-case.ts` | Actualiza torneo con VOs. |
| 12 | `application/use-cases/delete-tournament.use-case.ts` | Elimina torneo por ID. |
| 13 | `application/use-cases/add-team-tournament.use-case.ts` | Agrega equipo al torneo. |
| 14 | `application/use-cases/remove-team-tournament.use-case.ts` | Remueve equipo del torneo. |
| 15 | `application/services/tournaments.service.ts` | Fachada que inyecta y delega en todos los Use Cases. |

### Infrastructure (2 archivos)

| # | Ruta relativa | Responsabilidad |
|---|---------------|-----------------|
| 16 | `infrastructure/http/tournaments.controller.ts` | Controlador REST con 7 endpoints JWT-guardados. |
| 17 | `infrastructure/persistence/tournament.repository.ts` | Implementación TypeORM de `ITournamentRepository`. |

### Module (1 archivo)

| # | Ruta relativa | Responsabilidad |
|---|---------------|-----------------|
| 18 | `tournaments.module.ts` | Módulo NestJS. Registra providers, controller, imports de TypeORM y MatchesModule. |

---

## Dependencias Externas del Módulo

| Módulo externo | Tipo de dependencia | Archivo que lo importa |
|----------------|---------------------|------------------------|
| `TeamsModule` (Team entity) | Persistencia (TypeORM forFeature) | `tournament.repository.ts`, `tournaments.module.ts` |
| `Team` (entidad) | Relación ManyToMany | `tournament.entity.ts` |
| `Phase` (entidad) | Relación OneToMany | `tournament.entity.ts` |
| `Standing` (entidad) | Relación OneToMany | `tournament.entity.ts` |
| `MatchesModule` | Import de módulo NestJS | `tournaments.module.ts` |
| `JwtAuthGuard` | Guard de autenticación | `tournaments.controller.ts` |
