import { FileMeta } from "../models/file-meta.model";

export interface IUploadStrategy {
  upload(file: Express.Multer.File): Promise<FileMeta>;
  download(fileMeta: FileMeta): Promise<Buffer>;
  // getFiles(uuid: string[]): Promise<FileMeta[]>;
  delete(fileMeta: FileMeta): Promise<void>;
}
