import { Handler } from "aws-lambda";
import { HTTPResponse } from "../models/HTTPResponse";
import { IvaDefectsService } from "../services/ivaDefectsService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  EUVehicleCategory,
  InspectionType,
  VehicleType,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get";
import { addHttpHeaders } from "../utils/httpHeaders";
import { validateIvaDefectGetQuery } from "../validators/iva/ivaDefectsGetValidator";

export const getIvaDefects: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const defectsService = new IvaDefectsService();

  const defectErrors = validateIvaDefectGetQuery(event);

  if (defectErrors) {
    return addHttpHeaders(defectErrors);
  }

  const vehicleType = event?.queryStringParameters?.vehicleType as VehicleType;
  const euVehicleCategory = event?.queryStringParameters
    ?.euVehicleCategory as EUVehicleCategory;
  const inspectionType = event?.queryStringParameters
    ?.inspectionType as InspectionType;

  return defectsService
    .getIvaDefects(vehicleType, euVehicleCategory, inspectionType)
    .then((data: any) => {
      return new HTTPResponse(200, data);
    })
    .catch((error: any) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
