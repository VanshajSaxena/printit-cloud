import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AnonUserService } from './anon-user.service';

import { Public } from 'src/decorators/public.decorator';
import { AnonUserIdentifyDto } from './dto/anon-user-identify.dto';

@Controller({ path: 'anon-users', version: '1' })
export class AnonUserController {
  constructor(private readonly anonUserService: AnonUserService) {}

  @Public()
  @Post('identify')
  @HttpCode(HttpStatus.NO_CONTENT)
  upsert(
    @Body()
    body: AnonUserIdentifyDto,
  ) {
    return this.anonUserService.upsertAnonUser(body);
  }
}
