import { EntityToDbDtoBase } from '@common/base-types/dto/EntityToDbDtoBase';
import { RecipeEntity } from '../RecipeEntity';

export class RecipeToDto extends EntityToDbDtoBase {
  title: string;
  ingredients: string[]; // Assuming ingredients are stored as strings in the database
  instructions: string;
  constructor(public entity: RecipeEntity) {
    super(entity);
    this.title = entity.title;
    this.ingredients = entity.ingredients;
    this.instructions = entity.instructions;
  }
}
