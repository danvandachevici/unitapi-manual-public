import { Id_of } from '@common/services/id.service';
import { IngredientEntity } from '../entities/IngredientEntity';
import { RecipeEntity } from '../entities/RecipeEntity';
import { IngredientRepository } from '../repositories/IngredientRepository';

export class RecipeResponseDto {
  id: Id_of<RecipeEntity>; // Unique identifier for the recipe
  title: string; // Title of the recipe
  ingredients: IngredientEntity[]; // List of ingredients required for the recipe
  instructions: string; // Step-by-step instructions to prepare the recipe
  ingredientsRepo: IngredientRepository;

  constructor(ingredientsRepo: IngredientRepository) {
    this.ingredientsRepo = ingredientsRepo;
  }

  static async genFromEntity(
    entity: RecipeEntity,
    ingredientsRepo: IngredientRepository,
  ): Promise<RecipeResponseDto> {
    const resp = new RecipeResponseDto(ingredientsRepo);
    const ingredients = [];
    resp.id = entity.id;
    resp.title = entity.title;
    resp.ingredients = ingredients;
    resp.instructions = entity.instructions;
    return resp;
  }
}
