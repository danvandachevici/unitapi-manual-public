import { ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { Server } from 'http';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { ServicesModule } from '@src/services.module';

export enum CommonServerVariant {
  REGULAR,
  LAMBDA,
}

export enum APIVersionEnvironments {
  PROD = 1,
  DEV = 2,
  TEST = 3,
}

declare const module: any;

export class CommonServer {
  server: Handler = null;

  async bootstrap(): Promise<Handler> {
    this.app = await NestFactory.create(ServicesModule);
    this.getServerConfig();
    await this.app.init();
    const expressApp = this.app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
  }

  async genLambda(
    event: any,
    context: Context,
    callback: Callback,
  ): Promise<any> {
    this.server = this.server ?? (await this.bootstrap());
    return this.server(event, context, callback);
  }
  app: NestApplication;
  cachedServer: Server = null;

  getServerConfig() {
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
        transformOptions: { excludeExtraneousValues: true },
      }),
    );

    this.app.setGlobalPrefix('api');
    this.app.enableCors();
  }

  async genMainApp() {
    this.app = await NestFactory.create(ServicesModule);
    this.getServerConfig();
    this.app.listen(process.env.APP_PORT);
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => this.app.close());
    }
    console.log('Listening on ' + process.env.APP_PORT);
  }
}
