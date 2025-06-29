import { EntityFromDbDtoBase } from '@common/base-types/dto/EntityFromDbDtoBase';
import { Id_of } from '@common/services/id.service';
import { IngredientEntity } from '../entities/IngredientEntity';

export class RecipeFromDbDto extends EntityFromDbDtoBase {
  title: string;
  ingredients: Id_of<IngredientEntity>[]; // Assuming ingredients are stored as strings in the database
  instructions: string;

  constructor(data: any) {
    super(data);
    this.title = data.title;
    this.ingredients = data.ingredients;
    this.instructions = data.instructions;
  }
}
