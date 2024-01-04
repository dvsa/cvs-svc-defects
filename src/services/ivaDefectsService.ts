import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import { IvaDatabaseService } from "./ivaDatabaseService";
import { HTTPError } from "../models/HTTPError";
import { ISectionIVA, INewDefectGETIVA, IIVADefect } from "../models/IVADefect";
import {
  DefectGETIVA,
  InspectionType,
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
   * @param euVehicleCategory the manual ID, e.g M1, N1, MSVA
   * @returns Array of IVA Defects
   */
  public async getIvaDefectsByEUVehicleCategory(
    euVehicleCategory: string,
  ): Promise<INewDefectGETIVA> {
    try {
      const results =
        (await this.ivaDatabaseService.getDefectsByEUVehicleCategory(
          euVehicleCategory,
        )) as IIVADefect[];

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

  public getEnumKeyByEnumValue<T extends { [index: string]: string }>(
    myEnum: T,
    enumValue: string,
  ): keyof T {
    const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
    return keys[0];
  }

  public formatInspectionTypes(sections: IIVADefect[]): ISectionIVA[] {
    const formattedSections: ISectionIVA[] = sections.map((x) => {
      const rsArr = x.requiredStandards.map((dx) => {
        return {
          rsNumber: parseInt(dx.rsNumber, 10),
          requiredStandard: dx.requiredStandard,
          refCalculation: dx.refCalculation,
          additionalInfo: dx.additionalInfo,
          inspectionTypes:
            dx.normalInspection && dx.basicInspection
              ? (["basic", "normal"] as InspectionType[])
              : dx.basicInspection
              ? (["basic"] as InspectionType[])
              : (["normal"] as InspectionType[]),
        };
      });
      return {
        sectionNumber: x.sectionNumber,
        sectionDescription: x.sectionDescription,
        requiredStandards: rsArr,
      } as ISectionIVA;
    });
    return formattedSections;
  }
  public formatIvaDefects(
    results: IIVADefect[],
    euVehicleCategory: string,
  ): INewDefectGETIVA {
    const vehiclecat = this.getEnumKeyByEnumValue(
      EUVehicleCategory,
      euVehicleCategory,
    );
    const basicSections: IIVADefect[] = results.filter((x) => {
      x.requiredStandards = x.requiredStandards.filter((dx) => {
        if (dx.basicInspection) {
          return dx;
        }
      });
      if (x.requiredStandards.length > 0) {
        return x;
      }
    });
    const normalSections: IIVADefect[] = results.filter((y) => {
      y.requiredStandards = y.requiredStandards.filter((dy) => {
        if (
          dy.normalInspection ||
          (!dy.basicInspection && !dy.normalInspection)
        ) {
          return dy;
        }
      });
      if (y.requiredStandards.length > 0) {
        return y;
      }
    });

    return {
      euVehicleCategory: vehiclecat,
      basic: this.formatInspectionTypes(basicSections),
      normal: this.formatInspectionTypes(normalSections),
    } as INewDefectGETIVA;
  }
}
