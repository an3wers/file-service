import {
  UploadStrategies,
  UploadStrategyFactory,
} from "../factories/upload-strategy.factory";
import { FileMeta } from "../models/file-meta.model";
import {
  IFileDbRepository,
  IFileMetaRepository,
} from "../repository/repository.interfaces";
import { IUploadStrategy } from "../strategies/strategy.interfaces";

export class FileService {
  private uploadStrategy: IUploadStrategy;

  constructor(
    defaultStrategy: UploadStrategies,
    private fileDbRepository: IFileDbRepository,
    private fileMetaRepository: IFileMetaRepository
  ) {
    this.uploadStrategy = UploadStrategyFactory.createStrategy(
      defaultStrategy,
      fileDbRepository
    );
  }

  setUploadStrategy(strategyType: UploadStrategies): void {
    this.uploadStrategy = UploadStrategyFactory.createStrategy(
      strategyType,
      this.fileDbRepository
    );
  }

  async upload(file: Express.Multer.File): Promise<FileMeta> {
    const uploadedFile = await this.uploadStrategy.upload(file);
    return this.fileMetaRepository.create(uploadedFile);
  }

  async download(id: string): Promise<FileMeta & { contents: Buffer | null }> {
    const file = await this.fileMetaRepository.findById(id);

    if (!file) {
      throw new Error("File not found");
    }

    const downloadedFile = await this.uploadStrategy.download(file);

    return { ...file, contents: downloadedFile?.contents ?? null };
  }

  async delete(id: string): Promise<void> {
    const file = await this.fileMetaRepository.findById(id);

    if (!file) {
      throw new Error("File not found");
    }

    await this.uploadStrategy.delete(file);
    await this.fileMetaRepository.delete(file.id);
  }
}
