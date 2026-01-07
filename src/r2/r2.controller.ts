import { Body, Controller, Post } from '@nestjs/common';
import { DownloadFileBatchRequestDto } from './dto/download-file-batch-request.dto';
import { UploadFileBatchRequestDto } from './dto/upload-file-batch-request.dto';
import { R2Service } from './r2.service';

@Controller({ path: 'files', version: '1' })
export class R2Controller {
  constructor(private readonly r2Service: R2Service) {}

  @Post('upload')
  async requestUploadFiles(
    @Body()
    uploadFileBatchRequestDto: UploadFileBatchRequestDto,
  ) {
    return this.r2Service.createUploadURLs(uploadFileBatchRequestDto);
  }
  @Post('download')
  async requestDownloadFile(
    @Body() downloadFileBatchRequestDto: DownloadFileBatchRequestDto,
  ) {
    return this.r2Service.createDownloadURLs(downloadFileBatchRequestDto);
  }
}
