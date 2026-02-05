import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const whitelist = [
      'https://app.print-ly.ink',
      'https://dev--printly-app.netlify.app',
      'http://localhost:5173',
      'http://localhost:8100',
    ];

    const netlifyRegex = /^https:\/\/.*--printly-app\.netlify\.app$/;

    if (!origin || whitelist.includes(origin) || netlifyRegex.test(origin)) {
      console.log('CORS was allowed to', origin);
      callback(null, true);
    } else {
      console.log('CORS was not allowed to', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
};
