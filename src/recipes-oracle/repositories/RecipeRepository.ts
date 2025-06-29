import { BaseRepository } from '@common/base-types/repository/BaseRepository';
import { RecipeEntity } from '../entities/RecipeEntity';
import { RecipeFromDbDto } from '../dtos/RecipeFromDbDto';
import { RecipeToDto } from '../dtos/RecipeToDbDto';

export class RecipeRepository extends BaseRepository<
  RecipeEntity,
  RecipeFromDbDto,
  RecipeToDto
> {}
