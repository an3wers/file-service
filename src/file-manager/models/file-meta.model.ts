export class FileMeta {
  id: string;
  uuid: string;
  name: string;
  extension: string;
  size: number;
  path: string;
  fileId: string;

  constructor(data: FileMeta) {
    this.id = data.id;
    this.uuid = data.uuid;
    this.name = data.name;
    this.extension = data.extension;
    this.size = data.size;
    this.path = data.path;
    this.fileId = data.fileId;
  }
}
