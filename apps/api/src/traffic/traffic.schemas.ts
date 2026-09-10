import { z } from 'zod';

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

export type CountryTrafficResponse = z.output<
  typeof CountryTrafficResponseSchema
>;

export type VehicleTrafficResponse = z.output<
  typeof VehicleTrafficResponseSchema
>;
