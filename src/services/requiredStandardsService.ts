import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import { RequiredStandardsDatabaseService as RequiredStandardDatabaseService } from "./requiredStandardsDatabaseService";
import { HTTPError } from "../models/HTTPError";
import { ITaxonomySectionRequiredStandards } from "../models/ITaxonomySectionRequiredStandards";
import {
  DefectGETRequiredStandards,
  InspectionType,
  RequiredStandard,
  RequiredStandardTaxonomySection,
} from "@dvsa/cvs-type-definitions/types/required-standards/defects/get";
import { IRequiredStandard } from "../models/RequiredStandard";

export class RequiredStandardsService {
  public readonly requiredStandrdDatabaseService: RequiredStandardDatabaseService;

  /**
   * Constructor for the RequiredStandardsService class
   * @param requiredStandardDatabaseService the required standard database service
   */
  constructor(
    requiredStandardDatabaseService: RequiredStandardDatabaseService,
  ) {
    this.requiredStandrdDatabaseService = requiredStandardDatabaseService;
  }

  /**
   * Retrieves required standards based on the provided euVehicleCategory and formats the response
   * @param euVehicleCategory the EU Vehicle Category, e.g M1, N1, MSVA
   * @returns Arrays of required standards, grouped by inspection type
   */
  public async getRequiredStandardsByEUVehicleCategory(
    euVehicleCategory: string,
  ): Promise<DefectGETRequiredStandards> {
    try {
      const results =
        (await this.requiredStandrdDatabaseService.getRequiredStandardsByEUVehicleCategory(
          euVehicleCategory,
        )) as ITaxonomySectionRequiredStandards[];

      return this.formatRequiredStandards(results, euVehicleCategory);
    } catch (error: any) {
      const httpError =
        error instanceof HTTPError
          ? error
          : new HTTPError(500, "Internal Server Error");
      console.error(httpError);
      throw httpError;
    }
  }

  /**
   * Formats results from the database into the eventual structure returned by the API
   * @param results array of ITaxonomySectionRequiredStandards objects as returned from DynamoDb
   * @param euVehicleCategory the EU Vehicle Category, e.g M1, N1, MSVA
   * @returns Arrays of required standards, grouped by inspection type
   */
  public formatRequiredStandards(
    results: ITaxonomySectionRequiredStandards[],
    euVehicleCategory: string,
  ): DefectGETRequiredStandards {
    const categoryEnumKey = getEnumKeyByValue(EUVehicleCategory, euVehicleCategory);

    return {
      euVehicleCategories: [
        categoryEnumKey ? EUVehicleCategory[categoryEnumKey] : undefined
      ],
      basic: this.formatSections(results, (x) => x.basicInspection),
      normal: this.formatSections(
          results,
          (x) => x.normalInspection || (!x.normalInspection && !x.basicInspection)
      ),
    } as unknown as DefectGETRequiredStandards;
  }

  /**
   * Formats each section of a taxonomy into the format returned by the API. Removes any sections that do not contain any required standards.
   * @param results array of ITaxonomySectionRequiredStandards objects as returned from DynamoDb
   * @param filterExpression expression used to filter required standards in each section
   * @returns Arrays of required standard taxonomy sections, with required standards filtered by the filter expression
   */
  private formatSections(
    results: ITaxonomySectionRequiredStandards[],
    filterExpression: (x: IRequiredStandard) => boolean,
  ): RequiredStandardTaxonomySection[] {
    return results.flatMap((section) => {
      const standards = section.requiredStandards
        .filter(filterExpression)
        .map(
          ({
            rsNumber,
            requiredStandard,
            refCalculation,
            additionalInfo,
            basicInspection,
            normalInspection,
          }) => {
            return {
              rsNumber: parseInt(rsNumber, 10),
              requiredStandard,
              refCalculation,
              additionalInfo,
              inspectionTypes: [
                ...(basicInspection ? ["basic" as InspectionType] : []),
                ...(normalInspection ? ["normal" as InspectionType] : []),
              ],
            } as RequiredStandard;
          },
        );

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

/**
 * Generic function to retrieve the enum key corresponding to a given string value using a case insensitive search.
 *
 * @param enumObj
 * @param value
 * @returns {keyof E | null}
 */
const getEnumKeyByValue = <E extends Record<string, string>>(enumObj: E, value: string): keyof E | null => (Object.keys(enumObj).find(
    (key) => enumObj[key].toLowerCase() === value.toLowerCase()
) as keyof E | null);

