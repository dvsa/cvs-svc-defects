import { APIGatewayProxyResult } from "aws-lambda";

/**
 * Adds default headers onto HTTP responses returned to the client
 * @param httpResponse -  The httpResponse to add the default headers to
 * @returns The adjusted httpResponse
 */
export const addHttpHeaders = (
  httpResponse: APIGatewayProxyResult,
): APIGatewayProxyResult => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
  };

  return { ...httpResponse, headers };
};
