# Scaling from 5 to 50 to 500 RPS

A single API instance already serves around 3,000 RPS of the country endpoint on my local machine, six times the 500 RPS target. None of the three RPS requirements needs an architectural change.

This is because the `traffic_observation` entity has just 300 rows and the GET requests implemented return identical small responses everytime. The proper scaling improvement to an API like this would be caching/cdn.

## Load test results

Ran with the command: `npm run load-test -- <url> <concurrency> <seconds>` against the API, Postgres and the load generator all on one 12-core Xeon W-2133 / 30 GB host. On a real server, these numbers would be better as there won't be a request generator competing with the API/db for cores

### Observations

| Concurrency | RPS   | p50 ms | p95 ms | p99 ms | Errors |
| ----------- | ----- | ------ | ------ | ------ | ------ |
| 1           | 970   | 0.94   | 1.48   | 2.44   | 0      |
| 10          | 2,296 | 3.41   | 10.59  | 17.96  | 0      |
| 50          | 3,085 | 14.97  | 26.23  | 37.08  | 0      |

For `/traffic/vehicles`, it reaches 2,159 RPS at concurrency 50 with a p99 of 62 ms.

In a real production scenario where the db has millions of rows and each request might give a different response:

## 5 RPS

This is less than 0.2% of measured capacity, and one process with the default connection pool serves it with a p99 under 3 ms.

## 50 RPS

This is still under 2% of measured capacity, but some optimizations can be done to make it better.

We can index the query the endpoint will actually run. The primary key is `(country_code, vehicle_code, year)`. The country endpoint filters on `year` and `vehicle_code`, leaving that index's leading column unconstrained, so the planner reads every row instead.

The primary key index is valid here, but with no constraint on `country_code`, it has to scan the whole index, making it inefficient on large databases.

In addition, can add `Cache-Control` and `ETag` to let browsers and proxies skip the origin.

## 500 RPS

The measured capacity is 3,085 RPS, so a single instance covers this with roughly six times headroom. At this expected rate, optimizations can be done to increase burst tolerance.

- Run several instances behind a load balancer (replace `synchronize: true` with migrations first)
- Other techniques that might be helpful for scaling in real scenarios: read replicas, sharding/partitioning, message queue etc
