import { IUploadStrategy } from "./strategy.interfaces";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { config } from "../../config";
import fs from "fs";
import { writeFile, unlink, readFile } from "fs/promises";
import { FileMeta } from "../models/file-meta.model";

export class LSStrategy implements IUploadStrategy {
  async upload(file: Express.Multer.File): Promise<FileMeta> {
    const uuid = uuidv4();

    const fileName = file.originalname;
    const filePath = path.join(config.localStoragePath, uuid, fileName);

    await writeFile(filePath, file.buffer);

    // Сделать запрос в БД и записать
    // this.fileMetaRepository.create(uploadedFile)

    return new FileMeta({
      id: "",
      uuid,
      name: file.originalname,
      extension: path.extname(file.originalname),
      size: file.size,
      path: filePath,
      fileId: uuid,
    });
  }

  async download(fileMeta: FileMeta): Promise<Buffer> {
    const filePath = path.join(
      config.localStoragePath,
      fileMeta.fileId,
      fileMeta.name
    );

    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    return await readFile(filePath);
  }

  async delete(fileMeta: FileMeta): Promise<void> {
    const filePath = path.join(
      config.localStoragePath,
      fileMeta.fileId,
      fileMeta.name
    );
    await unlink(filePath);
  }
}
