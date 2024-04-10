import { BatchWriteCommand, BatchWriteCommandOutput, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DefectsDAO } from "../../src/models/DefectsDAO";
import { mockClient } from "aws-sdk-client-mock";

describe("DefectsDAO", () => {
  context("GeneratePartialParams", () => {
    it("should return a basic object with the right table name", () => {
      const dao = new DefectsDAO();
      const partial = dao.generatePartialParams();
      expect(partial).toEqual({
        RequestItems: { [`cvs-${process.env.BRANCH}-defects`]: [] },
      });
    });
  });

  context("createMultiple", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    it("correctly processes an array of inputs", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(BatchWriteCommand).resolves("Success" as unknown as BatchWriteCommandOutput);
      const dao = new DefectsDAO();
      const output = await dao.createMultiple([{ input: "something" }]);
      expect(output).toBe("Success");
    });
  });

  context("deleteMultiple", () => {
    beforeEach(() => {
      jest.resetModules();
    });
    it("correctly processes an array of inputs", async () => {
      const mockDynamoClient = mockClient(DynamoDBDocumentClient);
      mockDynamoClient.on(BatchWriteCommand).resolves("Success" as unknown as BatchWriteCommandOutput);
      const dao = new DefectsDAO();
      const output = await dao.deleteMultiple(["something"]);
      expect(output).toBe("Success");
    });
  });
});

// function mockDocumentClientWithReturn(retVal: any) {
//   AWS.DynamoDB.DocumentClient.prototype.batchWrite = jest
//     .fn()
//     .mockImplementation(() => {
//       return {
//         promise: () => Promise.resolve(retVal),
//       };
//     });
// }
