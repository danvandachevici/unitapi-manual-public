import {
  ABSTRACT_FUNCTION_NOT_IMPLEMENTED_CODE,
  CANNOT_CREATE_TABLE_CODE,
  GENERATOR_MODULE_NOT_FOUND_CODE,
  GENERIC_FAILURE_CODE,
  MISSING_GENERATOR_CODE,
  NO_DEFAULT_IMPORT_CODE,
  TABLE_DOES_NOT_EXIST_CODE,
  TABLE_NAME_NOT_PASSED_CODE,
  TExitCode,
} from './constants/exit-codes';

export abstract class BaseException {
  constructor(
    private message: string,
    private code: TExitCode,
  ) {}
}
export class TableNameNotPassedException extends BaseException {
  constructor() {
    super('Table name not passed', TABLE_NAME_NOT_PASSED_CODE);
  }
}

export class AbstractFunctionNotImplemented extends BaseException {
  constructor(functionName?: string) {
    super(
      `Abstract function not implemented ${functionName}`,
      ABSTRACT_FUNCTION_NOT_IMPLEMENTED_CODE,
    );
  }
}

export class TableDoesNotExistException extends BaseException {
  constructor(name: string) {
    super(`Table ${name} does not exist`, TABLE_DOES_NOT_EXIST_CODE);
  }
}
export class MissingGeneratorException extends BaseException {
  constructor(name: string) {
    super(`Missing ${name}-generator.ts`, MISSING_GENERATOR_CODE);
  }
}
export class NoDefaultImportInGenerator extends BaseException {
  constructor(name: string) {
    super(
      `Missing default export in ${name}-generator.ts`,
      NO_DEFAULT_IMPORT_CODE,
    );
  }
}
export class GeneratorModuleNotFoundException extends BaseException {
  constructor(name: string) {
    super(`Missing ${name}-generator.ts`, GENERATOR_MODULE_NOT_FOUND_CODE);
  }
}
export class GenericException extends BaseException {
  constructor(description: string) {
    super(description, GENERIC_FAILURE_CODE);
  }
}
export class CannotCreateTableException extends BaseException {
  constructor(tableName: string) {
    super(
      `Cannot create table ${tableName} Exception!`,
      CANNOT_CREATE_TABLE_CODE,
    );
  }
}
