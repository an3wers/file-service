import { Pool } from "pg";
import { IFileRepository } from "./repository.interfaces";
import { FileModel } from "../models/file.model";
import { config } from "../../config";

export class PostgresFileRepository implements IFileRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(config.database);
  }

  async create(file: FileModel): Promise<FileModel> {
    const query = `
      INSERT INTO files (uuid, name, extension, size, path, contents)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, uuid, name, extension, size, path
    `;
    const values = [file.uuid, file.name, file.extension, file.size, file.path];
    const result = await this.pool.query(query, values);
    return new FileModel(result.rows[0]);
  }

  async findById(uuid: string): Promise<FileModel | null> {
    const query = "SELECT * FROM files WHERE uuid = $1";
    const result = await this.pool.query(query, [uuid]);
    return result.rows[0] ? new FileModel(result.rows[0]) : null;
  }

  async delete(uuid: string): Promise<void> {
    const query = "DELETE FROM files WHERE uuid = $1";
    await this.pool.query(query, [uuid]);
  }
}
