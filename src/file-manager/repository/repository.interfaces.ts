import { FileDb } from "../models/file-db.model";
import { FileMeta } from "../models/file-meta.model";

export interface IFileDbRepository {
  create(file: FileDb): Promise<FileDb>;
  findById(id: string): Promise<FileDb | null>;
  delete(id: string): Promise<void>;
}

export interface IFileMetaRepository {
  create(file: FileMeta): Promise<FileMeta>;
  findById(id: string): Promise<FileMeta | null>;
  delete(id: string): Promise<void>;
}

export interface IFileRepository<M> {
  create(file: M): Promise<M>;
  findById(id: string): Promise<M | null>;
  delete(id: string): Promise<void>;
}
