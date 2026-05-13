import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Redirect,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';

@Controller({ path: 'download', version: '1' })
export class DownloadController {
  private readonly BASE_URL = 'https://updates.printit.ink/stable';

  @Get()
  @Redirect()
  @Public()
  download(@Headers('user-agent') userAgent?: string) {
    if (!userAgent) {
      throw new BadRequestException('Missing user-agent header');
    }

    const ua = userAgent.toLowerCase();

    let arch: 'x64' | 'ia32' = 'x64';

    if (
      ua.includes('wow32') ||
      ua.includes('win32') ||
      ua.includes('i386') ||
      ua.includes('i686') ||
      ua.includes('x86')
    ) {
      arch = 'ia32';
    }

    const binaryName = `Printit-latest-win-${arch}.exe`;

    const downloadUrl = `${this.BASE_URL}/${binaryName}`;

    return {
      url: downloadUrl,
      statusCode: 302,
    };
  }
}
