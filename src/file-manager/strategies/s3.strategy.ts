import { S3 } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { config } from "../../config";
import { IUploadStrategy } from "./strategy.interfaces";
import { FileModel } from "../models/file.model";
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

  async upload(file: Express.Multer.File): Promise<FileModel> {
    const uuid = uuidv4();
    const key = `${uuid}-${file.originalname}`;

    await this.s3
      .upload({
        Bucket: config.s3.bucket,
        Key: key,
        Body: file.buffer,
      })
      .promise();

    return new FileModel({
      uuid,
      name: file.originalname,
      extension: path.extname(file.originalname),
      size: file.size,
      path: key,
      contents: null,
    });
  }

  async download(uuid: string, name: string): Promise<Buffer> {
    const key = `${uuid}-${name}`;
    const result = await this.s3
      .getObject({
        Bucket: config.s3.bucket,
        Key: key,
      })
      .promise();

    return result.Body as Buffer;
  }

  async delete(uuid: string, name: string): Promise<void> {
    const key = `${uuid}-${name}`;

    await this.s3
      .deleteObject({
        Bucket: config.s3.bucket,
        Key: key,
      })
      .promise();
  }
}
