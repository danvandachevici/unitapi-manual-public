import {
  CreateTableCommandOutput,
  DeleteTableCommandOutput,
} from '@aws-sdk/client-dynamodb';

export interface IDBMutations {
  genCreateTable(): Promise<boolean>;
  genDeleteTable(): Promise<void>;
}
