import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    const whitelist = [
      'https://app.printit.ink', // production pwa site
      'https://printit.ink', // production site
      'http://localhost:5173', // electron frontend
    ];

    const isDevelopment =
      process.env.NODE_ENV !== 'production' &&
      process.env.RAILWAY_ENVIRONMENT_NAME !== 'production';

    if (!origin || isDevelopment || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
