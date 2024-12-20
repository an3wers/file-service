import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { config } from "../../config";
import { IUploadStrategy } from "./strategy.interfaces";
import { FileMeta } from "../models/file-meta.model";
import path from "path";

export class S3Strategy implements IUploadStrategy {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
      region: config.s3.region,
    });
  }

  async upload(file: Express.Multer.File): Promise<FileMeta> {
    const uuid = uuidv4();
    const key = `${uuid}-${file.originalname}`;

    const response = await this.s3
      .upload({
        Bucket: config.s3.bucket,
        Key: key,
        Body: file.buffer,
      })
      .promise();

    return new FileMeta({
      id: "",
      uuid,
      name: file.originalname,
      extension: path.extname(file.originalname),
      size: file.size,
      path: response.Location,
      fileId: uuid,
    });
  }

  async download(fileMeta: FileMeta): Promise<void> {
    const key = `${fileMeta.fileId}-${fileMeta.name}`; // Можно использовать только uuid
    const result = await this.s3
      .getObject({
        Bucket: config.s3.bucket,
        Key: key,
      })
      .promise();

    if (!result.Body) {
      throw new Error("File not found");
    }

    return;
  }

  async delete(fileMeta: FileMeta): Promise<void> {
    const key = `${fileMeta.fileId}-${fileMeta.name}`;

    await this.s3
      .deleteObject({
        Bucket: config.s3.bucket,
        Key: key,
      })
      .promise();
  }
}
