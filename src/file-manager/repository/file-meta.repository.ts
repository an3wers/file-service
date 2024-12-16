import { Pool } from "pg";
import { IFileMetaRepository } from "./repository.interfaces";
import { FileMeta } from "../models/file-meta.model";
import { config } from "../../config";

export class FileMetaRepository implements IFileMetaRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(config.database);
  }

  async create(file: Omit<FileMeta, "id">): Promise<FileMeta> {
    const query = `
      INSERT INTO files (uuid, name, extension, size, path, fileId)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, uuid, name, extension, size, path, fileId
    `;
    const values = [
      file.uuid,
      file.name,
      file.extension,
      file.size,
      file.path,
      file.fileId,
    ];
    const result = await this.pool.query(query, values);
    return new FileMeta(result.rows[0]);
  }

  async findById(id: string): Promise<FileMeta | null> {
    const query = "SELECT * FROM files WHERE id = $1";
    const result = await this.pool.query(query, [id]);
    return result.rows[0] ? new FileMeta(result.rows[0]) : null;
  }

  async delete(id: string): Promise<void> {
    const query = "DELETE FROM files WHERE id = $1";
    await this.pool.query(query, [id]);
  }
}
