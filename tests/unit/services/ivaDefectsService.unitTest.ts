/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/iva/defects/enums/euVehicleCategory.enum";
import { HTTPError } from "../../../src/models/HTTPError";
import { IvaDefectsService } from "../../../src/services/ivaDefectsService";
import IvaDefects from "../../resources/iva-defects.json";
import { IIVATaxonomySection } from "../../../src/models/IVADefect";

const mockGetDefectsByEUVehicleCategory = jest.fn();
const mockGetDefectsByCriteria = jest.fn();

describe("IVA Defects Service", () => {
  const ivaDatabaseService = {
    getDefectsByEUVehicleCategory: mockGetDefectsByEUVehicleCategory,
    getDefectsByCriteria: mockGetDefectsByCriteria,
  };
  let target = new IvaDefectsService(ivaDatabaseService as any);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe("formatIvaDefects", () => {
    it("should return a correctly formatted section with basic required standards only", () => {
      const taxonomySection: IIVATaxonomySection[] = [
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

      const result = target.formatIvaDefects(
        taxonomySection,
        EUVehicleCategory.M1,
      );

      expect(result?.euVehicleCategories?.at(0)).toBe("m1");
      expect(result?.basic?.at(0)?.sectionDescription).toBe("Noise");
      expect(result?.basic?.at(0)?.sectionNumber).toBe("01");
      expect(result?.basic?.at(0)?.requiredStandards.length).toBe(1);
      expect(result?.normal?.length).toBe(0);
    });

    it("should return a correctly formatted section with normal and basic required standards", () => {
      const taxonomySection: IIVATaxonomySection[] = [
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

      const result = target.formatIvaDefects(
        taxonomySection,
        EUVehicleCategory.M1,
      );

      expect(result?.euVehicleCategories?.at(0)).toBe("m1");
      expect(result?.normal?.at(0)?.sectionDescription).toBe("Noise");
      expect(result?.normal?.at(0)?.sectionNumber).toBe("01");
      expect(result?.normal?.at(0)?.requiredStandards.length).toBe(1);

      expect(result?.basic?.at(0)?.sectionDescription).toBe("Noise");
      expect(result?.basic?.at(0)?.sectionNumber).toBe("01");
      expect(result?.basic?.at(0)?.requiredStandards.length).toBe(1);
      expect(result?.basic?.length).toBe(1);
    });

    it("should return multiple correctly formatted sections with normal and basic required standards", () => {
      const taxonomySection: IIVATaxonomySection[] = [
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

      const result = target.formatIvaDefects(
        taxonomySection,
        EUVehicleCategory.M1,
      );

      expect(result?.euVehicleCategories?.at(0)).toBe("m1");
      expect(result?.normal?.length).toBe(1);
      expect(result?.normal?.at(0)?.sectionDescription).toBe("Noise");
      expect(result?.normal?.at(0)?.sectionNumber).toBe("01");
      expect(result?.normal?.at(0)?.requiredStandards.length).toBe(2);

      expect(result?.basic?.length).toBe(1);
      expect(result?.basic?.at(0)?.sectionDescription).toBe("Noise");
      expect(result?.basic?.at(0)?.sectionNumber).toBe("01");
      expect(result?.basic?.at(0)?.requiredStandards.length).toBe(2);
      expect(result?.basic?.length).toBe(1);
    });

    it("should return an empty array when provided empty taxonomy sections", () => {
      const taxonomySection: IIVATaxonomySection[] = [];
      const result = target.formatIvaDefects(
        taxonomySection,
        EUVehicleCategory.M1,
      );

      expect(result?.euVehicleCategories?.at(0)).toBe("m1");
      expect(result?.normal?.length).toBe(0);
      expect(result?.basic?.length).toBe(0);
    });

    it("should return correctly formatted required standards", () => {
      const taxonomySection: IIVATaxonomySection[] = [
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

      const result = target.formatIvaDefects(
        taxonomySection,
        EUVehicleCategory.M1,
      );
      const requiredStandards = result?.basic?.at(0)?.requiredStandards;
      const actual = requiredStandards?.at(0);

      expect(requiredStandards?.length).toBe(1);
      expect(actual?.rsNumber).toBe(1);
      expect(actual?.requiredStandard).toBe("A test standard");
      expect(actual?.refCalculation).toBe("1.1");
      expect(actual?.additionalInfo).toBe(true);
    });
  });

  describe("getIvaDefectsByEUVehicleCategory", () => {
    it("should return expected number of normal sections upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(IvaDefects);

      const result = await target.getIvaDefectsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.normal?.length).toBe(629);
    });

    it("should return expected number of basic sections upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(IvaDefects);

      const result = await target.getIvaDefectsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.basic?.length).toBe(96);
    });

    it("should return expected number of eu vehicle categories upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(IvaDefects);

      const result = await target.getIvaDefectsByEUVehicleCategory(
        EUVehicleCategory.M1,
      );

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.euVehicleCategories?.length).toBe(1);
      expect(result?.euVehicleCategories.at(0)).toBe(EUVehicleCategory.M1);
    });

    it("should return an empty basic array upon successfully finding no search results", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce([]);
      const result = await target.getIvaDefectsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.basic.length).toBe(0);
    });

    it("should return an empty normal array upon successfully finding no search results", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce([]);
      const result = await target.getIvaDefectsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.normal.length).toBe(0);
    });

    it("should throw a 500 http error upon encountering a generic error", async () => {
      mockGetDefectsByEUVehicleCategory.mockRejectedValueOnce(
        new Error("Fake Error"),
      );
      const actualError = new HTTPError(500, "Internal Server Error");
      expect(async () => {
        await target.getIvaDefectsByEUVehicleCategory("M1");
      }).rejects.toEqual(actualError);
    });
  });
});
