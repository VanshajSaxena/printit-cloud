import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { EntityManager, Repository } from 'typeorm';
import { CreateJobRequestDto } from './dto/create-job-request.dto';
import { CreateJobResponseDto } from './dto/create-job-response.dto';
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

  async createMany(
    createJobDtos: CreateJobRequestDto[],
    manager?: EntityManager,
  ): Promise<CreateJobResponseDto[]> {
    const repository = manager
      ? manager.getRepository(Job)
      : this.jobRepository;

    const documentIds = [
      ...new Set(createJobDtos.map((dto) => dto.documentId)),
    ];
    const documents = await this.documentService.findManyByIds(documentIds);

    const documentIdMap = new Map(
      documents.map((document) => [document.id, document]),
    );

    const jobEntities = createJobDtos.flatMap((dto) => {
      const document = documentIdMap.get(dto.documentId);

      return document
        ? [
            repository.create({
              document,
              copyCount: dto.copyCount,
              outputColor: dto.outputColor,
            }),
          ]
        : [];
    });

    const savedJobs = await repository.save(jobEntities);
    return plainToInstance(CreateJobResponseDto, savedJobs);
  }

  async create(createJobDto: CreateJobRequestDto) {
    const newJob = this.jobRepository.create(createJobDto);
    const saved = await this.jobRepository.save(newJob);
    return plainToInstance(CreateJobResponseDto, saved);
  }

  async findAll() {
    const jobs = await this.jobRepository.find();
    return plainToInstance(CreateJobResponseDto, jobs);
  }

  async findOne(id: number) {
    const job = await this.findOneEntity(id);
    return plainToInstance(CreateJobResponseDto, job);
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    const job = await this.findOneEntity(id);
    Object.assign(job, updateJobDto);
    const saved = await this.jobRepository.save(job);
    return plainToInstance(CreateJobResponseDto, saved);
  }

  async remove(id: number) {
    const entityNeedRemoval = await this.findOneEntity(id);
    const removed = await this.jobRepository.softRemove(entityNeedRemoval);
    return plainToInstance(CreateJobResponseDto, removed);
  }

  private async findOneEntity(id: number) {
    const job = await this.jobRepository.findOneBy({ id });
    if (!job) {
      throw new NotFoundException(`Document not found for the id: ${id}`);
    }
    return job;
  }
}
