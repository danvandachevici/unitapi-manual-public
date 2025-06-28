import { Module } from '@nestjs/common';
import { RecipesOracleController } from './controllers/RecipesOracleController';
import { RecipeRepository } from './repositories/RecipeRepository';
import { IngredientRepository } from './repositories/IngredientRepository';
import { IngredientsController } from './controllers/IngredientsController';

@Module({
  imports: [],
  controllers: [RecipesOracleController, IngredientsController],
  providers: [IngredientRepository, RecipeRepository],
  exports: [],
})
export class RecipesOracleModule {}
