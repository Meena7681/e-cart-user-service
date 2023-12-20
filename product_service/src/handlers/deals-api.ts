import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export const dealsHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  console.log(`Context:${JSON.stringify(context)}`);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "hello from deals product...",
      path: `${event.path},${event.pathParameters}`,
    }),
  };
};
