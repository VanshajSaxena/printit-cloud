import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentService } from 'src/document/document.service';
import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
import { DownloadFileResponseDto } from './dto/download-file-response.dto';
import { UploadFileBatchRequestDto } from './dto/upload-file-batch-request.dto';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { UploadFileBatchResponseDto } from './dto/upload-file-batch-response.dto';

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

  async createUploadURLs(uploadFileBatchRequestDto: UploadFileBatchRequestDto) {
    const metadata = uploadFileBatchRequestDto.files;
    const documentBatch = metadata.map(({ filename, contentType }) => {
      const cleanedFilename = filename
        .trim()
        .toLowerCase()
        .normalize()
        .replaceAll(' ', '-')
        .replaceAll('/', '-');
      const keyArr = [this.env, cleanedFilename];
      const key = keyArr.join('/');
      return new CreateDocumentDto({ filename, key, contentType });
    });
    const documents = await this.documentService.createMany(documentBatch);

    const signedUrls = await Promise.all(
      documents.map(async ({ key, id, contentType }) => {
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          ContentType: contentType,
          Metadata: {
            id: id.toString(),
          },
        });
        const url = await getSignedUrl(this.s3, command);
        return new UploadFileResponseDto({ url, id });
      }),
    );
    return new UploadFileBatchResponseDto({
      signedUrls: signedUrls,
    });
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
