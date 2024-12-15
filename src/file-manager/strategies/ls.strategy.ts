import { IUploadStrategy } from "./strategy.interfaces";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { config } from "../../config";
import fs from "fs/promises";
import { FileModel } from "../models/file.model";

export class LSStrategy implements IUploadStrategy {
  async upload(file: Express.Multer.File): Promise<FileModel> {
    const uuid = uuidv4();
    const fileName = file.originalname;
    const filePath = path.join(config.localStoragePath, uuid, fileName);

    await fs.writeFile(filePath, file.buffer);

    return new FileModel({
      uuid,
      name: file.originalname,
      extension: path.extname(file.originalname),
      size: file.size,
      path: filePath,
      contents: null,
    });
  }

  async download(uuid: string, name: string): Promise<Buffer> {
    const filePath = path.join(config.localStoragePath, uuid, name);
    return fs.readFile(filePath);
  }

  async delete(uuid: string, name: string): Promise<void> {
    const filePath = path.join(config.localStoragePath, uuid, name);
    await fs.unlink(filePath);
  }
}
