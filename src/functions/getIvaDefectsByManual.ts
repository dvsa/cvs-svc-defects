import { Handler } from "aws-lambda";
import { HTTPResponse } from "../models/HTTPResponse";
import { IvaDefectsService } from "../services/ivaDefectsService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateIvaDefectManualQuery } from "../validators/iva/ivaDefectsByManualValidator";
import { addHttpHeaders } from "../utils/httpHeaders";
import { IvaDatabaseService } from "../services/IvaDatabaseService";

export const getIvaDefectsByManual: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const ivaDatabaseService = new IvaDatabaseService();
  const defectsService = new IvaDefectsService(ivaDatabaseService);

  const defectErrors = validateIvaDefectManualQuery(event);

  if (defectErrors) {
    return addHttpHeaders(defectErrors);
  }

  const manualId = event?.pathParameters?.id ?? "";

  return defectsService
    .getIvaDefectsByManualId(manualId)
    .then((data: any) => {
      return new HTTPResponse(200, data);
    })
    .catch((error: any) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
