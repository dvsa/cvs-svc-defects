/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/required-standards/defects/enums/euVehicleCategory.enum";
import { HTTPError } from "../../../src/models/HTTPError";
import { RequiredStandardsService } from "../../../src/services/requiredStandardsService";
import RequiredStandards from "../../resources/iva-defects.json";
import { ITaxonomySectionRequiredStandards } from "../../../src/models/ITaxonomySectionRequiredStandards";
import { RequiredStandardsDatabaseService } from "../../../src/services/requiredStandardsDatabaseService";

const mockGetDefectsByEUVehicleCategory = jest.fn();

describe("required standards  Service", () => {
  let target: RequiredStandardsService;
  let mockRequiredStandardsDatabaseService: Partial<RequiredStandardsDatabaseService>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockRequiredStandardsDatabaseService = {
      getRequiredStandardsByEUVehicleCategory:
        mockGetDefectsByEUVehicleCategory,
    };
    target = new RequiredStandardsService(
      mockRequiredStandardsDatabaseService as RequiredStandardsDatabaseService,
    );
    jest.resetModules();
  });

  describe("formatRequiredStandards", () => {
    it("should return a correctly formatted section with basic required standards only", () => {
      const taxonomySection: ITaxonomySectionRequiredStandards[] = [
        {
          euVehicleCategory: "m1",
          sectionNumber: "01",
          sectionDescription: "Noise",
          requiredStandards: [
            {
              rsNumber: "1",
              requiredStandard: "A test standard",
              refCalculation: "1.1",
              additionalInfo: true,
              basicInspection: true,
              normalInspection: false,
            },
          ],
        },
      ];

      const result = target.formatRequiredStandards(
        taxonomySection,
        EUVehicleCategory.M1,
      );

      expect(result).toEqual({
        euVehicleCategories: ["m1"],
        basic: [
          {
            requiredStandards: [
              {
                additionalInfo: true,
                inspectionTypes: ["basic"],
                refCalculation: "1.1",
                requiredStandard: "A test standard",
                rsNumber: 1,
              },
            ],
            sectionDescription: "Noise",
            sectionNumber: "01",
          },
        ],
        normal: [],
      });
    });

    it("should return a correctly formatted section with normal and basic required standards", () => {
      const taxonomySection: ITaxonomySectionRequiredStandards[] = [
        {
          euVehicleCategory: "m1",
          sectionNumber: "01",
          sectionDescription: "Noise",
          requiredStandards: [
            {
              rsNumber: "1",
              requiredStandard: "A test standard",
              refCalculation: "1.1",
              additionalInfo: true,
              basicInspection: true,
              normalInspection: true,
            },
          ],
        },
      ];

      const result = target.formatRequiredStandards(
        taxonomySection,
        EUVehicleCategory.M1,
      );

      expect(result).toEqual({
        euVehicleCategories: ["m1"],
        basic: [
          {
            requiredStandards: [
              {
                additionalInfo: true,
                inspectionTypes: ["basic", "normal"],
                refCalculation: "1.1",
                requiredStandard: "A test standard",
                rsNumber: 1,
              },
            ],
            sectionDescription: "Noise",
            sectionNumber: "01",
          },
        ],
        normal: [
          {
            requiredStandards: [
              {
                additionalInfo: true,
                inspectionTypes: ["basic", "normal"],
                refCalculation: "1.1",
                requiredStandard: "A test standard",
                rsNumber: 1,
              },
            ],
            sectionDescription: "Noise",
            sectionNumber: "01",
          },
        ],
      });
    });

    it("should return multiple correctly formatted sections with normal and basic required standards", () => {
      const taxonomySection: ITaxonomySectionRequiredStandards[] = [
        {
          euVehicleCategory: "m1",
          sectionNumber: "01",
          sectionDescription: "Noise",
          requiredStandards: [
            {
              rsNumber: "1",
              requiredStandard: "A test standard",
              refCalculation: "1.1",
              additionalInfo: true,
              basicInspection: true,
              normalInspection: true,
            },
            {
              rsNumber: "1",
              requiredStandard: "Another test standard",
              refCalculation: "1.1",
              additionalInfo: true,
              basicInspection: true,
              normalInspection: true,
            },
          ],
        },
      ];

      const result = target.formatRequiredStandards(
        taxonomySection,
        EUVehicleCategory.M1,
      );

      expect(result).toEqual({
        euVehicleCategories: ["m1"],
        basic: [
          {
            requiredStandards: [
              {
                additionalInfo: true,
                inspectionTypes: ["basic", "normal"],
                refCalculation: "1.1",
                requiredStandard: "A test standard",
                rsNumber: 1,
              },
              {
                additionalInfo: true,
                inspectionTypes: ["basic", "normal"],
                refCalculation: "1.1",
                requiredStandard: "Another test standard",
                rsNumber: 1,
              },
            ],
            sectionDescription: "Noise",
            sectionNumber: "01",
          },
        ],
        normal: [
          {
            requiredStandards: [
              {
                additionalInfo: true,
                inspectionTypes: ["basic", "normal"],
                refCalculation: "1.1",
                requiredStandard: "A test standard",
                rsNumber: 1,
              },
              {
                additionalInfo: true,
                inspectionTypes: ["basic", "normal"],
                refCalculation: "1.1",
                requiredStandard: "Another test standard",
                rsNumber: 1,
              },
            ],
            sectionDescription: "Noise",
            sectionNumber: "01",
          },
        ],
      });
    });

    it("should return an empty array when provided empty taxonomy sections", () => {
      const taxonomySection: ITaxonomySectionRequiredStandards[] = [];
      const result = target.formatRequiredStandards(
        taxonomySection,
        EUVehicleCategory.M1,
      );

      expect(result).toEqual({
        euVehicleCategories: ["m1"],
        basic: [],
        normal: [],
      });
    });

    it("should return correctly formatted required standards", () => {
      const taxonomySection: ITaxonomySectionRequiredStandards[] = [
        {
          euVehicleCategory: "m1",
          sectionNumber: "01",
          sectionDescription: "Noise",
          requiredStandards: [
            {
              rsNumber: "1",
              requiredStandard: "A test standard",
              refCalculation: "1.1",
              additionalInfo: true,
              basicInspection: true,
              normalInspection: false,
            },
          ],
        },
      ];

      const result = target.formatRequiredStandards(
        taxonomySection,
        EUVehicleCategory.M1,
      );

      const requiredStandards = result?.basic?.at(0)?.requiredStandards;
      const actual = requiredStandards?.at(0);

      expect(requiredStandards?.length).toBe(1);

      expect(actual).toEqual({
        rsNumber: 1,
        requiredStandard: "A test standard",
        inspectionTypes: ["basic"],
        refCalculation: "1.1",
        additionalInfo: true,
      });
    });
  });

  describe("getRequiredStandardsByEUVehicleCategory", () => {
    it("should return expected number of normal sections upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(
        RequiredStandards,
      );

      const result = await target.getRequiredStandardsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.normal?.length).toBe(629);
    });

    it("should return expected number of basic sections upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(
        RequiredStandards,
      );

      const result = await target.getRequiredStandardsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.basic?.length).toBe(96);
    });

    it("should return expected number of eu vehicle categories upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(
        RequiredStandards,
      );

      const result = await target.getRequiredStandardsByEUVehicleCategory(
        EUVehicleCategory.M1,
      );

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.euVehicleCategories?.length).toBe(1);
      expect(result?.euVehicleCategories.at(0)).toBe(EUVehicleCategory.M1);
    });

    it("should return an empty basic array upon successfully finding no search results", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce([]);
      const result = await target.getRequiredStandardsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.basic.length).toBe(0);
    });

    it("should return an empty normal array upon successfully finding no search results", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce([]);
      const result = await target.getRequiredStandardsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.normal.length).toBe(0);
    });

    it("should throw a 500 http error upon encountering a generic error", async () => {
      mockGetDefectsByEUVehicleCategory.mockRejectedValueOnce(
        new Error("Fake Error"),
      );
      const actualError = new HTTPError(500, "Internal Server Error");
      await expect(
        target.getRequiredStandardsByEUVehicleCategory(EUVehicleCategory.M1),
      ).rejects.toThrow(HTTPError);
    });
  });
});
