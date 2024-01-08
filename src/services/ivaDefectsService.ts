import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import { IvaDatabaseService } from "./ivaDatabaseService";
import { HTTPError } from "../models/HTTPError";
import { IIVATaxonomySection } from "../models/IVADefect";
import {
  DefectGETIVA,
  InspectionType,
  RequiredStandard,
  SectionIVA,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get";
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
   * Retrieves IVA Defects based on the provided manualId and formats the response
   * @param euVehicleCategory the manual ID, e.g M1, N1, MSVA
   * @returns Array of IVA Defects
   */
  public async getIvaDefectsByEUVehicleCategory(
    euVehicleCategory: string,
  ): Promise<DefectGETIVA> {
    try {
      const results =
        (await this.ivaDatabaseService.getDefectsByEUVehicleCategory(
          euVehicleCategory,
        )) as IIVATaxonomySection[];

      return this.formatIvaDefects(results, euVehicleCategory);
    } catch (error: any) {
      if (!(error instanceof HTTPError)) {
        console.error(error);
        error.statusCode = 500;
        error.body = "Internal Server Error";
      }
      throw new HTTPError(error.statusCode, error.body);
    }
  }

  public formatIvaDefects(
    results: IIVATaxonomySection[],
    euVehicleCategory: string,
  ): DefectGETIVA {
    return {
      euVehicleCategories: [
        EUVehicleCategory[
          euVehicleCategory.toLocaleUpperCase() as keyof typeof EUVehicleCategory
        ],
      ],
      basic: this.formatSection(results, (x) => x.basicInspection),
      normal: this.formatSection(
        results,
        (x) =>
          x.normalInspection || (!x.normalInspection && !x.basicInspection),
      ),
    } as DefectGETIVA;
  }

  private formatSection(
    results: IIVATaxonomySection[],
    filterExpression: (x: IRequiredStandard) => boolean,
  ): SectionIVA[] {
    return results.flatMap((section) => {
      const standards = section.requiredStandards
        .filter(filterExpression)
        .map((rs) => {
          return {
            rsNumber: parseInt(rs.rsNumber, 10),
            requiredStandard: rs.requiredStandard,
            refCalculation: rs.refCalculation,
            additionalInfo: rs.additionalInfo,
            inspectionTypes: [
              ...(rs.basicInspection ? ["basic" as InspectionType] : []),
              ...(rs.normalInspection ? ["normal" as InspectionType] : []),
            ],
          } as RequiredStandard;
        });

      if (standards.length > 0) {
        return {
          sectionNumber: section.sectionNumber,
          sectionDescription: section.sectionDescription,
          requiredStandards: standards,
        };
      }
      return [];
    });
  }
}
