import { EntityToDbDtoBase } from '@common/base-types/dto/EntityToDbDtoBase';
import { IngredientEntity } from '../entities/IngredientEntity';
import { MeasurementUnit } from '../entities/MeasurementUnitEnum';

export class IngredientToDbDto extends EntityToDbDtoBase {
  name: string;
  unit: MeasurementUnit;

  constructor(data: IngredientEntity) {
    super(data);
    this.name = data.name;
    this.unit = data.unit;
  }
}
