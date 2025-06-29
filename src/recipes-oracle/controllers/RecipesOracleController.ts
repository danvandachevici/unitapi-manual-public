import { Body, Controller, Get, Post } from '@nestjs/common';
import { RecipeResponseDto } from '../dtos/RecipeResponseDto';
import { RecipeRepository } from '../repositories/RecipeRepository';
import { IngredientRepository } from '../repositories/IngredientRepository';
import { CreateRecipeDto } from '../dtos/CreateRecipeDto';
import { RecipeEntity } from '../entities/RecipeEntity';

@Controller('recipes-oracle')
export class RecipesOracleController {
  constructor(
    private readonly recipeRepository: RecipeRepository, // Assuming you have a RecipeRepository to handle data access
    private readonly ingredientRepository: IngredientRepository, // Assuming you have an IngredientRepository to handle data access
  ) {}

  @Get()
  async getListOfRecipes(): Promise<RecipeResponseDto[]> {
    const items = await this.recipeRepository.genGetAll(100);
    return await Promise.all(
      items.map((item) =>
        RecipeResponseDto.genFromEntity(item, this.ingredientRepository),
      ),
    );
  }

  @Post()
  async createRecipe(
    @Body() createRecipeDto: CreateRecipeDto,
  ): Promise<RecipeResponseDto> {
    const newRecipe = new RecipeEntity(createRecipeDto);
    const recipe = await this.recipeRepository.genSave(newRecipe);
    return RecipeResponseDto.genFromEntity(recipe, this.ingredientRepository);
  }
}
