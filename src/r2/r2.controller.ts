import { Body, Controller, Get, Post } from '@nestjs/common';
import { R2Service } from './r2.service';
import { UploadFileRequestDto } from './dto/upload-file-request.dto';
import { DownloadFileRequestDto } from './dto/download-file-request.dto';

@Controller({ path: 'files', version: '1' })
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Post()
  async requestUploadFile(@Body() uploadFileRequestDto: UploadFileRequestDto) {
    return this.r2Service.createUploadURL(uploadFileRequestDto);
  }
  @Get()
  async requestDownloadFile(@Body() { key }: DownloadFileRequestDto) {
    return this.r2Service.createDownloadURL(key);
  }
}
