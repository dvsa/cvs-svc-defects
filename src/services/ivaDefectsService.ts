import {
  DefectGETIVA,
  InspectionType,
  VehicleType,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get";
import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import { IvaDatabaseService } from "./ivaDatabaseService";
import { HTTPError } from "../models/HTTPError";

export class IvaDefectsService {
  public readonly ivaDatabaseService: IvaDatabaseService;

  /**
   * Constructor for the IvaDefectsService class
   * @param ivaDatabaseService the IVA database service
   */
  constructor(ivaDatabaseService: IvaDatabaseService) {
    this.ivaDatabaseService = ivaDatabaseService;
  }

  /**
   * Retrieves IVA Defects based on the optionally provided vehicleType, euVehicleCategory and inspectionType and formats the response
   * @param vehicleType the type of Vehicle e.g psv, lgv
   * @param euVehicleCategory the EU Vehicle Category, synonymous with Manual ID
   * @param inspectionType the Inspection Type e.g basic, normal
   * @returns Array of IVA Defects
   */
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

      const formattedResults: DefectGETIVA[] = [];
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

  /**
   * Retrieves IVA Defects based on the provided manualId and formats the response
   * @param manualId the manual ID, e.g M1, N1, MSVA
   * @returns Array of IVA Defects
   */
  public async getIvaDefectsByManualId(
    manualId: string,
  ): Promise<DefectGETIVA[]> {
    try {
      const results =
        await this.ivaDatabaseService.getDefectsByManualId(manualId);

      const formattedResults: DefectGETIVA[] = [];
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
