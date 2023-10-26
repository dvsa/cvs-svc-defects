import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { addHttpHeaders } from "../utils/httpHeaders";

export const validateIvaDefectErrors = (
  event: APIGatewayProxyEvent,
): APIGatewayProxyResult | undefined => {
  if (!event.pathParameters?.id) {
    return addHttpHeaders({
      statusCode: 400,
      body: JSON.stringify({ errors: ["Missing id"] }),
    });
  }
};
