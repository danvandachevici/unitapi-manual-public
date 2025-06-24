import { Expose } from 'class-transformer';
import { EntityFromDbDtoBase } from '../dto/EntityFromDbDtoBase';
import { CreationBaseDto } from '../dto/CreationBaseDto';
import { IdService, IdType_donotuse } from '@common/services/id.service';

export abstract class BaseEntity {
  @Expose()
  id: IdType_donotuse;

  @Expose()
  updated: Date;

  @Expose()
  created: Date;

  constructor(data?: CreationBaseDto | EntityFromDbDtoBase) {
    if (data instanceof EntityFromDbDtoBase) {
      this.id = IdService.getIdFromString(data.id);
      this.created = new Date(data.created);
      this.updated = new Date(data.updated);
      return;
    }
    if (data instanceof CreationBaseDto) {
      this.id = IdService.getId(this.constructor.name);
      this.created = new Date();
      this.updated = new Date();
      return;
    }
  }
}
