import { Module } from '@nestjs/common';
import { RecipesOracleModule } from './recipes-oracle/RecipesOracleModule';

@Module({
  imports: [RecipesOracleModule],
  controllers: [],
  providers: [],
})
export class ServicesModule {}
