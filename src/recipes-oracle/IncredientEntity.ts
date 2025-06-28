import { BaseEntity } from '@common/base-types/entity/BaseEntity';
import { MeasurementUnit } from './MeasurementUnitEnum';

export class IngredientEntity extends BaseEntity {
  name: string;
  unit: MeasurementUnit;

  constructor(name: string, unit: MeasurementUnit) {
    super();
    this.name = name;
    this.unit = unit;
  }
}
