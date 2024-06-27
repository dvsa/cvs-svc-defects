import RequiredStandards from "../../resources/iva-defects.json";
import { RequiredStandardsDatabaseService } from "../../../src/services/requiredStandardsDatabaseService";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

describe("Required Standards Database Service", () => {
  context("getDefectsByManualId", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it("should return expected results on a successful scan", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(ScanCommand).resolves({
        Items: RequiredStandards,
      });
      let target = new RequiredStandardsDatabaseService();
      const result = await target.getRequiredStandardsByEUVehicleCategory("M1");

      expect(result).toStrictEqual(RequiredStandards);
    });

    it("should return no results on a successful scan with no matches", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(ScanCommand).resolves({
        Items: [],
      });
      let target = new RequiredStandardsDatabaseService();
      const result = await target.getRequiredStandardsByEUVehicleCategory("M1");

      expect(result).toStrictEqual([]);
    });
  });
});
