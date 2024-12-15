import { FileModel } from "../models/file.model";
import { IFileRepository } from "../repository/repository.interfaces";
import { IUploadStrategy } from "./strategy.interfaces";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export class DBStrategy implements IUploadStrategy {
  constructor(private fileRepository: IFileRepository) {}

  async upload(file: Express.Multer.File): Promise<FileModel> {
    const newFile = new FileModel({
      uuid: uuidv4(),
      name: file.originalname,
      extension: path.extname(file.originalname),
      size: file.size,
      path: "",
      contents: file.buffer,
    });

    await this.fileRepository.create(newFile);

    return newFile;
  }

  async download(fileId: string): Promise<Buffer> {
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new Error("File not found");
    }
    return file.contents!;
  }

  async delete(fileId: string): Promise<void> {
    await this.fileRepository.delete(fileId);
  }
}
