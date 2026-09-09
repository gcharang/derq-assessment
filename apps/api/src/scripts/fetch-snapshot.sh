#!/usr/bin/env bash

set -euo pipefail
cd "$(dirname "$0")/../traffic/data"

geo=(EE ES HU RO SE CH)
years=({2014..2023})

args=(--data-urlencode format=JSON --data-urlencode lang=EN
      --data-urlencode regisveh=TERNAT_REG --data-urlencode unit=MIO_VKM)
for g in "${geo[@]}"; do args+=(--data-urlencode "geo=$g"); done
for y in "${years[@]}"; do args+=(--data-urlencode "time=$y"); done

curl -sSf -G 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/road_tf_vehmov' "${args[@]}" | jq -c '{updated,id,size,dimension: .dimension | map_values({category: {index: .category.index, label: .category.label}}),value,}' > road-tf-vehmov.json

jq -r '[.id, .size] | transpose | map(join("=")) | join(" ")' road-tf-vehmov.json
