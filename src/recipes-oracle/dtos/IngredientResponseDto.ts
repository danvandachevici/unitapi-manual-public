import { Id_of } from '@common/services/id.service';
import { IngredientEntity } from '../entities/IngredientEntity';
import { MeasurementUnit } from '../entities/MeasurementUnitEnum';

export class IngredientResponseDto {
  id: Id_of<IngredientEntity>;
  name: string;
  unit: MeasurementUnit;

  constructor(data: IngredientEntity) {
    this.id = data.id;
    this.name = data.name;
    this.unit = data.unit;
  }
}
