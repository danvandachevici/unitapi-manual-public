import { CreationBaseDto } from '@common/base-types/dto/CreationBaseDto';
import { IngredientEntity } from '../IncredientEntity';
import { Id_of } from '@common/services/id.service';

export class CreateRecipeDto extends CreationBaseDto {
  title: string;
  ingredients: Id_of<IngredientEntity>[];
  instructions: string;
}
