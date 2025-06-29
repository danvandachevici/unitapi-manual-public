import { CreationBaseDto } from '@common/base-types/dto/CreationBaseDto';
import { IngredientEntity } from '../entities/IngredientEntity';
import { Id_of } from '@common/services/id.service';

export class CreateRecipeDto extends CreationBaseDto {
  title: string;
  ingredients: Id_of<IngredientEntity>[];
  instructions: string;
}
