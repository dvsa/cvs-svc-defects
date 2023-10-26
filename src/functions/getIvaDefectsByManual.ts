import { Handler } from "aws-lambda";
import { HTTPResponse } from "../models/HTTPResponse";
import { IvaDefectsService } from "../services/ivaDefectsService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { validateIvaDefectErrors } from "../validators/ivaDefectsValidator";
import { addHttpHeaders } from "../utils/httpHeaders";

export const getIvaDefectsByManual: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const defectsService = new IvaDefectsService();

  const manualId = event?.pathParameters?.id ?? '';

  const archiveErrors = validateIvaDefectErrors(event);

  if (archiveErrors) {
    return addHttpHeaders(archiveErrors);
  }

  return defectsService
    .getIvaDefects(manualId)
    .then((data: any) => {
      return new HTTPResponse(200, data);
    })
    .catch((error: any) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
