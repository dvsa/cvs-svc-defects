import {EUVehicleCategory} from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import {IvaDatabaseService} from "./ivaDatabaseService";
import {HTTPError} from "../models/HTTPError";
import {IIVADefect} from "../models/IVADefect";
import {DefectGETIVA, InspectionType} from "@dvsa/cvs-type-definitions/types/iva/defects/get";


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
   * @param onlyBasicInspection
   * @returns Array of IVA Defects
   */
  public async getIvaDefectsByEUVehicleCategory(
    euVehicleCategory: string,
    onlyBasicInspection: boolean,
  ): Promise<DefectGETIVA[]> {
    try {
      const results =
        (await this.ivaDatabaseService.getDefectsByEUVehicleCategory(
            euVehicleCategory,
        )) as IIVADefect[];

      return this.formatIvaDefects(results, onlyBasicInspection);
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

    public formatIvaDefects(results: IIVADefect[], onlyBasicInspection: boolean): DefectGETIVA[] {
      const res = results.map((x) => {
            const vehicleCategory = this.getEnumKeyByEnumValue(
                EUVehicleCategory,
                x.euVehicleCategory,
            );

            const rsArray = [];
            for (const rs of x.requiredStandards) {

                if (onlyBasicInspection) {
                    const inspectionTypes = rs.normalInspection && rs.basicInspection ? ["normal", "basic"] as InspectionType[] : rs.basicInspection ? ["basic"] as InspectionType[] : [];
                    if (inspectionTypes.length > 0) {
                        rsArray.push({
                            rsNumber: parseInt(rs.rsNumber, 10),
                            requiredStandard: rs.requiredStandard,
                            refCalculation: rs.refCalculation,
                            additionalInfo: rs.additionalInfo,
                            inspectionTypes
                        });
                    }

                } else if (!onlyBasicInspection) {
                    rsArray.push({
                        rsNumber: parseInt(rs.rsNumber, 10),
                        requiredStandard: rs.requiredStandard,
                        refCalculation: rs.refCalculation,
                        additionalInfo: rs.additionalInfo,
                        inspectionTypes: rs.normalInspection && rs.basicInspection ? ["normal", "basic"] as InspectionType[] :
                            rs.basicInspection ? ["basic"] as InspectionType[] :
                                rs.normalInspection ? ["normal"] as InspectionType[] : [] as InspectionType[],
                    });
                }
            }

            const mappedDefectSection: DefectGETIVA = {
                    euVehicleCategories: [EUVehicleCategory[vehicleCategory]],
                    sectionNumber: x.sectionNumber,
                    sectionDescription: x.sectionDescription,
                    requiredStandards: rsArray
                };
            if (mappedDefectSection.requiredStandards) {
                return mappedDefectSection;
            } else {
                return {} as DefectGETIVA;
            }
        });
      return res.filter((x) => x.requiredStandards.length > 0);
    }
}
