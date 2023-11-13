import {
  DefectGETIVA,
  InspectionType,
  VehicleType,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get";
import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import { IvaDatabaseService } from "./IvaDatabaseService";
import { HTTPError } from "../models/HTTPError";
import { convertFlatDataToProperJSON } from "../utils/formatDefects";

export class IvaDefectsService {
  public readonly ivaDatabaseService: IvaDatabaseService;

  constructor(ivaDatabaseService: IvaDatabaseService) {
    this.ivaDatabaseService = ivaDatabaseService;
  }

  public getIvaDefects(
    vehicleType: VehicleType | null,
    euVehicleCategory: EUVehicleCategory | null,
    inspectionType: InspectionType | null,
  ): Promise<DefectGETIVA[]> {
    return this.ivaDatabaseService
      .getDefectsByCriteria(vehicleType, euVehicleCategory, inspectionType)
      .then((data: any) => {
        return convertFlatDataToProperJSON(
          data.Items,
        ) as unknown as DefectGETIVA[];
      })
      .catch((error) => {
        if (!(error instanceof HTTPError)) {
          console.error(error);
          error.statusCode = 500;
          error.body = "Internal Server Error";
        }
        throw new HTTPError(error.statusCode, error.body);
      });
  }

  public async getIvaDefectsByManualId(manualId: string): Promise<DefectGETIVA[]> {
    try {
      const results = await this.ivaDatabaseService
        .getDefectsByManualId(manualId);

        if (results.length === 0) {
          throw new HTTPError(404, "No iva defects match the search criteria.");
        }
        return convertFlatDataToProperJSON(results) as unknown as DefectGETIVA[];
    }
    catch(error: any) {
      if (!(error instanceof HTTPError)) {
        console.error(error);
        error.statusCode = 500;
        error.body = "Internal Server Error";
      }
      throw new HTTPError(error.statusCode, error.body);
    };
  }
}
