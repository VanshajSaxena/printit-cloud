import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { DownloadFileResponseDto } from './dto/download-file-response.dto';
import { UploadFileRequestDto } from './dto/upload-file-request.dto';
import { DocumentService } from 'src/document/document.service';

@Injectable()
export class R2Service {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly env: string;

  constructor(
    private readonly config: ConfigService,
    private readonly documentService: DocumentService,
  ) {
    this.bucketName = config.getOrThrow('R2_BUCKET_NAME');
    this.env = config.getOrThrow('NODE_ENV');
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: this.config.getOrThrow<string>('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
    });
  }

  async createUploadURL({ filename, contentType }: UploadFileRequestDto) {
    const keyArr = [
      this.env,
      filename.trim().normalize().replaceAll(' ', '-').replaceAll('/', '-'),
    ];
    const key = keyArr.join('/');
    this.documentService.create({ key, name: filename, contentType });
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(this.s3, command);
    return new UploadFileResponseDto({ url, key });
  }

  async createDownloadURL(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const url = await getSignedUrl(this.s3, command);
    return new DownloadFileResponseDto({ url });
  }
}
