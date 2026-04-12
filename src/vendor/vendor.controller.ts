import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiParam } from '@nestjs/swagger';
import { NotFoundErrorDto } from 'src/common/dto/error-response.dto';
import {
  CurrentUser,
  Public,
  type RequestUser,
} from 'src/decorators/public.decorator';
import { PresenceService } from 'src/presence/presence.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { NearbyQueryDto } from './dto/vendor-nearby.dto';
import { VendorPresenceDto } from './dto/vendor-presence.dto';
import { VendorService } from './vendor.service';

@Controller({ path: 'vendors', version: '1' })
export class VendorController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly presenceService: PresenceService,
  ) {}

  @Post()
  async create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  async findAll() {
    return this.vendorService.findAll();
  }

  @Get('/me')
  async getVendorProfile(@CurrentUser() user: RequestUser) {
    return this.vendorService.getVendorProfile(user);
  }

  @Public()
  @Get('/nearby')
  async findNearby(@Query() nearbyQueryDto: NearbyQueryDto) {
    return this.vendorService.findNearby(nearbyQueryDto);
  }

  @Public()
  @Get(':selector')
  @ApiParam({
    name: 'selector',
    description: 'The unique identifier',
    examples: {
      id: { summary: 'Internal ID', value: 999 },
      username: { summary: 'Username', value: '@username' },
    },
    schema: {
      oneOf: [
        { type: 'string', description: 'Username' },
        { type: 'integer', description: 'Internal Database ID' },
      ],
    },
  })
  @ApiNotFoundResponse({ type: NotFoundErrorDto })
  async findOne(@Param('selector') selector: string) {
    return this.vendorService.findOne(selector);
  }

  @Public()
  @Get(':selector/presence')
  @ApiParam({
    name: 'selector',
    description: 'The unique identifier',
    examples: {
      id: { summary: 'Internal ID', value: 999 },
      username: { summary: 'Username', value: '@username' },
    },
    schema: {
      oneOf: [
        { type: 'string', description: 'Username' },
        { type: 'integer', description: 'Internal Database ID' },
      ],
    },
  })
  vendorPresent(@Param('selector') selector: string): VendorPresenceDto {
    return this.presenceService.getStatus(selector);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.remove(id);
  }
}
