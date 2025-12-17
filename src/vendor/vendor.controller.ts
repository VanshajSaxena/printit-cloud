import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller({ path: 'vendors', version: '1' })
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  async create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  async findAll() {
    return this.vendorService.findAll();
  }

  @Get(':selector')
  @ApiParam({
    name: 'selector',
    description: 'The unique identifier',
    examples: {
      id: { summary: 'Internal ID', value: 999 },
      slug: { summary: 'Slug', value: 'xi28b2sg8d' },
      username: { summary: 'Username', value: '@username' },
    },
    schema: {
      oneOf: [
        { type: 'string', description: 'Slug or Username' },
        { type: 'integer', description: 'Internal Database ID' },
      ],
    },
  })
  async findOne(@Param('selector') selector: string) {
    if (selector.startsWith('@')) {
      return this.vendorService.findOneByUsername(selector.substring(1));
    }
    if (/^\d+$/.test(selector)) {
      return this.vendorService.findOneById(Number(selector));
    }
    return this.vendorService.findOneBySlug(selector);
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
