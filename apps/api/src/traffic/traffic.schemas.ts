import { z } from 'zod';

export const CountryTrafficResponseSchema = z
  .object({
    data: z.array(
      z.object({
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
