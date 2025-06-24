export class EntityFromDbDtoBase {
  id: string;
  created: Date;
  updated: Date;
  constructor(data) {
    this.id = data.id;
    this.created = new Date(data.created);
    this.updated = new Date(data.updated);
  }
}
