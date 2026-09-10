import snapshot from './data/road-tf-vehmov.json' with { type: 'json' };

const UNIT_CODE = 'MIO_VKM';

export const TOTAL_VEHICLE_CODE = 'TOTAL';

export type CountryCode = keyof typeof snapshot.dimension.geo.category.label;
export type VehicleCode =
  keyof typeof snapshot.dimension.vehicle.category.label;

export interface TrafficObservation {
  countryCode: CountryCode;
  vehicleCode: VehicleCode;
  year: number;
  value: number;
}

export const COUNTRY_NAMES: Record<CountryCode, string> =
  snapshot.dimension.geo.category.label;

export const COUNTRY_CODES = Object.keys(COUNTRY_NAMES) as CountryCode[];

export const VEHICLE_NAMES: Record<VehicleCode, string> =
  snapshot.dimension.vehicle.category.label;

export const UNIT = {
  code: UNIT_CODE,
  label: snapshot.dimension.unit.category.label[UNIT_CODE],
};

const stride = (axis: string) =>
  snapshot.size
    .slice(snapshot.id.indexOf(axis) + 1)
    .reduce((product, length) => product * length, 1);

const values = snapshot.value as Record<string, number | undefined>;

function readObservations(): TrafficObservation[] {
  const [geoStride, vehicleStride, timeStride] = [
    stride('geo'),
    stride('vehicle'),
    stride('time'),
  ];
  const observations: TrafficObservation[] = [];

  for (const [geo, geoIndex] of Object.entries(
    snapshot.dimension.geo.category.index,
  )) {
    for (const [vehicle, vehicleIndex] of Object.entries(
      snapshot.dimension.vehicle.category.index,
    )) {
      for (const [time, timeIndex] of Object.entries(
        snapshot.dimension.time.category.index,
      )) {
        const value =
          values[
            geoIndex * geoStride +
              vehicleIndex * vehicleStride +
              timeIndex * timeStride
          ];

        if (value !== undefined) {
          observations.push({
            countryCode: geo as CountryCode,
            vehicleCode: vehicle as VehicleCode,
            year: Number(time),
            value,
          });
        }
      }
    }
  }

  return observations;
}

export const TRAFFIC_OBSERVATIONS: readonly Readonly<TrafficObservation>[] =
  readObservations();
