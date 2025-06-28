import { Body, Controller, Post } from '@nestjs/common';
import { IngredientResponseDto } from '../dtos/IngredientResponseDto';
import { IngredientEntity } from '../IncredientEntity';
import { IngredientRepository } from '../repositories/IngredientRepository';
import { CreateIngredientDto } from '../dtos/CreateIngredientDto';

@Controller('recipes-oracle/ingredients')
export class IngredientsController {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  @Post()
  async createIngredient(
    @Body() createIngredientDto: CreateIngredientDto,
  ): Promise<IngredientResponseDto> {
    const ingredient = new IngredientEntity(
      createIngredientDto.name,
      createIngredientDto.unit,
    );
    await this.ingredientRepository.genSave(ingredient);
    return new IngredientResponseDto(ingredient);
  }
}
