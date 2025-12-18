import { Injectable } from '@nestjs/common';
import { CreatePrintJobDto } from './dto/create-print-job.dto';
import { UpdatePrintJobDto } from './dto/update-print-job.dto';

@Injectable()
export class PrintJobService {
  create(createPrintJobDto: CreatePrintJobDto) {
    return 'This action adds a new printJob';
  }

  findAll() {
    return `This action returns all printJob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} printJob`;
  }

  update(id: number, updatePrintJobDto: UpdatePrintJobDto) {
    return `This action updates a #${id} printJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} printJob`;
  }
}
