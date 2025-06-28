import { InternalServerErrorException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { WriteInterface } from '../../interfaces/write.interface';
import { ReadInterface } from '../../interfaces/read.interface';
import { BaseEntity } from '../entity/BaseEntity';
import { EntityFromDbDtoBase } from '../dto/EntityFromDbDtoBase';
import { EntityToDbDtoBase } from '../dto/EntityToDbDtoBase';
import { IdType_donotuse, Id_of } from '@common/services/id.service';
import {
  DynamoDBClient,
  CreateTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { AbstractFunctionNotImplemented } from '@common/exceptions';

export abstract class BaseRepository<
    TGenericEntity extends BaseEntity,
    FromDbDto extends EntityFromDbDtoBase,
    ToDbDto extends EntityToDbDtoBase,
  >
  implements WriteInterface<TGenericEntity>, ReadInterface<TGenericEntity>
{
  protected tableName: string;
  protected documentClient: DynamoDBDocumentClient;
  protected dynamodbClient: DynamoDBClient;
  protected logger: Logger;
  private EntityCreator: { new (data?: FromDbDto): TGenericEntity };
  private FromDbDtoCreator: { new (data: any): FromDbDto };
  private ToDbDtoCreator: { new (data: any): ToDbDto };
  private stateReady = false;

  constructor(
    EntityCreator: { new (data: FromDbDto): TGenericEntity },
    FromDbDtoCreator: { new (data: any): FromDbDto },
    ToDbDtoCreator: { new (data: TGenericEntity): ToDbDto },
  ) {
    this.EntityCreator = EntityCreator;
    this.FromDbDtoCreator = FromDbDtoCreator;
    this.ToDbDtoCreator = ToDbDtoCreator;

    let connectionOptions: any = {
      region: 'eu-west-1',
    };
    if (['dev', 'e2e'].includes(process.env.ENVIRONMENT)) {
      connectionOptions = {
        region: 'eu-west-1',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'someRandomId',
        secretAccessKey: 'anotherRandomId',
      };
    }
    this.dynamodbClient = new DynamoDBClient(connectionOptions);
    this.documentClient = DynamoDBDocumentClient.from(this.dynamodbClient);

    this.logger = new Logger(this.constructor.name);
  }
  protected async genCreateTableCommandParams(): Promise<CreateTableCommandInput> {
    throw new AbstractFunctionNotImplemented('genCreateTableCommandParams');
  }

  async genSave(ent: TGenericEntity): Promise<TGenericEntity> {
    const toDbDto: ToDbDto = new this.ToDbDtoCreator(ent);

    const putParams = {
      TableName: this.tableName,
      Item: toDbDto,
    };
    const command = new PutCommand(putParams);

    return this.documentClient
      .send(command)
      .then(() => {
        return ent;
      })
      .catch((ex) => {
        this.logger.error('Exception putting params:', JSON.stringify(ex));
        this.logger.debug('putParams:', JSON.stringify(putParams, null, 2));
        throw new InternalServerErrorException(-182);
      });
  }
  async genUpdate(
    itemId: IdType_donotuse,
    newItem: Partial<TGenericEntity>,
  ): Promise<TGenericEntity> {
    let updateExpressionStr = 'set';
    const updateExpressionValues = {};
    const updateExpressionKeys = {};
    newItem.updated = new Date();

    for (const key in newItem) {
      if (updateExpressionStr === 'set') {
        updateExpressionStr += ` #${key} = :${key}`;
      } else {
        updateExpressionStr += `, #${key} = :${key}`;
      }
      // WARNING!!! the two following .toString() could be weird.
      // I'm not sure if they are needed or not, but without them, there are some weird errors.
      updateExpressionKeys[`#${key.toString()}`] = key;
      updateExpressionValues[`:${key.toString()}`] = newItem[key];
    }

    const updateParams: UpdateCommandInput = {
      TableName: this.tableName,
      Key: { id: itemId },
      UpdateExpression: updateExpressionStr,
      ExpressionAttributeValues: updateExpressionValues,
      ExpressionAttributeNames: updateExpressionKeys,
      ReturnValues: 'ALL_NEW', // 'UPDATED_NEW
    };
    const command = new UpdateCommand(updateParams);
    return this.documentClient
      .send(command)
      .then((ret: UpdateCommandOutput) => {
        return ret.Attributes[0] as TGenericEntity;
      });
  }
  async deleteById(id: Id_of<TGenericEntity>): Promise<any> {
    const deleteParams = {
      TableName: this.tableName,
      Key: { id: id.toString() },
    };
    const command = new DeleteCommand(deleteParams);

    return this.documentClient
      .send(command)
      .then(() => true)
      .catch(() => {
        throw new InternalServerErrorException(-180);
      });
  }
  async genFindOnIndex(
    indexName: string,
    pkName: string,
    pkValue: string,
    skName?: string,
    skValue?: string,
  ): Promise<TGenericEntity[]> {
    const queryParams = {
      TableName: this.tableName,
      IndexName: indexName,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': pkName,
      },
      ExpressionAttributeValues: {
        ':pk': pkValue,
      },
    };
    if (!!skName && !!skValue) {
      queryParams.KeyConditionExpression += ' and #sk = :sk';
      queryParams.ExpressionAttributeNames['#sk'] = skName;
      queryParams.ExpressionAttributeValues[':sk'] = skValue;
    }
    const command = new QueryCommand(queryParams);
    return this.documentClient
      .send(command)
      .then((data) => {
        if (!data || !data.Items || !data.Items.length) {
          return [];
        }
        return data.Items.map((item) => {
          const dto: FromDbDto = new this.FromDbDtoCreator(item);
          const inst: TGenericEntity = new this.EntityCreator(dto);
          return inst;
        });
      })
      .catch((e) => {
        this.logger.error(`Error querying: ${JSON.stringify(e, null, 2)}`);
        this.logger.error('e.__type:', e.__type);
        throw new InternalServerErrorException(-181);
      });
  }
  async genFromId(id: string): Promise<TGenericEntity> {
    const getParams = {
      TableName: this.tableName,
      Key: { id },
    };
    const command = new GetCommand(getParams);
    const response = await this.dynamodbClient.send(command);
    if (!response.Item) {
      return null;
    }
    const dto: FromDbDto = new this.FromDbDtoCreator(response.Item);
    const inst: TGenericEntity = new this.EntityCreator(dto);
    return inst;
  }
}
