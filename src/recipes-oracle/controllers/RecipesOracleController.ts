import { Controller, Get } from '@nestjs/common';

@Controller('recipes-oracle')
export class RecipesOracleController {
  constructor() {}

  @Get()
  getListOfRecipes(): string {
    return '';
  }
}
