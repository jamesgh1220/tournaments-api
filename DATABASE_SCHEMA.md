# Esquema de la Base de Datos

Este documento describe la estructura de la base de datos basada en las entidades TypeORM definidas en el proyecto.

---

## Tablas y sus Relaciones

### 1. `users` (Entidad: `User`)
Representa a los usuarios del sistema.
-   **Campos:**
    -   `id`: `PrimaryGeneratedColumn` (número) - Clave primaria.
    -   `name`: `Column` (cadena, longitud: 100)
    -   `email`: `Column` (cadena, único: true)
    -   `password`: `Column` (cadena)
    -   `role`: `Column` (cadena) - 'team' | 'admin'
    -   `createdAt`: `CreateDateColumn` (Fecha)
    -   `updatedAt`: `UpdateDateColumn` (Fecha)
-   **Relaciones:** Ninguna explícitamente definida en esta entidad.

### 2. `tournaments` (Entidad: `Tournament`)
Representa los torneos organizados.
-   **Campos:**
    -   `id`: `PrimaryGeneratedColumn` (número) - Clave primaria.
    -   `name`: `Column` (cadena, longitud: 100)
    -   `state`: `Column` (cadena, longitud: 100, predeterminado: 'TO_COME')
    -   `configuration`: `Column` (jsonb)
    -   `quantity_teams`: `Column` (número)
    -   `qualified_teams`: `Column` (número)
    -   `createdAt`: `CreateDateColumn` (Fecha)
    -   `updatedAt`: `UpdateDateColumn` (Fecha)
-   **Relaciones:**
    -   `teams`: `ManyToMany` con `Team` (a través de la tabla de unión `tournaments_teams`). Un torneo puede tener muchos equipos y un equipo puede participar en muchos torneos.
    -   `phases`: `OneToMany` con `Phase`. Un torneo puede tener muchas fases.
    -   `standings`: `OneToMany` con `Standing`. Un torneo puede tener muchas clasificaciones.

### 3. `teams` (Entidad: `Team`)
Representa a los equipos que participan en los torneos.
-   **Campos:**
    -   `id`: `PrimaryGeneratedColumn` (número) - Clave primaria.
    -   `name`: `Column` (cadena, longitud: 100)
-   **Relaciones:**
    -   `tournaments`: `ManyToMany` con `Tournament`. Un equipo puede participar en muchos torneos.
    -   `groups`: `ManyToMany` con `Group`. Un equipo puede pertenecer a muchos grupos (en diferentes fases/torneos).
    -   `homeMatches`: `OneToMany` con `Match` (como equipo local).
    -   `awayMatches`: `OneToMany` con `Match` (como equipo visitante).
    -   `standings`: `OneToMany` con `Standing`. Un equipo puede tener muchas clasificaciones.

### 4. `phases` (Entidad: `Phase`)
Representa las distintas fases de un torneo (ej. Fase de Grupos, Eliminatorias).
-   **Campos:**
    -   `id`: `PrimaryGeneratedColumn` (número) - Clave primaria.
    -   `name`: `Column` (cadena, longitud: 100)
    -   `status`: `Column` (cadena, longitud: 100, predeterminado: 'PENDING')
    -   `order_number`: `Column` (número)
-   **Relaciones:**
    -   `tournament`: `ManyToOne` con `Tournament`. Una fase pertenece a un torneo.
    -   `type`: `ManyToOne` con `PhaseType`. Una fase tiene un tipo específico.
    -   `groups`: `OneToMany` con `Group`. Una fase puede tener muchos grupos.
    -   `matches`: `OneToMany` con `Match`. Una fase puede tener muchos partidos.
    -   `standings`: `OneToMany` con `Standing`. Una fase puede tener muchas clasificaciones.

### 5. `phase_type` (Entidad: `PhaseType`)
Define los tipos de fase posibles (ej. "Grupos", "Eliminatoria Directa").
-   **Campos:**
    -   `id`: `PrimaryGeneratedColumn` (número) - Clave primaria.
    -   `name`: `Column` (cadena)
-   **Relaciones:**
    -   `phases`: `OneToMany` con `Phase`. Un tipo de fase puede tener muchas fases.

### 6. `groups` (Entidad: `Group`)
Representa un grupo dentro de una fase (ej. Grupo A, Grupo B).
-   **Campos:**
    -   `id`: `PrimaryGeneratedColumn` (número) - Clave primaria.
    -   `name`: `Column` (cadena)
    -   `createdAt`: `CreateDateColumn` (Fecha)
    -   `updatedAt`: `UpdateDateColumn` (Fecha)
-   **Relaciones:**
    -   `phase`: `ManyToOne` con `Phase`. Un grupo pertenece a una fase.
    -   `teams`: `ManyToMany` con `Team` (a través de la tabla de unión `group_teams`). Un grupo puede tener muchos equipos y un equipo puede pertenecer a muchos grupos.
    -   `matches`: `OneToMany` con `Match`. Un grupo puede tener muchos partidos.
    -   `standings`: `OneToMany` con `Standing`. Un grupo puede tener muchas clasificaciones.

### 7. `matches` (Entidad: `Match`)
Representa un partido entre dos equipos.
-   **Campos:**
    -   `id`: `PrimaryGeneratedColumn` (número) - Clave primaria.
    -   `homeScore`: `Column` (número)
    -   `awayScore`: `Column` (número)
    -   `status`: `Column` (cadena, predeterminado: 'PENDING')
    -   `scheduledAt`: `Column` (fecha)
    -   `createdAt`: `CreateDateColumn` (Fecha)
    -   `updatedAt`: `UpdateDateColumn` (Fecha)
-   **Relaciones:**
    -   `phase`: `ManyToOne` con `Phase`. Un partido pertenece a una fase.
    -   `group`: `ManyToOne` con `Group` ({ nullable: true }). Un partido puede pertenecer a un grupo (opcional).
    -   `homeTeam`: `ManyToOne` con `Team` (mediante `homeTeamId`). El equipo local del partido.
    -   `awayTeam`: `ManyToOne` con `Team` (mediante `awayTeamId`). El equipo visitante del partido.

### 8. `standings` (Entidad: `Standing`)
Representa la posición de un equipo en una fase o grupo.
-   **Campos:**
    -   `id`: `PrimaryGeneratedColumn` (número) - Clave primaria.
    -   `played`: `Column` (número) - Partidos jugados.
    -   `wins`: `Column` (número) - Partidos ganados.
    -   `draws`: `Column` (número) - Partidos empatados.
    -   `losses`: `Column` (número) - Partidos perdidos.
    -   `goalsFor`: `Column` (número) - Goles a favor.
    -   `goalsAgainst`: `Column` (número) - Goles en contra.
    -   `points`: `Column` (número) - Puntos.
-   **Relaciones:**
    -   `tournament`: `ManyToOne` con `Tournament`. Esta clasificación pertenece a un torneo.
    -   `phase`: `ManyToOne` con `Phase`. Esta clasificación pertenece a una fase.
    -   `group`: `ManyToOne` con `Group` ({ nullable: true }). Esta clasificación puede pertenecer a un grupo (opcional).
    -   `team`: `ManyToOne` con `Team`. Esta clasificación es de un equipo.

---

## Diagrama de Relaciones (Conceptos Clave)

-   Un **`Tournament`** contiene muchas **`Phases`**.
-   Cada **`Phase`** pertenece a un **`Tournament`** y tiene un **`PhaseType`**.
-   Una **`Phase`** puede tener muchos **`Groups`** y muchos **`Matches`**.
-   Un **`Group`** pertenece a una **`Phase`**.
-   Un **`Match`** pertenece a una **`Phase`** y opcionalmente a un **`Group`**.
-   Un **`Match`** involucra dos **`Teams`**: un `homeTeam` y un `awayTeam`.
-   Un **`Tournament`** puede tener muchos **`Teams`**, y un **`Team`** puede participar en muchos **`Tournaments`** (`ManyToMany`).
-   Un **`Group`** puede tener muchos **`Teams`**, y un **`Team`** puede pertenecer a muchos **`Groups`** (`ManyToMany`).
-   Las **`Standings`** registran el rendimiento de un **`Team`** dentro de un **`Tournament`**, **`Phase`**, y opcionalmente un **`Group`**.
-   Un **`Group`** puede tener muchos **`Teams`**, y un **`Team`** puede pertenecer a muchos **`Groups`** (`ManyToMany`).
-   Las **`Standings`** registran el rendimiento de un **`Team`** dentro de un **`Tournament`**, **`Phase`**, y opcionalmente un **`Group`**.
-   Los **`Users`** son una entidad independiente que no está directamente relacionada con la estructura de torneos/equipos/partidos en las entidades analizadas.

---

## Explicaciones Detalladas de Relaciones Clave

### Relación de `Standing` (OneToMany/ManyToOne)

La entidad `Standing` es fundamental para registrar el rendimiento específico de un equipo en un contexto determinado. Aunque un `Standing` individual (ej. `standing.entity.ts`) tiene relaciones `ManyToOne` con `Tournament`, `Phase`, `Group` (opcional) y `Team`, las entidades `Tournament`, `Phase`, `Group` y `Team` tienen una relación `OneToMany` recíproca con `Standing`.

**¿Por qué es útil esta configuración?**

Esto permite una gran flexibilidad para almacenar diferentes tipos de clasificaciones o el historial de rendimiento:

-   **`Tournament` -> `Standings` (OneToMany):** Un torneo puede tener varias clasificaciones a lo largo del tiempo (ej. una clasificación final, o clasificaciones por cada fase que se quieran guardar por separado para el histórico).
    -   **Ejemplo:** `Torneo "Copa Mundial 2026"` tiene una `Clasificación General Final` y también una `Clasificación Fase de Grupos`.
-   **`Phase` -> `Standings` (OneToMany):** Cada fase de un torneo tendrá su propia tabla de clasificación.
    -   **Ejemplo:** La `Fase "Grupos"` del `Torneo "Copa Mundial 2026"` genera una `Clasificación` específica para esa fase.
-   **`Group` -> `Standings` (OneToMany):** Dentro de una fase de grupos, cada grupo necesita su propia clasificación.
    -   **Ejemplo:** El `Grupo "A"` dentro de la `Fase "Grupos"` tiene su `Clasificación` particular que detalla los puntos de los equipos solo en ese grupo.
-   **`Team` -> `Standings` (OneToMany):** Un equipo puede aparecer en múltiples clasificaciones (ej. en diferentes grupos, fases o torneos a lo largo del tiempo).
    -   **Ejemplo:** El `Equipo "Argentina"` tendrá una `Clasificación` en el `Grupo "A"`, otra si avanza a `Octavos de Final`, y otra para el `Torneo` completo.

Esta estructura permite consultar fácilmente la clasificación de un equipo en cualquier nivel (grupo, fase, torneo) o el rendimiento general de una fase/grupo.

### Relación de `Group` y `Team` (ManyToMany)

La relación `ManyToMany` entre `Group` y `Team` (utilizando la tabla de unión `group_teams`) es esencial para modelar situaciones donde:

-   Un **`Group`** contiene varios **`Teams`**.
-   Un **`Team`** puede ser asignado a varios **`Groups`** a lo largo de la vida de un torneo o en diferentes torneos.

**¿Por qué es útil esta configuración?**

-   **Flexibilidad en la asignación:** Un equipo puede estar en el "Grupo A" en la primera fase y luego, si avanza, en un nuevo "Grupo de Eliminatorias" en otra fase (aunque en este esquema las eliminatorias suelen ser partidos directos, la flexibilidad se mantiene para otros formatos). O, más comúnmente, si la aplicación gestionara múltiples torneos, un equipo podría pertenecer a grupos en torneos completamente distintos.
-   **Historial y composición de grupos:** Permite rastrear qué equipos han estado en qué grupos a lo largo del tiempo.

    -   **Ejemplo:**
        -   El `Grupo "A"` de la `Fase "Grupos"` incluye: `Equipo "Alpha"`, `Equipo "Beta"`, `Equipo "Gamma"`.
        -   El `Grupo "B"` de la `Fase "Grupos"` incluye: `Equipo "Delta"`, `Equipo "Epsilon"`, `Equipo "Zeta"`.
        -   El `Equipo "Alpha"` está asociado solo al `Grupo "A"` en este contexto. Si el mismo equipo `Equipo "Alpha"` participara en un segundo torneo con una estructura de grupos similar, también tendría una entrada en la tabla `group_teams` para ese segundo torneo.
        -   La tabla `group_teams` gestiona estas asociaciones, permitiendo que un equipo tenga múltiples "membresías" a grupos sin duplicar los datos de los equipos o los grupos.

