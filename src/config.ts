export const config = {
  port: process.env.PORT ?? 3000,
  database: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT) ?? 5432,
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "password",
    database: process.env.DB_NAME ?? "fileservice",
  },
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    region: process.env.S3_REGION ?? "",
    bucket: process.env.S3_BUCKET ?? "",
  },
  localStoragePath: process.env.LOCAL_STORAGE_PATH ?? "./uploads",
  defaultUploadStrategy:
    (process.env.DEFAULT_UPLOAD_STRATEGY as UploadStrategyType) ?? UploadStrategyType.LOCAL,
};
