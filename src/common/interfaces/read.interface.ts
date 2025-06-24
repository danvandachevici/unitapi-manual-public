import { BaseEntity } from '@common/base-types/entity/BaseEntity';
import { Id_of } from '@common/services/id.service';

export interface ReadInterface<T extends BaseEntity> {
  genFromId(id: Id_of<T>): Promise<T>;
}
