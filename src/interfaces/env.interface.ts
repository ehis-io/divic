export interface ENV {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  SSL_ENABLED: string;
  JWT_SECRET: string;
}
