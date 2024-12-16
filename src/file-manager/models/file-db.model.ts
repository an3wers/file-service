export class FileDb {
  id: string;
  uuid: string;
  contents: Buffer;

  constructor(data: FileDb) {
    this.id = data.id;
    this.uuid = data.uuid;
    this.contents = data.contents;
  }
}