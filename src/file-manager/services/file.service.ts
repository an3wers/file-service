import { UploadStrategies, UploadStrategyFactory } from "../factories/upload-strategy.factory";
import { FileModel } from "../models/file.model";
import { IFileRepository } from "../repository/repository.interfaces";
import { IUploadStrategy } from "../strategies/strategy.interfaces";

export class FileService {
  private uploadStrategy: IUploadStrategy;

  constructor(private fileRepository: IFileRepository, defaultStrategy: UploadStrategies) {
    this.uploadStrategy = UploadStrategyFactory.createStrategy(defaultStrategy, fileRepository);
  }

  setUploadStrategy(strategyType: UploadStrategies): void {
    this.uploadStrategy = UploadStrategyFactory.createStrategy(strategyType, this.fileRepository);
  }

  async upload(file: Express.Multer.File): Promise<FileModel> {
    const uploadedFile = await this.uploadStrategy.upload(file);
    return this.fileRepository.create(uploadedFile);
  }

  async download(uuid: string): Promise<Buffer> {
    const file = await this.fileRepository.findById(uuid);
    if (!file) {
      throw new Error("File not found");
    }

    return this.uploadStrategy.download(file.uuid, file.name);
  }

  async delete(uuid: string): Promise<void> {
    const file = await this.fileRepository.findById(uuid);
    if (!file) {
      throw new Error("File not found");
    }
    await this.uploadStrategy.delete(file.uuid, file.name);
    await this.fileRepository.delete(file.uuid);
  }
}
