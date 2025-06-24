import {
  CreateTableCommandOutput,
  DeleteTableCommandOutput,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { IDBMutations } from './dbmutations.interface';
import {
  DeleteTableCommand,
  DeleteTableCommandInput,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import { TableNameNotPassedException } from '@common/exceptions';
import { Logger } from '@nestjs/common';

export class DBMutationsBase implements IDBMutations {
  protected logger: Logger;
  protected tableName: string;
  protected dynamodbClient: DynamoDBClient;
  constructor() {
    let connectionOptions: any = { region: 'eu-west-1' };
    if (['dev', 'e2e'].includes(process.env.ENVIRONMENT)) {
      connectionOptions = {
        region: 'eu-west-1',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'someRandomId',
        secretAccessKey: 'anotherRandomId',
      };
    }
    this.dynamodbClient = new DynamoDBClient(connectionOptions);
  }
  async genCreateTable(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async genDeleteTable(): Promise<void> {
    if (!this.tableName) {
      throw new TableNameNotPassedException();
    }
    this.logger.log('Deleting table ' + this.tableName);
    const describeCommand = new DescribeTableCommand({
      TableName: this.tableName,
    });
    this.dynamodbClient
      .send(describeCommand)
      .then(async () => {
        const params: DeleteTableCommandInput = {
          TableName: this.tableName,
        };
        const command = new DeleteTableCommand(params);
        return await this.dynamodbClient.send(command);
      })
      .catch((err) => {
        if (err.code !== 'ResourceNotFoundException') {
          throw err;
        }
      });
  }
}
