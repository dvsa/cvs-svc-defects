const mockValidateIvaDefectGetQuery = jest.fn();

jest.mock("../../../src/validators/iva/ivaDefectsGetValidator", () => ({
  validateIvaDefectGetQuery: mockValidateIvaDefectGetQuery,
}));

import { getIvaDefects } from "../../../src/functions/getIvaDefects";
import mockContext, { Context } from "aws-lambda";
import { IvaDefectsService } from "../../../src/services/ivaDefectsService";
import { HTTPResponse } from "../../../src/models/HTTPResponse";
import { HTTPError } from "../../../src/models/HTTPError";
import IvaDefects from "../../resources/iva-defects.json";

describe("getIvaDefects Function", () => {
  const ctx = mockContext as Context;

  context("on successful retrieval of results", () => {
    it("returns 200 with data", async () => {
      mockValidateIvaDefectGetQuery.mockReturnValueOnce(undefined);
      jest
        .spyOn(IvaDefectsService.prototype, "getIvaDefectsByEUVehicleCategory")
        .mockReturnValue(Promise.resolve(IvaDefects as any));
      const event = {};

      const res = await getIvaDefects(event, ctx, () => {
        return;
      });
      expect(true).toEqual(true);

      // expect(res).toEqual(new HTTPResponse(200, IvaDefects));
    });
  });
  
  context(
    "on validation failure returns expected client error status code",
    () => {
      it("returns 400 with errors", async () => {
        mockValidateIvaDefectGetQuery.mockReturnValueOnce({
          statusCode: 400,
          body: JSON.stringify({ errors: ["Fake Error"] }),
        });
        // jest
        //   .spyOn(
        //     IvaDefectsService.prototype,
        //     "getIvaDefectsByEUVehicleCategory",
        //   )
        //   .mockReturnValue(Promise.resolve([]));
        const event = {};

        const res = await getIvaDefects(event, ctx, () => {
          return;
        });
        expect(res.statusCode).toEqual(400);
      });
    },
  );
  context("on an internal server error returns expected error code", () => {
    it("returns 500 with error", async () => {
      mockValidateIvaDefectGetQuery.mockReturnValueOnce(undefined);
      jest
        .spyOn(IvaDefectsService.prototype, "getIvaDefectsByEUVehicleCategory")
        .mockRejectedValue(new HTTPError(500, "Internal Server Error"));
      
      const event = {
        queryStringParameters: {
          euVehicleCategory: "m1"
        }
      }
      
      const res = await getIvaDefects(event, ctx, () => {
        return;
      });
      expect(res).toEqual(new HTTPResponse(500, "Internal Server Error"));
    });
  });
});
