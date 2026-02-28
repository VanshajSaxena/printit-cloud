import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
// NOTE: these options will differ in production
export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const whitelist = [
      'https://printit.ink',
      'https://dev--printit-ink.netlify.app',
      'http://localhost:5173',
      'http://localhost:8100',
      'http://192.168.1.8:8100',
      'https://192.168.1.8:8100',
    ];

    const netlifyRegex = /^https:\/\/.*--printit-ink\.netlify\.app$/;

    if (!origin || whitelist.includes(origin) || netlifyRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
