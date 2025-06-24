import { BaseEntity } from '@common/base-types/entity/BaseEntity';
import { Id_of } from '@common/services/id.service';

export interface WriteInterface<T extends BaseEntity> {
  genSave(item: T): Promise<T>;
  genUpdate(itemId: Id_of<T>, newObj: T): Promise<T>;
  deleteById(id: Id_of<T>): Promise<any>;
}
