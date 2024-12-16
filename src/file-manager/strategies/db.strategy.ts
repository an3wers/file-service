import { IUploadStrategy } from "./strategy.interfaces";
import { v4 as uuidv4 } from "uuid";
import { IFileDbRepository } from "../repository/repository.interfaces";
import path from "path";
import { FileMeta } from "../models/file-meta.model";

export class DBStrategy implements IUploadStrategy {
  constructor(private fileRepository: IFileDbRepository) {}

  async upload(file: Express.Multer.File): Promise<FileMeta> {
    const createdFile = await this.fileRepository.create({
      id: "",
      uuid: uuidv4(),
      contents: file.buffer,
    });

    return new FileMeta({
      id: "",
      uuid: uuidv4(),
      name: file.originalname,
      extension: path.extname(file.originalname),
      size: file.size,
      path: "",
      fileId: createdFile.id,
    });
  }

  async download(fileMeta: FileMeta): Promise<{ contents: Buffer }> {
    const file = await this.fileRepository.findById(fileMeta.fileId);

    if (!file) {
      throw new Error("File not found");
    }

    return { contents: file.contents };
  }

  async delete(fileMeta: FileMeta): Promise<void> {
    await this.fileRepository.delete(fileMeta.fileId);
  }
}
