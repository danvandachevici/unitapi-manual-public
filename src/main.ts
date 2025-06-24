import { CommonServer } from '@common/common-server';

async function bootstrap() {
  process.env.IS_OFFLINE = 'true';
  const server = new CommonServer();
  server.genMainApp();
}
bootstrap();
