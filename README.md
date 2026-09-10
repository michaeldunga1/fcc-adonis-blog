# Canopy Journal

Companion repository for the Free Computer Courses AdonisJS blog course.
Each numbered folder is a complete runnable snapshot (Express + Edge + Knex + Bootstrap + sessions + Postgres).

| Snapshot | Focus |
|---|---|
| `01-Getting-Started` | Hello JSON |
| `02-Routing` | Controllers + routes |
| `03-Layout-And-UI` | Edge + Bootstrap |
| `04-Data-Layer` | Knex + Postgres |
| `05-Feed-And-Detail` | Feed and detail |
| `06-Registration` | Registration + bcrypt |
| `07-Login-And-Sessions` | Session auth |
| `08-Profiles-And-Media` | Profiles and uploads |
| `09-Posts-CRUD-And-Ownership` | Owned CRUD |
| `10-Pagination-And-Search` | Page size 5 + search |
| `11-Password-Reset` | Reset tokens |
| `12-Deploy` | Railway |

## Quick start

```bash
docker compose up -d
cd 07-Login-And-Sessions
npm install
cp .env.example .env
node ace serve --watch
```

Seeds (stages 04+): `ada@example.com` / `grace@example.com` / `password123`.
App port: 3002. Postgres host port: 5440 with databases `canopy_01`–`canopy_12`.
