import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import { IvaDatabaseService } from "./ivaDatabaseService";
import { HTTPError } from "../models/HTTPError";
import { ITaxonomySectionIVA } from "../models/IVADefect";
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
   * Retrieves IVA Defects based on the provided euVehicleCategory and formats the response
   * @param euVehicleCategory the EU Vehicle Category, e.g M1, N1, MSVA
   * @returns Arrays of IVA Defects, grouped by inspection type
   */
  public async getIvaDefectsByEUVehicleCategory(
    euVehicleCategory: string
  ): Promise<DefectGETIVA> {
    try {
      const results =
        (await this.ivaDatabaseService.getDefectsByEUVehicleCategory(
          euVehicleCategory
        )) as ITaxonomySectionIVA[];

      return this.formatIvaDefects(results, euVehicleCategory);
    } catch (error: any) {
      const httpError =
        error instanceof HTTPError
          ? error
          : new HTTPError(500, "Internal Server Error");
      console.error(httpError);
      throw httpError;
    }
  }

  public formatIvaDefects(
    results: ITaxonomySectionIVA[],
    euVehicleCategory: string
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
        (x) => x.normalInspection || (!x.normalInspection && !x.basicInspection)
      ),
    } as DefectGETIVA;
  }

  private formatSection(
    results: ITaxonomySectionIVA[],
    filterExpression: (x: IRequiredStandard) => boolean
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
