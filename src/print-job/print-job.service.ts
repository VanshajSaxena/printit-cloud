import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-print-job.dto';
import { JobResponseDto } from './dto/print-job-response.dto';
import { UpdateJobDto } from './dto/update-print-job.dto';
import { Job } from './entities/print-job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private printJobRepository: Repository<Job>,
  ) {}
  async create(createJobDto: CreateJobDto) {
    const newJob = this.printJobRepository.create(createJobDto);
    const saved = await this.printJobRepository.save(newJob);
    return plainToInstance(JobResponseDto, saved);
  }

  async findAll() {
    const printJobs = await this.printJobRepository.find();
    return plainToInstance(JobResponseDto, printJobs);
  }

  async findOne(id: number) {
    const printJob = await this.findOneEntity(id);
    return plainToInstance(JobResponseDto, printJob);
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const printJob = await this.findOneEntity(id);
    Object.assign(printJob, updateJobDto);
    const saved = await this.printJobRepository.save(printJob);
    return plainToInstance(JobResponseDto, saved);
  }

  async remove(id: number) {
    const entityNeedRemoval = await this.findOneEntity(id);
    const removed = await this.printJobRepository.softRemove(entityNeedRemoval);
    return plainToInstance(JobResponseDto, removed);
  }

  private async findOneEntity(id: number) {
    const printJob = await this.printJobRepository.findOneBy({ id });
    if (!printJob) {
      throw new NotFoundException(`Document not found for the id: ${id}`);
    }
    return printJob;
  }
}
