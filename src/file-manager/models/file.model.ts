export class FileModel {
  id?: string;
  uuid: string;
  name: string;
  extension: string;
  size: number;
  path: string;
  contents: Buffer | null;

  constructor(data: FileModel) {
    this.id = data.id;
    this.uuid = data.uuid;
    this.name = data.name;
    this.extension = data.extension;
    this.size = data.size;
    this.path = data.path;
    this.contents = data.contents;
  }
}
