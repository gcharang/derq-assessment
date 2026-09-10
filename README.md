# DERQ Assessment Submission - Guru Charan Gupta V B

A web application to represent road traffic data as interactive graphs.

## Requirements

- Node 24 or newer
- Docker (+ compose)
- curl and jq if you want to refetch the Eurostat snapshot

## Running the API

```bash
docker compose up -d
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

## The data

The data is from Eurostat's `road_tf_vehmov`(https://ec.europa.eu/eurostat/databrowser/view/road_tf_vehmov/default/table?lang=en), which measures distance travelled in million vehicle-kilometres rather than vehicle counts.

The data extract is committed at `apps/api/src/traffic/data/road-tf-vehmov.json`. To refetch it:

```bash
apps/api/src/scripts/fetch-snapshot.sh
```

## Checks

```bash
docker compose up -d
cd apps/api
npm run lint
npm run format:check
npm run build
npm test
```
