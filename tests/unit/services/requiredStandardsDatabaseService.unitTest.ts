/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import AWS from "aws-sdk";
import RequiredStandards from "../../resources/iva-defects.json";
import { RequiredStandardsDatabaseService } from "../../../src/services/requiredStandardsDatabaseService";

describe("Required Standards Database Service", () => {
  context("getDefectsByManualId", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it("should return expected results on a successful scan", async () => {
      mockDocumentClientWithReturn({
        Items: RequiredStandards,
      });
      let target = new RequiredStandardsDatabaseService();
      const result = await target.getRequiredStandardsByEUVehicleCategory("M1");

      expect(result).toStrictEqual(RequiredStandards);
    });

    it("should return no results on a successful scan with no matches", async () => {
      mockDocumentClientWithReturn({
        Items: [],
      });
      let target = new RequiredStandardsDatabaseService();
      const result = await target.getRequiredStandardsByEUVehicleCategory("M1");

      expect(result).toStrictEqual([]);
    });
  });
});

function mockDocumentClientWithReturn(retVal: any) {
  AWS.DynamoDB.DocumentClient.prototype.scan = jest
    .fn()
    .mockImplementation(() => {
      return {
        promise: () => Promise.resolve(retVal),
      };
    });
}
