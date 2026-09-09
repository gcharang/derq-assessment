import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CountryTrafficResponseSchema } from './traffic.schemas.js';
import type { CountryTrafficResponse } from './traffic.schemas.js';

@ApiTags('traffic')
@Controller('traffic')
export class TrafficController {
  @Get('countries')
  @ApiOperation({ summary: 'Total road traffic per country' })
  @ApiOkResponse({
    description: 'Total traffic distance per country',
    standardSchema: CountryTrafficResponseSchema,
  })
  getCountryTraffic(): CountryTrafficResponse {
    return {
      data: [
        { countryCode: 'ES', countryName: 'Spain', value: 260299 },
        { countryCode: 'CH', countryName: 'Switzerland', value: 66430 },
      ],
    };
  }
}
