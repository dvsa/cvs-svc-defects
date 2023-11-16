import {
  DefectGETIVA,
  InspectionType,
  VehicleType,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get";
import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import { IvaDatabaseService } from "./ivaDatabaseService";
import { HTTPError } from "../models/HTTPError";
import { convertFlatDataToProperJSON } from "../utils/formatDefects";
import { format } from "path";

export class IvaDefectsService {
  public readonly ivaDatabaseService: IvaDatabaseService;

  constructor(ivaDatabaseService: IvaDatabaseService) {
    this.ivaDatabaseService = ivaDatabaseService;
  }

  public async getIvaDefects(
    vehicleType: VehicleType | null,
    euVehicleCategory: EUVehicleCategory | null,
    inspectionType: InspectionType | null,
  ): Promise<DefectGETIVA[]> {
    try {
      const results = await this.ivaDatabaseService.getDefectsByCriteria(
        vehicleType,
        euVehicleCategory,
        inspectionType,
      );

      let formattedResults: DefectGETIVA[] = [];
      if (results.length > 0) {
        formattedResults = convertFlatDataToProperJSON(
          results,
        ) as unknown as DefectGETIVA[];
      }
      return formattedResults;
    } catch (error: any) {
      if (!(error instanceof HTTPError)) {
        console.error(error);
        error.statusCode = 500;
        error.body = "Internal Server Error";
      }
      throw new HTTPError(error.statusCode, error.body);
    }
  }

  public async getIvaDefectsByManualId(
    manualId: string,
  ): Promise<DefectGETIVA[]> {
    try {
      const results =
        await this.ivaDatabaseService.getDefectsByManualId(manualId);

      let formattedResults: DefectGETIVA[] = [];
      if (results.length > 0) {
        formattedResults = convertFlatDataToProperJSON(
          results,
        ) as unknown as DefectGETIVA[];
      }
      return formattedResults;
    } catch (error: any) {
      if (!(error instanceof HTTPError)) {
        console.error(error);
        error.statusCode = 500;
        error.body = "Internal Server Error";
      }
      throw new HTTPError(error.statusCode, error.body);
    }
  }
}
