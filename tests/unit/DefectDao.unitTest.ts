import { DefectsDAO } from "../../src/models/DefectsDAO";
import AWS from "aws-sdk";

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
      mockDocumentClientWithReturn("Success");
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
      mockDocumentClientWithReturn("Success");
      const dao = new DefectsDAO();
      const output = await dao.deleteMultiple(["something"]);
      expect(output).toBe("Success");
    });
  });
});

function mockDocumentClientWithReturn(retVal: any) {
  AWS.DynamoDB.DocumentClient.prototype.batchWrite = jest
    .fn()
    .mockImplementation(() => {
      return {
        promise: () => Promise.resolve(retVal),
      };
    });
}
