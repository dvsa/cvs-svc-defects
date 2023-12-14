import { Handler } from "aws-lambda";
import { HTTPResponse } from "../models/HTTPResponse";
import { IvaDefectsService } from "../services/ivaDefectsService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/iva/defects/get";
import { addHttpHeaders } from "../utils/httpHeaders";
import { validateIvaDefectGetQuery } from "../validators/iva/ivaDefectsGetValidator";
import { IvaDatabaseService } from "../services/ivaDatabaseService";

export const getIvaDefects: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const ivaDatabaseService = new IvaDatabaseService();
  const ivaDefectsService = new IvaDefectsService(ivaDatabaseService);

  const defectErrors = validateIvaDefectGetQuery(event);

  if (defectErrors) {
    return addHttpHeaders(defectErrors);
  }

  const euVehicleCategoryQuery = event?.queryStringParameters
      ?.euVehicleCategory as EUVehicleCategory;

  if (!euVehicleCategoryQuery) {
    return { statusCode: 400, body: "euVehicleCategory required" };
  } else if (!Object.values(EUVehicleCategory).includes(euVehicleCategoryQuery)) {
    return {
      statusCode: 400,
      body: "Invalid EU vehicle category",
    };
  } else {
    return {
      statusCode: 204,
      body: "[]",
    };
  }



  const onlyBasicInspection =
    event?.queryStringParameters?.onlyBasicInspection === "true";

  return ivaDefectsService
    .getIvaDefectsByEUVehicleCategory(euVehicleCategoryQuery, onlyBasicInspection)
    .then((data: any) => {
      return new HTTPResponse(200, data);
    })
    .catch((error: any) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
