import { BaseEntity } from '@common/base-types/entity/BaseEntity';
import { nanoid } from 'nanoid';

const separator = '-00-';

export type IdType_donotuse = string;
export type Id_of<T extends BaseEntity> = IdType_donotuse;

export class IdService {
  static getId<T extends BaseEntity>(type: Id_of<T>, size?: number): string {
    return `${type}${separator}` + nanoid(size || 16);
  }
  static isId<T extends BaseEntity>(type: Id_of<T>, id: string): boolean {
    return id.startsWith(`${type}${separator}`);
  }
  static getIdFromString<T extends BaseEntity>(idAsString: string): Id_of<T> {
    const ret = idAsString.split(separator);
    if (ret.length !== 2) {
      throw new Error('Invalid id - ' + idAsString);
    }
    return idAsString as Id_of<T>;
  }
  static getIdPart(id: Id_of<BaseEntity>): string {
    const ret = id.split(separator);
    if (ret.length !== 2) {
      throw new Error('Invalid id - ' + id);
    }
    return ret[1];
  }
}
