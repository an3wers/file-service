import { FileModel } from "../models/file.model";

export interface IUploadStrategy {
  upload(file: Express.Multer.File): Promise<FileModel>;
  download(uuid: string, name?: string): Promise<Buffer>;
  delete(uuid: string, name?: string): Promise<void>;
}
