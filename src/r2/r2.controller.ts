import { Body, Controller, Get, Post } from '@nestjs/common';
import { DownloadFileRequestDto } from './dto/download-file-request.dto';
import { UploadFileBatchRequestDto } from './dto/upload-file-batch-request.dto';
import { R2Service } from './r2.service';

@Controller({ path: 'files', version: '1' })
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Post()
  async requestUploadFiles(
    @Body()
    uploadFileRequestBatchDto: UploadFileBatchRequestDto,
  ) {
    return this.r2Service.createUploadURLs(uploadFileRequestBatchDto);
  }
  @Get()
  async requestDownloadFile(@Body() { key }: DownloadFileRequestDto) {
    return this.r2Service.createDownloadURL(key);
  }
}
