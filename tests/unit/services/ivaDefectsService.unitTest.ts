/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { EUVehicleCategory } from "@dvsa/cvs-type-definitions/types/iva/defects/enums/euVehicleCategory.enum";
import { HTTPError } from "../../../src/models/HTTPError";
import { IvaDefectsService } from "../../../src/services/ivaDefectsService";
import IvaDefects from "../../resources/iva-defects.json";

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

    it("should return a correctly formatted section upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(IvaDefects);

      const result = await target.getIvaDefectsByEUVehicleCategory("M1");
      const resultSection = result?.normal?.at(0);

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(resultSection?.sectionNumber).toBe("01");
      expect(resultSection?.sectionDescription).toBe("Noise");
      expect(resultSection?.requiredStandards?.length).toBe(6);
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
