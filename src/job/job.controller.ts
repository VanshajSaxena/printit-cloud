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
import { JobService } from './job.service';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller({ path: 'jobs', version: '1' })
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@Body() createJobDto: CreateJobRequestDto) {
    return this.jobService.create(createJobDto);
  }

  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobService.update(id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.remove(id);
  }
}
