import { z } from 'zod';
import type { SchemaObject } from '@nestjs/swagger';

import { COUNTRY_CODES, VEHICLE_CODES } from './traffic.data.js';

const meta = z.strictObject({
  year: z.number().int(),
  unitCode: z.string(),
  unitLabel: z.string(),
});

export const CountryTrafficResponseSchema = z
  .strictObject({
    data: z.array(
      z.strictObject({
        countryCode: z.string(),
        countryName: z.string(),
        value: z.number(),
      }),
    ),
    meta,
  })
  .meta({ id: 'CountryTrafficResponse' });

export const VehicleTrafficResponseSchema = z
  .strictObject({
    data: z.array(
      z.strictObject({
        vehicleCode: z.string(),
        vehicleName: z.string(),
        value: z.number(),
      }),
    ),
    meta,
  })
  .meta({ id: 'VehicleTrafficResponse' });

export const ObservationKeySchema = z.strictObject({
  countryCode: z.enum(COUNTRY_CODES as [string, ...string[]]),
  vehicleCode: z.enum(VEHICLE_CODES as [string, ...string[]]),
  year: z.coerce.number().int().min(1990).max(2100),
});

export const UpdateObservationSchema = z.strictObject({
  value: z.number().nonnegative(),
});

const { $schema: _$schema, ...updateObservationJsonSchema } = z.toJSONSchema(
  UpdateObservationSchema,
);

export const UpdateObservationBodySchema =
  updateObservationJsonSchema as SchemaObject;

export const ObservationSchema = z
  .strictObject({
    countryCode: z.string(),
    vehicleCode: z.string(),
    year: z.number().int(),
    value: z.number(),
  })
  .meta({ id: 'Observation' });

export type CountryTrafficResponse = z.output<
  typeof CountryTrafficResponseSchema
>;

export type VehicleTrafficResponse = z.output<
  typeof VehicleTrafficResponseSchema
>;

export type ObservationKey = z.output<typeof ObservationKeySchema>;
export type UpdateObservation = z.output<typeof UpdateObservationSchema>;
export type Observation = z.output<typeof ObservationSchema>;
