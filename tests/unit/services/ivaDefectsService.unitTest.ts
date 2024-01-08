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

  describe("getIvaDefectsByManualId", () => {
    it("should return expected number of normal sections upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(IvaDefects);

      const result = await target.getIvaDefectsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.normal?.length === 96);
    });

    it("should return expected number of basic sections upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(IvaDefects);

      const result = await target.getIvaDefectsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.basic?.length === 96);
    });

    it("should return expected number of eu vehicle categories upon successful result", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce(IvaDefects);

      const result = await target.getIvaDefectsByEUVehicleCategory(EUVehicleCategory.M1);

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.basic?.length === 1);
      expect(result?.euVehicleCategories.at(0) === EUVehicleCategory.M1);
    });

    it("should return an empty basic array upon successfully finding no search results", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce([]);
      const result = await target.getIvaDefectsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.basic.length === 0);
    });

    it("should return an empty normal array upon successfully finding no search results", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce([]);
      const result = await target.getIvaDefectsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.normal.length === 0);
    });

    it("should return an empty eu vehicle category array upon successfully finding no search results", async () => {
      mockGetDefectsByEUVehicleCategory.mockResolvedValueOnce([]);
      const result = await target.getIvaDefectsByEUVehicleCategory("M1");

      expect(mockGetDefectsByEUVehicleCategory).toHaveBeenCalledTimes(1);
      expect(result?.euVehicleCategories.length === 0);
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
