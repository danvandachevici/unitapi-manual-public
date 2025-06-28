import { EntityFromDbDtoBase } from '@common/base-types/dto/EntityFromDbDtoBase';

export class IngredientFromDbDto extends EntityFromDbDtoBase {
  name: string;

  constructor(data: any) {
    super(data);
    this.name = data.name;
  }
}
