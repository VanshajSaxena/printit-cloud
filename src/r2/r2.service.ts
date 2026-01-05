import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentService } from 'src/document/document.service';
import { DownloadFileResponseDto } from './dto/download-file-response.dto';
import { UploadFileBatchRequestDto } from './dto/upload-file-batch-request.dto';
import { UploadFileBatchResponseDto } from './dto/upload-file-batch-response.dto';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { DownloadFileBatchRequestDto } from './dto/download-file-batch-request.dto';
import { DownloadFileBatchResponseDto } from './dto/download-file-batch-response.dto';

@Injectable()
export class R2Service {
  private readonly s3: S3Client;
  private readonly bucketName: string;

  constructor(
    private readonly config: ConfigService,
    private readonly documentService: DocumentService,
  ) {
    this.bucketName = config.getOrThrow('R2_BUCKET_NAME');
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: this.config.getOrThrow<string>('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
    });
  }

  async createUploadURLs({ ids }: UploadFileBatchRequestDto) {
    const documents = await this.documentService.findByIds({ ids });

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
        const url = await getSignedUrl(this.s3, command, { expiresIn: 60 * 5 });
        return new UploadFileResponseDto({ url, id });
      }),
    );
    return new UploadFileBatchResponseDto({
      signedUrls: signedUrls,
    });
  }

  async createDownloadURLs({ ids }: DownloadFileBatchRequestDto) {
    const documents = await this.documentService.getEntitites(ids, {
      select: { key: true },
    });

    const signedUrls = await Promise.all(
      documents.map(async ({ key, id }) => {
        const command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
        const url = await getSignedUrl(this.s3, command);
        return new DownloadFileResponseDto({ url, id });
      }),
    );
    return new DownloadFileBatchResponseDto({ signedUrls });
  }
}
