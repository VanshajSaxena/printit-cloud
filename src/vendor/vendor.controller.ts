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

  @Get(':friendlyId')
  async findOne(@Param('friendlyId') friendlyId: string) {
    return this.vendorService.findOne(friendlyId);
  }

  @Get('internal/:id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.findOneById(id);
  }

  @Patch('internal/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Delete('internal/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.vendorService.remove(id);
  }
}
