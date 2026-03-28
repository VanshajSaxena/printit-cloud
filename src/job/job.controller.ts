import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { UpdateJobStatusDto } from './dto/update-job-status.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobService } from './job.service';

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

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobStatusDto: UpdateJobStatusDto,
  ) {
    return this.jobService.updateStatus(id, updateJobStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.remove(id);
  }
}
