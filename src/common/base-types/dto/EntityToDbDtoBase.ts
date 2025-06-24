import { BaseEntity } from '../entity/BaseEntity';

export class EntityToDbDtoBase {
  id: string;
  updated: number;
  created: number;
  constructor(data: BaseEntity) {
    this.id = data.id;
    this.updated = data.updated?.getTime() ?? Date.now();
    this.created = data.created?.getTime() ?? Date.now();
  }
}
