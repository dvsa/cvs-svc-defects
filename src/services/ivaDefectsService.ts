import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import { IvaDatabaseService } from "./ivaDatabaseService";
import { HTTPError } from "../models/HTTPError";
import { IIVATaxonomySection } from "../models/IVADefect";
import {
  DefectGETIVA,
  InspectionType,
  SectionIVA,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get";
import { IRequiredStandard } from "../models/RequiredStandard";
import { result } from "lodash";

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

  public getEnumKeyByEnumValue<T extends { [index: string]: string }>(
    myEnum: T,
    enumValue: string,
  ): keyof T {
    const keys = Object.keys(myEnum).filter((x) => myEnum[x] === enumValue);
    return keys[0];
  }

  public formatInspectionTypes(sections: IIVATaxonomySection[]): SectionIVA[] {
    const formattedSections: SectionIVA[] = sections.map((x) => {
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
      } as SectionIVA;
    });
    return formattedSections;
  }
  public formatIvaDefects(
    results: IIVATaxonomySection[],
    euVehicleCategory: string,
  ): DefectGETIVA {
    const vehiclecat = this.getEnumKeyByEnumValue(
      EUVehicleCategory,
      euVehicleCategory,
    );

    const basicSections: IIVATaxonomySection[] = [];
    const normalSections: IIVATaxonomySection[] = [];
    results.forEach((x) => {
      const basicStandards: IRequiredStandard[] = [];
      const normalStandards: IRequiredStandard[] = [];
      x.requiredStandards.forEach((rs) => {
        if (rs.basicInspection) {
          basicStandards.push(rs);
        }
        if (rs.normalInspection) {
          normalStandards.push(rs);
        }
        if (!rs.basicInspection && !rs.normalInspection) {
          normalStandards.push(rs);
        }
      });

      const rsArr: IRequiredStandard[] = [];

      if (normalStandards.length > 0) {
        x.requiredStandards = normalStandards;
        normalSections.push(x);
      }
      if (basicStandards.length > 0) {
        x.requiredStandards = basicStandards;
        basicSections.push(x);
      }
    });

    // const basicSections: SectionIVA[] = []
    // const normalSections: SectionIVA[] = []

    // results.forEach(dBRow=>{
    //   let basic: SectionIVA = {}

    //   dBRow.requiredStandards.forEach(rs=>{
    //     let basic = {
    //       rsNumber: parseInt(rs.rsNumber, 10),
    //       requiredStandard: rs.requiredStandard,
    //       refCalculation: rs.refCalculation,
    //       additionalInfo: rs.additionalInfo,
    //       inspectionTypes:
    //         rs.normalInspection && rs.basicInspection
    //           ? (["basic", "normal"] as InspectionType[])
    //           : rs.basicInspection
    //           ? (["basic"] as InspectionType[])
    //           : (["normal"] as InspectionType[]),
    //     }
    //     }
    //   })

    // })

    // const basicSections: IIVATaxonomySection[] = results.filter((x) => {
    //   x.requiredStandards = x.requiredStandards.filter((rs) => {
    //     if (rs.basicInspection) {
    //       return rs;
    //     }
    //   });
    //   if (x.requiredStandards.length > 0) {
    //     return x;
    //   }
    // });

    // const normalSections: IIVATaxonomySection[] = results.filter((y) => {
    //   y.requiredStandards = y.requiredStandards.filter((dy) => {
    //     if (
    //       dy.normalInspection ||
    //       (!dy.basicInspection && !dy.normalInspection)
    //     ) {
    //       return dy;
    //     }
    //   });
    //   if (y.requiredStandards.length > 0) {
    //     return y;
    //   }
    // });

    return {
      basic: this.formatInspectionTypes(basicSections),
      normal: this.formatInspectionTypes(normalSections),
    } as DefectGETIVA;
  }
}
