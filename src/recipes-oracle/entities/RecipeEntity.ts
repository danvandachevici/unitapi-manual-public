import { BaseEntity } from '@common/base-types/entity/BaseEntity';
import { CreateRecipeDto } from '../dtos/CreateRecipeDto';
import { IngredientEntity } from './IncredientEntity';
import { Id_of } from '@common/services/id.service';

export class RecipeEntity extends BaseEntity {
  title: string; // Title of the recipe
  ingredients: Id_of<IngredientEntity>[]; // List of ingredients required for the recipe
  instructions: string; // Step-by-step instructions to prepare the recipe

  constructor(data: CreateRecipeDto) {
    super(data);
    this.title = data.title;
    this.ingredients = data.ingredients;
    this.instructions = data.instructions;
  }
}
