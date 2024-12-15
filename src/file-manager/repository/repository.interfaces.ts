import { FileModel } from "../models/file.model";

export interface IFileRepository {
  create(file: FileModel): Promise<FileModel>;
  findById(uuid: string): Promise<FileModel | null>;
  delete(uuid: string): Promise<void>;
}
