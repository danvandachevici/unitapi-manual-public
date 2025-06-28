import { CreationBaseDto } from '@common/base-types/dto/CreationBaseDto';
import { MeasurementUnit } from '../MeasurementUnitEnum';

export class CreateIngredientDto extends CreationBaseDto {
  name: string;
  unit: MeasurementUnit;

  constructor(name: string, unit: MeasurementUnit) {
    super();
    this.name = name;
    this.unit = unit;
  }
}
