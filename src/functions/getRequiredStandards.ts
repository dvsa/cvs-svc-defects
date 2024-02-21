import { Handler } from "aws-lambda";
import { HTTPResponse } from "../models/HTTPResponse";
import { RequiredStandardsService } from "../services/requiredStandardsService";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/required-standards/defects/enums/euVehicleCategory.enum";
import { addHttpHeaders } from "../utils/httpHeaders";
import { validateRequiredStandardsGetQuery } from "../validators/required-standards/requiredStandardsGetValidator";
import { RequiredStandardsDatabaseService } from "../services/requiredStandardsDatabaseService";

export const getRequiredStandards: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const requiredStandardsDatabaseService =
    new RequiredStandardsDatabaseService();
  const requiredStandardsService = new RequiredStandardsService(
    requiredStandardsDatabaseService,
  );

  const defectErrors = validateRequiredStandardsGetQuery(event);

  if (defectErrors) {
    return addHttpHeaders(defectErrors);
  }

  const euVehicleCategoryQuery = event?.queryStringParameters
    ?.euVehicleCategory as EUVehicleCategory;
  if (!euVehicleCategoryQuery) {
    return new HTTPResponse(400, "euVehicleCategory required");
  } else if (
    !Object.values(EUVehicleCategory).includes(euVehicleCategoryQuery)
  ) {
    return new HTTPResponse(
      400,
      `${euVehicleCategoryQuery} is not a recognised EU Vehicle Category`,
    );
  }

  return requiredStandardsService
    .getRequiredStandardsByEUVehicleCategory(euVehicleCategoryQuery)
    .then((data: any) => {
      return new HTTPResponse(200, data);
    })
    .catch((error: any) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
