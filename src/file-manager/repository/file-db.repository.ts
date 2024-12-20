import { Pool } from "pg";
import { IFileDbRepository, IFileRepository } from "./repository.interfaces";
import { FileDb } from "../models/file-db.model";
import { config } from "../../config";

export class FileDbRepository implements IFileRepository<FileDb> {
  private pool: Pool;

  constructor() {
    this.pool = new Pool(config.database);
  }

  async create(file: FileDb): Promise<FileDb> {
    const query = `
      INSERT INTO files (uuid, contents)
      VALUES ($1, $2)
      RETURNING id, uuid, contents
    `;
    const values = [file.uuid, file.contents];
    const result = await this.pool.query(query, values);
    return new FileDb(result.rows[0]);
  }

  async findById(id: string): Promise<FileDb | null> {
    const query = "SELECT * FROM files WHERE id = $1";
    const result = await this.pool.query(query, [id]);
    return result.rows[0] ? new FileDb(result.rows[0]) : null;
  }

  async delete(id: string): Promise<void> {
    const query = "DELETE FROM files WHERE id = $1";
    await this.pool.query(query, [id]);
  }
}
