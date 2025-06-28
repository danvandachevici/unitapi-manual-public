import { BaseRepository } from '@common/base-types/repository/BaseRepository';
import { IngredientFromDbDto } from '../dtos/IngredientFromDbDto';
import { IngredientEntity } from '../IncredientEntity';
import { IngredientToDbDto } from '../dtos/IngredientToDbDto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IngredientRepository extends BaseRepository<
  IngredientEntity,
  IngredientFromDbDto,
  IngredientToDbDto
> {}
