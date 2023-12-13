import {
  DefectGETIVA,
  InspectionType,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get";
import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import { IvaDatabaseService } from "./ivaDatabaseService";
import { HTTPError } from "../models/HTTPError";
import { IIVADefect } from "../models/IVADefect";
import { IRequiredStandard } from "../models/RequiredStandard";

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
   * @param basicInspection the Inspection Type e.g basic, normal
   * @returns Array of IVA Defects
   */
  public async getIvaDefects(
    euVehicleCategory: EUVehicleCategory | null,
    basicInspection: boolean | false,
  ): Promise<DefectGETIVA[]> {
    try {
      const results = await this.ivaDatabaseService.getDefectsByCriteria(
        euVehicleCategory,
        basicInspection,
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
  public async getIvaDefectsByEUVehicleCategory(
    manualId: string,
    basicInspection: boolean | false,
  ): Promise<DefectGETIVA[]> {
    try {
      const results =
        (await this.ivaDatabaseService.getDefectsByEUVehicleCategory(
          manualId,
        )) as IIVADefect[];

      const formattedResults: DefectGETIVA[] = this.formatIvaDefects(results);
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

  public getEnumKeyByEnumValue<T extends { [index: string]: string }>(
    myEnum: T,
    enumValue: string,
  ): keyof T {
    const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
    return keys[0];
  }

  public formatIvaDefects(results: IIVADefect[]): DefectGETIVA[] {
    return results.map((x) => {
      const vehicleCategory = this.getEnumKeyByEnumValue(
        EUVehicleCategory,
        x.euVehicleCategory,
      );

      const mappedDefectSection: DefectGETIVA = {
        euVehicleCategories: [EUVehicleCategory[vehicleCategory]],
        sectionNumber: x.sectionNumber,
        sectionDescription: x.sectionDescription,
        requiredStandards: x.requiredStandards.map((rs) => {
          const standard = {
            rsNumber: parseInt(rs.rsNumber, 10),
            requiredStandard: rs.requiredStandard,
            refCalculation: rs.refCalculation,
            additionalInfo: rs.additionalInfo,
            inspectionTypes: [],
          };

          return standard;
        }),
      };
      return mappedDefectSection;
    });
  }
}
