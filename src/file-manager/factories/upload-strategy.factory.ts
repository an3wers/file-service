import { FileDb } from "../models/file-db.model";
import { IFileRepository } from "../repository/repository.interfaces";
import { DBStrategy } from "../strategies/db.strategy";
import { LSStrategy } from "../strategies/ls.strategy";
import { S3Strategy } from "../strategies/s3.strategy";
import { IUploadStrategy } from "../strategies/strategy.interfaces";

export enum UploadStrategies {
  LOCAL = "local",
  S3 = "s3",
  DATABASE = "database",
}

export class UploadStrategyFactory {
  static createStrategy(
    type: UploadStrategies,
    fileDbRepository: IFileRepository<FileDb>
  ): IUploadStrategy {
    switch (type) {
      case UploadStrategies.LOCAL:
        return new LSStrategy();
      case UploadStrategies.S3:
        return new S3Strategy();
      case UploadStrategies.DATABASE:
        return new DBStrategy(fileDbRepository);
      default:
        throw new Error(`Unsupported upload strategy type: ${type}`);
    }
  }
}
