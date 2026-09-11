# DERQ Assessment Submission - Guru Charan Gupta V B

A web application to represent road traffic data as interactive graphs.

## Requirements

- Node 24 or newer
- Docker (+ compose)
- curl and jq if you want to refetch the Eurostat snapshot

## Running everything

```bash
docker compose up -d --build
```

This command starts Postgres, seeds it with the data, and runs the API and the UI too.

## Running the API for development

```bash
docker compose up -d postgres
cd apps/api
npm install
npm run db:seed # creates the schema and loads the data
npm run start:dev
```

Current endpoints:

- Country traffic: http://localhost:3000/traffic/countries
- Vehicle type distribution: http://localhost:3000/traffic/vehicles
- Update an observation: `PUT` http://localhost:3000/traffic/observations/ES/CAR/2023 with `{ "value": 206577 }`
- Swagger UI: http://localhost:3000/docs
- openapi.json: http://localhost:3000/docs-json
- UI: http://localhost:3001

The UI reads the API server-side. It's default value is http://localhost:3000 (http://api:3000 in compose).

The UI's request types are generated from the API's openapi.json file. Regenerate them with:

```bash
cd apps/ui && npm run api:types
```

## The data

The data is from Eurostat's `road_tf_vehmov`(https://ec.europa.eu/eurostat/databrowser/view/road_tf_vehmov/default/table?lang=en), which measures distance travelled in million vehicle-kilometres rather than vehicle counts.

The data extract is committed at `apps/api/src/traffic/data/road-tf-vehmov.json`. To refetch it:

```bash
apps/api/src/scripts/fetch-snapshot.sh
```

## Architecture

```
Eurostat extract -> seed -> Postgres -> API -> UI loader -> charts
```

`apps/api` is NestJS on Node 24. `apps/ui` is react router 8 with SSR, tailwindcss and recharts with postgres sits behind the API.

Requests and responses are constrained by zod schemas. Each one gives the typescript type, validates the incoming body and path params, and becomes the OpenAPI entry generating the `openapi.json` file. The pre-commit hook regenerates it and the UI types are built from it automatically, so that the UI can consume it directly, easily. CI makes sure the committed copy doesn't go stale.

Eurostat is the data source, we use `fetch-snapshot.sh` to fetch the json, trim a slice of it, and then `traffic.data.ts` coverts it into rows, and `npm run db:seed` upserts those rows in our db. The data is committed so that a fresh clone can work without data fetching.

The UI loader runs on the server side, so the API calls run server to server. The edit form posts to an action and then the loader refetches, so the charts always show the database state

## Scalability

[docs/scalability.md](docs/scalability.md) covers 5, 50 and 500 RPS, with a baseline measured from `npm run load-test`.

## Checks

```bash
docker compose up -d
cd apps/api
npm run lint
npm run format:check
npm run build
npm test
```
