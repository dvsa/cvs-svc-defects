/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import AWS from "aws-sdk";
import IvaDefects from "../../resources/iva-defects.json";
import { IvaDatabaseService } from "../../../src/services/ivaDatabaseService";

describe("IVA Database Service", () => {
  context("getDefectsByManualId", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it("should return expected results on a successful scan", async () => {
      mockDocumentClientWithReturn({
        Items: IvaDefects,
      });
      let target = new IvaDatabaseService();
      const result = await target.getDefectsByEUVehicleCategory("M1");

      expect(result).toStrictEqual(IvaDefects);
    });

    it("should return no results on a successful scan with no matches", async () => {
      mockDocumentClientWithReturn({
        Items: [],
      });
      let target = new IvaDatabaseService();
      const result = await target.getDefectsByEUVehicleCategory("M1");

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
