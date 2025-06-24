import { CommonServer } from '@common/common-server';
import { Handler, Context, Callback } from 'aws-lambda';

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const server = new CommonServer();
  return server.genLambda(event, context, callback);
};
