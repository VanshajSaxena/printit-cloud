import { Body, Controller, Get, Post } from '@nestjs/common';
import { R2Service } from './r2.service';
import { UploadFileDto } from './dto/request-upload-file.dto';
import { DownloadFileDto } from './dto/request-download-file.dto';

@Controller({ path: 'files', version: '1' })
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Post()
  async requestUploadFile(@Body() { filename }: UploadFileDto) {
    return this.r2Service.createUploadURL(filename);
  }
  @Get()
  async requestDownloadFile(@Body() { key }: DownloadFileDto) {
    return this.r2Service.createDownloadURL(key);
  }
}
