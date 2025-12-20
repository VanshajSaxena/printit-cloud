import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { JobService } from './print-job.service';
import { CreateJobDto } from './dto/create-print-job.dto';
import { UpdateJobDto } from './dto/update-print-job.dto';

@Controller('print-job')
export class JobController {
  constructor(private readonly printJobService: JobService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.printJobService.create(createJobDto);
  }

  @Get()
  findAll() {
    return this.printJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.printJobService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.printJobService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.printJobService.remove(+id);
  }
}
