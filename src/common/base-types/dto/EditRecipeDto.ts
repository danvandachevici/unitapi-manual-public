import { Id_of } from '@common/services/id.service';
import { IngredientEntity } from '@src/recipes-oracle/IncredientEntity';
import { RecipeEntity } from '@src/recipes-oracle/entities/RecipeEntity';

export class EditRecipeDto {
  id: Id_of<RecipeEntity>;
  title?: string;
  ingredients?: Id_of<IngredientEntity>[];
  instructions?: string;
}
