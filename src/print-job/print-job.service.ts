import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreatePrintJobDto } from './dto/create-print-job.dto';
import { PrintJobResponseDto } from './dto/print-job-response.dto';
import { UpdatePrintJobDto } from './dto/update-print-job.dto';
import { PrintJob } from './entities/print-job.entity';

@Injectable()
export class PrintJobService {
  constructor(
    @InjectRepository(PrintJob)
    private printJobRepository: Repository<PrintJob>,
  ) {}
  async create(createPrintJobDto: CreatePrintJobDto) {
    const newPrintJob = this.printJobRepository.create(createPrintJobDto);
    const saved = await this.printJobRepository.save(newPrintJob);
    return plainToInstance(PrintJobResponseDto, saved);
  }

  async findAll() {
    const printJobs = await this.printJobRepository.find();
    return plainToInstance(PrintJobResponseDto, printJobs);
  }

  async findOne(id: number) {
    const printJob = await this.findOneEntity(id);
    return plainToInstance(PrintJobResponseDto, printJob);
  }

  async update(id: number, updatePrintJobDto: UpdatePrintJobDto) {
    const printJob = await this.findOneEntity(id);
    Object.assign(printJob, updatePrintJobDto);
    const saved = await this.printJobRepository.save(printJob);
    return plainToInstance(PrintJobResponseDto, saved);
  }

  async remove(id: number) {
    const entityNeedRemoval = await this.findOneEntity(id);
    const removed = await this.printJobRepository.softRemove(entityNeedRemoval);
    return plainToInstance(PrintJobResponseDto, removed);
  }

  private async findOneEntity(id: number) {
    const printJob = await this.printJobRepository.findOneBy({ id });
    if (!printJob) {
      throw new NotFoundException(`Document not found for the id: ${id}`);
    }
    return printJob;
  }
}
