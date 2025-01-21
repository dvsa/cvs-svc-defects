import { getDefects } from "../../src/functions/getDefects";
import { DefectsService } from "../../src/services/DefectsService";
import mockContext, { Context } from "aws-lambda";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { HTTPError } from "../../src/models/HTTPError";
import { IDefectParent, IItem } from '../../src/models/Defects';

describe("getDefects Function", () => {
  const ctx = mockContext as Context;

  context("on success of downstream services", () => {
    it("returns 200 with data", async () => {
      jest
        .spyOn(DefectsService.prototype, "getDefectList")
        .mockReturnValue(Promise.resolve([{
          imNumber: 0,
          imDescription: undefined,
          imDescriptionWelsh: undefined,
          forVehicleType: undefined,
          additionalInfo: undefined,
          items: [],
        }]));
      const res = await getDefects(null, ctx, () => {
        return;
      });
      expect(res).toEqual(new HTTPResponse(200,
        [{
          imNumber: 0,
          imDescription: undefined,
          imDescriptionWelsh: undefined,
          forVehicleType: undefined,
          additionalInfo: undefined,
          items: [],
        }]
      ));
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
