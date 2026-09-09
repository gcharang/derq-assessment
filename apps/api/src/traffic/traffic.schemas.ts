import { z } from 'zod';

export const CountryTrafficResponseSchema = z
  .strictObject({
    data: z.array(
      z.strictObject({
        countryCode: z.string(),
        countryName: z.string(),
        value: z.number(),
      }),
    ),
  })
  .meta({ id: 'CountryTrafficResponse' });

export type CountryTrafficResponse = z.output<
  typeof CountryTrafficResponseSchema
>;
