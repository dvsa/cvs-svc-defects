import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { addHttpHeaders } from "../../utils/httpHeaders";

export const validateIvaDefectManualQuery = (
  event: APIGatewayProxyEvent,
): APIGatewayProxyResult | undefined => {
  if (!event.headers.Authorization) {
    return {
      statusCode: 400,
      body: "Missing authorization header",
    };
  }

  if (!event.pathParameters?.id) {
    return addHttpHeaders({
      statusCode: 400,
      body: JSON.stringify({ errors: ["Missing id"] }),
    });
  }
};
