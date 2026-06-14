# Arquitectura del Proyecto

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

Cada módulo (`tournaments`, `teams`, `users`) sigue una arquitectura limpia en 3 capas:

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

### Separación ORM / Dominio

Las entidades de dominio son **clases planas** sin decoradores. Los decoradores TypeORM (`@Entity`, `@Column`, `@ManyToMany`, etc.) viven en una clase espejo dentro de `infrastructure/persistence/*.orm-entity.ts`.

Los repositorios implementan un mapper (`toDomain` / `toOrm`) para convertir entre ambos mundos:

```
[Use Case] ←→ Tournament (domain)
                     ↑
              tournament.repository.ts
                     ↑
              toDomain() / toOrm()
                     ↑
              TournamentOrmEntity (infrastructure)
                     ↑
                   TypeORM / BD
```

---

## Árbol de Directorios

### Módulo Tournaments

```
src/modules/tournaments/
├── tournaments.module.ts                  ← Módulo NestJS (DI)
│
├── domain/
│   ├── entities/
│   │   └── tournament.entity.ts           ← Clase plana, sin ORM
│   ├── interfaces/
│   │   └── tournament-repository.interface.ts  ← Puerto del repositorio
│   └── value-objects/
│       ├── base.vo.ts                     ← Clase base abstracta
│       ├── name.vo.ts                     ← VO: nombre no vacío
│       └── match-date.vo.ts              ← VO: fecha válida
│
├── application/
│   ├── dto/
│   │   └── tournament.dto.ts             ← DTO creación/actualización
│   ├── services/
│   │   └── tournaments.service.ts        ← Fachada (facade)
│   └── use-cases/
│       ├── create-tournament.use-case.ts
│       ├── find-tournaments.use-case.ts
│       ├── find-by-id-tournament.use-case.ts
│       ├── update-tournament.use-case.ts
│       ├── delete-tournament.use-case.ts
│       ├── add-team-tournament.use-case.ts
│       └── remove-team-from-tournament.use-case.ts
│
└── infrastructure/
    ├── http/
    │   └── tournaments.controller.ts     ← Controlador REST
    └── persistence/
        ├── tournament.orm-entity.ts      ← Entidad TypeORM con decoradores
        └── tournament.repository.ts      ← Implementación + mapper
```

### Módulo Teams

```
src/modules/teams/
├── teams.module.ts
├── domain/
│   ├── entities/
│   │   └── teams.entity.ts               ← Clase plana
│   └── interfaces/
│       └── team-repository.interface.ts   ← Puerto
├── application/
│   ├── dto/
│   │   └── team.dto.ts
│   ├── services/
│   │   └── teams.service.ts
│   └── use-cases/
│       ├── create-team.use-case.ts
│       ├── find-teams.use-case.ts
│       ├── find-by-id-team.use-case.ts
│       ├── update-team.use-case.ts
│       └── delete-team.use-case.ts
└── infrastructure/
    ├── http/
    │   └── teams.controller.ts
    └── persistence/
        ├── team.orm-entity.ts            ← Entidad TypeORM con decoradores
        └── team.repository.ts            ← Implementación + mapper
```

### Módulo Users

```
src/modules/users/
├── users.module.ts
├── domain/
│   ├── entities/
│   │   └── user.entity.ts                ← Clase plana
│   ├── interfaces/
│   │   └── user.repository.interface.ts  ← Puerto
│   └── value-objects/
│       ├── base.vo.ts                    ← Clase base abstracta
│       ├── email.vo.ts                   ← VO: formato email
│       └── password.vo.ts               ← VO: mínimo 6 caracteres
├── application/
│   ├── dto/
│   │   ├── auth-user.dto.ts
│   │   ├── login.dto.ts
│   │   └── create-user.dto.ts
│   ├── services/
│   │   └── user.service.ts
│   └── use-cases/
│       ├── register-user.use-case.ts
│       └── login-user.use-case.ts
├── infrastructure/
│   ├── http/
│   │   └── users.controller.ts
│   └── persistence/
│       ├── user.orm-entity.ts            ← Entidad TypeORM con decoradores
│       └── user.repository.ts            ← Implementación + mapper
└── strategies/
    └── jwt.strategy.ts
```

---

## Desglose por Capas

### 1. Domain

Capa más interna. Contiene la lógica de negocio pura. No importa NestJS, TypeORM ni otras capas.

#### Entidades (clases planas, sin decoradores)

| Módulo | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Tournaments | `tournament.entity.ts` | Agregado `Tournament`. Factory `create()`. `teamIds: number[]` como identificadores planos. |
| Teams | `teams.entity.ts` | Agregado `Team`. Factory `create()`. Sin relaciones. |
| Users | `user.entity.ts` | Agregado `User`. Factory `create()`. |

#### Value Objects

| Módulo | Archivo | Clase | Validación |
|--------|---------|-------|------------|
| Tournaments | `base.vo.ts` | `ValueObject<T>` | Base abstracta genérica |
| Tournaments | `name.vo.ts` | `Name` | String no vacío |
| Tournaments | `match-date.vo.ts` | `MatchDate` | Date válido + formateo |
| Users | `base.vo.ts` | `ValueObject<T>` | Base abstracta genérica |
| Users | `email.vo.ts` | `Email` | Formato regex email |
| Users | `password.vo.ts` | `Password` | Mínimo 6 caracteres |

#### Interfaces de Repositorio (Puertos)

| Módulo | Interfaz | Métodos |
|--------|----------|---------|
| Tournaments | `ITournamentRepository` | `find`, `create`, `findById`, `findByName`, `update`, `delete`, `addTeamToTournament`, `removeTeamFromTournament` |
| Teams | `ITeamRepository` | `find`, `create`, `findById`, `findByName`, `update`, `delete` |
| Users | `IUserRepository` | `create`, `findByEmail`, `findById` |

**Reglas:**
- ✅ Define tipos, interfaces y VOs con validación de negocio.
- ✅ Crea instancias de entidades con factory methods.
- ✅ Lanza excepciones de dominio (`InvalidNameError`, `InvalidEmailError`, etc.).
- ❌ NO importa NestJS, TypeORM ni frameworks externos.
- ❌ NO tiene lógica de infraestructura (HTTP, BD).

---

### 2. Application

Capa de orquestación. Coordina los casos de uso del sistema. Depende de Domain.

#### DTOs

| Módulo | Archivo | Responsabilidad |
|--------|---------|-----------------|
| Tournaments | `tournament.dto.ts` | Crear/actualizar torneo. Validación con `class-validator`. |
| Teams | `team.dto.ts` | Crear/actualizar equipo. Solo `name`. |
| Users | `auth-user.dto.ts` | Registro de usuario. |
| Users | `login.dto.ts` | Login (email + password). |
| Users | `create-user.dto.ts` | DTO alternativo para crear usuario. |

#### Casos de Uso (Use Cases)

Cada uno encapsula **una** operación. Patrón: único método `execute()`.

**Tournaments:**

| Archivo | `execute()` | Responsabilidad |
|---------|-------------|-----------------|
| `create-tournament.use-case.ts` | `(dto)` | Valida con VOs, verifica duplicado, crea y persiste. |
| `find-tournaments.use-case.ts` | `()` | Lista todos. |
| `find-by-id-tournament.use-case.ts` | `(id)` | Busca por ID. |
| `update-tournament.use-case.ts` | `(id, dto)` | Valida con VOs, pasa objeto parcial al repo. |
| `delete-tournament.use-case.ts` | `(id)` | Elimina. |
| `add-team-tournament.use-case.ts` | `(tournamentId, teamId)` | Agrega equipo. |
| `remove-team-from-tournament.use-case.ts` | `(tournamentId, teamId)` | Remueve equipo. |

**Teams:**

| Archivo | `execute()` | Responsabilidad |
|---------|-------------|-----------------|
| `create-team.use-case.ts` | `(dto)` | Verifica duplicado, crea. |
| `find-teams.use-case.ts` | `()` | Lista todos. |
| `find-by-id-team.use-case.ts` | `(id)` | Busca por ID. |
| `update-team.use-case.ts` | `(id, dto)` | Actualiza. |
| `delete-team.use-case.ts` | `(id)` | Elimina. |

**Users:**

| Archivo | `execute()` | Responsabilidad |
|---------|-------------|-----------------|
| `register-user.use-case.ts` | `(dto)` | Valida VOs, hashea password, crea, omite password en respuesta. |
| `login-user.use-case.ts` | `(dto)` | Valida credenciales, genera JWT. |

#### Services (Facade)

| Archivo | Responsabilidad |
|---------|----------------|
| `tournaments.service.ts` | Inyecta 7 Use Cases y delega. |
| `teams.service.ts` | Inyecta 5 Use Cases y delega. |
| `user.service.ts` | Inyecta 2 Use Cases y delega. |

**Reglas:**
- ✅ Usa DTOs y VOs para validar entrada.
- ✅ Orquesta múltiples operaciones.
- ✅ Lanza excepciones HTTP (`ConflictException`, `NotFoundException`, `UnauthorizedException`).
- ❌ NO tiene lógica de negocio pura.
- ❌ NO depende de infraestructura.

---

### 3. Infrastructure

Capa externa. Conecta la aplicación con HTTP y BD. Depende de Domain y Application.

#### HTTP — Controladores REST

**Tournaments** (`@UseGuards(JwtAuthGuard)`):

| Método | Ruta | Acción |
|--------|------|--------|
| `POST` | `/tournaments` | Crear torneo |
| `GET` | `/tournaments` | Listar todos |
| `GET` | `/tournaments/:id` | Obtener por ID |
| `PATCH` | `/tournaments/:id` | Actualizar |
| `DELETE` | `/tournaments/:id` | Eliminar |
| `POST` | `/tournaments/:id/teams` | Agregar equipo al torneo |
| `DELETE` | `/tournaments/:id/teams/:teamId` | Remover equipo del torneo |

**Teams** (`@UseGuards(JwtAuthGuard)`):

| Método | Ruta | Acción |
|--------|------|--------|
| `POST` | `/teams` | Crear equipo |
| `GET` | `/teams` | Listar todos |
| `GET` | `/teams/:id` | Obtener por ID |
| `PATCH` | `/teams/:id` | Actualizar |
| `DELETE` | `/teams/:id` | Eliminar |

**Users** (sin guard):

| Método | Ruta | Acción |
|--------|------|--------|
| `POST` | `/users/register` | Registrar usuario |
| `POST` | `/users/login` | Login (retorna JWT) |

#### Persistencia — ORM Entities + Repositorios

Cada módulo tiene:
- `*.orm-entity.ts` — Clase TypeORM con todos los decoradores (tabla, columnas, relaciones)
- `*.repository.ts` — Implementa la interfaz del dominio, usa el ORM entity internamente, mapea con `toDomain()` / `toOrm()`

**Reglas:**
- ✅ Usa decoradores NestJS/TypeORM.
- ✅ Implementa interfaces definidas en Domain.
- ✅ Hace consultas a la BD y mapea resultados.
- ❌ NO contiene reglas de negocio.
- ❌ NO es importado por Domain o Application (solo a través de la interfaz).

---

### 4. Module (NestJS)

| Archivo | Responsabilidad |
|---------|----------------|
| `tournaments.module.ts` | Registra `TournamentOrmEntity` + `TeamOrmEntity` en TypeORM, todos los providers (Service, 7 Use Cases, Repository con string token `'ITournamentRepository'`). |
| `teams.module.ts` | Registra `TeamOrmEntity`, providers (Service, 5 Use Cases, Repository con token `'ITeamRepository'`). |
| `users.module.ts` | Registra `UserOrmEntity`, providers + JwtModule + PassportModule + JwtStrategy. Exporta `UsersService` y `PassportModule`. |

---

## Flujo de Comunicación entre Capas

### Diagrama General (Tournaments)

```
[Cliente HTTP]
      │
      ▼
┌──────────────────────────────────────────┐
│  tournaments.controller.ts               │  ← INFRASTRUCTURE (HTTP)
│  Recibe request, extrae params/DTO       │
└──────────┬───────────────────────────────┘
           │ inyecta
           ▼
┌──────────────────────────────────────────┐
│  tournaments.service.ts                  │  ← APPLICATION (Facade)
│  Delega en el Use Case adecuado          │
└──────────┬───────────────────────────────┘
           │ inyecta
           ▼
┌──────────────────────────────────────────┐
│  create-tournament.use-case.ts           │  ← APPLICATION (Use Case)
│  Valida con VOs, orquesta lógica         │
└──────────┬───────────────────────────────┘
           │ inyecta (vía interfaz)
           ▼
┌──────────────────────────────────────────┐
│  ITournamentRepository (interface)       │  ← DOMAIN (Puerto)
└──────────┬───────────────────────────────┘
           │ implementa
           ▼
┌──────────────────────────────────────────┐
│  tournament.repository.ts                │  ← INFRASTRUCTURE (Persistencia)
│  toDomain() / toOrm()                    │
│  ┌──────────────────────────────────┐    │
│  │  TournamentOrmEntity             │    │  ← INFRASTRUCTURE (ORM)
│  │  (con decoradores TypeORM)      │    │
│  └──────────────────────────────────┘    │
│              ↕                           │
│           TypeORM / BD                   │
└──────────────────────────────────────────┘
```

### Ejemplo Concreto: Crear Torneo

```
POST /tournaments
Body: { "name": "Torneo A", "state": "TO_COME", "configuration": {...}, "startDate": "2026-01-01" }
```

1. **Controller** recibe request, `ValidationPipe` valida el DTO, llama a `tournamentService.create(dto)`.
2. **Service** delega en `createTournamentUseCase.execute(dto)`.
3. **Use Case**:
   - Crea `Name` VO → valida que no esté vacío.
   - Crea `MatchDate` VO → valida que la fecha sea válida.
   - Llama a `tournamentRepo.findByName(name)` → verifica duplicado.
   - Si existe, lanza `ConflictException`.
   - Crea entidad dominio con `Tournament.create(...)`.
   - Persiste con `tournamentRepo.create(tournament)`.
4. **Repository**:
   - `toOrm(domain)` → convierte a `TournamentOrmEntity`.
   - `save(orm)` → TypeORM persiste en PostgreSQL.
   - `toDomain(saved)` → convierte resultado a dominio.
5. Respuesta: Repository → Use Case → Service → Controller → Cliente.

---

## Convenciones del Proyecto

| Aspecto | Convención |
|---------|------------|
| Entidad de dominio | Clase plana sin decoradores, método estático `create()`, `id?: number` |
| ORM entity | Clase en `infrastructure/persistence/*.orm-entity.ts` con decoradores TypeORM |
| Repositorio | Implementa interfaz del dominio, mapper `toDomain()` / `toOrm()` interno |
| Value Objects | Extienden `ValueObject<T>`, `readonly value`, validación en constructor, excepciones propias |
| Interfaces de repositorio | Prefijo `I` (ej. `ITournamentRepository`), definidas en domain |
| Binding de repositorio | String token (`'ITournamentRepository'`) con `useClass` en el módulo |
| Use Cases | Clase `@Injectable()` con único método `execute()` |
| Service | Fachada que inyecta use cases y delega |
| DTOs | Clases con decoradores `class-validator` |
| Controladores | `@UseGuards(JwtAuthGuard)` en rutas protegidas |
| Errores de dominio | Clases que extienden `Error` con `this.name = 'XxxError'` |
| Excepciones HTTP | NestJS nativas (`NotFoundException`, `ConflictException`, `UnauthorizedException`) |
| Naming archivos | `kebab-case` con sufijo: `.use-case.ts`, `.vo.ts`, `.dto.ts`, `.entity.ts`, `.orm-entity.ts` |
| Imports | Relativos dentro del módulo, absolutos solo para otros módulos (`src/...`) |
| Orden de imports | 1) Librerías externas, 2) Módulos del proyecto, 3) Relativos del módulo |

---

## Catálogo de Componentes

### Módulo Tournaments (16 archivos activos)

#### Domain (5 archivos)

| # | Ruta | Responsabilidad |
|---|------|-----------------|
| 1 | `domain/value-objects/base.vo.ts` | Clase base abstracta `ValueObject<T>` |
| 2 | `domain/value-objects/name.vo.ts` | `Name` — string no vacío |
| 3 | `domain/value-objects/match-date.vo.ts` | `MatchDate` — Date válido + formateo |
| 4 | `domain/entities/tournament.entity.ts` | `Tournament` — clase plana, `teamIds: number[]` |
| 5 | `domain/interfaces/tournament-repository.interface.ts` | Puerto con 8 métodos |

#### Application (10 archivos)

| # | Ruta | Responsabilidad |
|---|------|-----------------|
| 6 | `application/dto/tournament.dto.ts` | DTO validado |
| 7 | `application/use-cases/create-tournament.use-case.ts` | Crear con VOs + anti-duplicado |
| 8 | `application/use-cases/find-tournaments.use-case.ts` | Listar |
| 9 | `application/use-cases/find-by-id-tournament.use-case.ts` | Buscar por ID |
| 10 | `application/use-cases/update-tournament.use-case.ts` | Actualizar con objeto parcial |
| 11 | `application/use-cases/delete-tournament.use-case.ts` | Eliminar |
| 12 | `application/use-cases/add-team-tournament.use-case.ts` | Agregar equipo |
| 13 | `application/use-cases/remove-team-from-tournament.use-case.ts` | Remover equipo |
| 14 | `application/services/tournaments.service.ts` | Fachada |

#### Infrastructure (3 archivos)

| # | Ruta | Responsabilidad |
|---|------|-----------------|
| 15 | `infrastructure/http/tournaments.controller.ts` | 7 endpoints RESTful JWT-guardados |
| 16 | `infrastructure/persistence/tournament.orm-entity.ts` | Entidad TypeORM con decoradores y relaciones |
| 17 | `infrastructure/persistence/tournament.repository.ts` | Implementación + mapper toDomain/toOrm |

#### Module (1 archivo)

| # | Ruta | Responsabilidad |
|---|------|-----------------|
| 18 | `tournaments.module.ts` | Ensamblaje DI |

---

## Dependencias Externas del Módulo Tournaments

| Módulo externo | Tipo de dependencia | Archivo que lo importa |
|----------------|---------------------|------------------------|
| `TeamOrmEntity` (teams infrastructure) | TypeORM forFeature + @ManyToMany | `tournaments.module.ts`, `tournament.orm-entity.ts`, `tournament.repository.ts` |
| `Phase` (phase domain) | @OneToMany | `tournament.orm-entity.ts` |
| `Standing` (standings domain) | @OneToMany | `tournament.orm-entity.ts` |
| `MatchesModule` | Import de módulo NestJS | `tournaments.module.ts` |
| `JwtAuthGuard` (common) | Guard de autenticación | `tournaments.controller.ts` |
