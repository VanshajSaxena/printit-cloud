import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { DocumentService } from 'src/document/document.service';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private documentService: DocumentService,
  ) {}

  async createMany(createJobDto: CreateJobDto[]) {
    const jobs = await Promise.all(
      createJobDto.map(async ({ copyCount, documentId, outputColor }) => {
        const document = await this.documentService.getEntityOne(documentId);
        return this.jobRepository.create({ document, copyCount, outputColor });
      }),
    );

    const newJobs = this.jobRepository.create(jobs);
    const savedJobs = await this.jobRepository.save(newJobs);
    return plainToInstance(JobResponseDto, savedJobs);
  }

  async create(createJobDto: CreateJobDto) {
    const newJob = this.jobRepository.create(createJobDto);
    const saved = await this.jobRepository.save(newJob);
    return plainToInstance(JobResponseDto, saved);
  }

  async findAll() {
    const jobs = await this.jobRepository.find();
    return plainToInstance(JobResponseDto, jobs);
  }

  async findOne(id: number) {
    const job = await this.findOneEntity(id);
    return plainToInstance(JobResponseDto, job);
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const job = await this.findOneEntity(id);
    Object.assign(job, updateJobDto);
    const saved = await this.jobRepository.save(job);
    return plainToInstance(JobResponseDto, saved);
  }

  async remove(id: number) {
    const entityNeedRemoval = await this.findOneEntity(id);
    const removed = await this.jobRepository.softRemove(entityNeedRemoval);
    return plainToInstance(JobResponseDto, removed);
  }

  private async findOneEntity(id: number) {
    const job = await this.jobRepository.findOneBy({ id });
    if (!job) {
      throw new NotFoundException(`Document not found for the id: ${id}`);
    }
    return job;
  }
}
