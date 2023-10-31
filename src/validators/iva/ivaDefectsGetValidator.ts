import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { addHttpHeaders } from "../../utils/httpHeaders";

export const validateIvaDefectGetQuery = (
  event: APIGatewayProxyEvent,
): APIGatewayProxyResult | undefined => {
  if (!event.headers.Authorization) {
    return {
      statusCode: 400,
      body: "Missing authorization header",
    };
  }
};
