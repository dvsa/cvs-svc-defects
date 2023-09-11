import { getDefects } from "../../src/functions/getDefects";
import { DefectsService } from "../../src/services/DefectsService";
import mockContext, { Context } from "aws-lambda";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { HTTPError } from "../../src/models/HTTPError";

describe("getDefects Function", () => {
  const ctx = mockContext as Context;

  context("on success of downstream services", () => {
    it("returns 200 with data", async () => {
      jest
        .spyOn(DefectsService.prototype, "getDefectList")
        .mockReturnValue(Promise.resolve("Success"));
      const res = await getDefects(null, ctx, () => {
        return;
      });
      expect(res).toEqual(new HTTPResponse(200, "Success"));
    });
  });

  context("on failure of downstream services", () => {
    it("returns 200 with data", async () => {
      jest
        .spyOn(DefectsService.prototype, "getDefectList")
        .mockReturnValue(Promise.reject(new HTTPError(418, "Failed")));
      const res = await getDefects(null, ctx, () => {
        return;
      });
      expect(res).toEqual(new HTTPResponse(418, "Failed"));
    });
  });
});
