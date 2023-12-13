const mockValidateIvaDefectManualQuery = jest.fn();

jest.mock("../../../src/validators/iva/ivaDefectsByManualValidator", () => ({
  validateIvaDefectManualQuery: mockValidateIvaDefectManualQuery,
}));

import { getIvaDefectsByManual } from "../../../src/functions/getIvaDefectsByManual";
import mockContext, { Context } from "aws-lambda";
import { IvaDefectsService } from "../../../src/services/ivaDefectsService";
import { HTTPResponse } from "../../../src/models/HTTPResponse";
import { HTTPError } from "../../../src/models/HTTPError";
import IvaDefects from "../../resources/iva-defects.json";

describe("getIvaDefectsByManualId Function", () => {
  const ctx = mockContext as Context;

  context("on successful retrieval of results", () => {
    it("returns 200 with data", async () => {
      mockValidateIvaDefectManualQuery.mockReturnValueOnce(undefined);
      jest
        .spyOn(IvaDefectsService.prototype, "getIvaDefectsByEUVehicleCategory")
        .mockReturnValue(Promise.resolve(IvaDefects as any));
      const event = {
        pathParameters: {
          id: "M1",
        },
      };

      const res = await getIvaDefectsByManual(event, ctx, () => {
        return;
      });
      expect(res).toEqual(new HTTPResponse(200, IvaDefects));
    });

    it("returns 204 when no data was found", async () => {
      mockValidateIvaDefectManualQuery.mockReturnValueOnce(undefined);
      jest
        .spyOn(IvaDefectsService.prototype, "getIvaDefectsByEUVehicleCategory")
        .mockReturnValue(Promise.resolve([]));
      const event = {
        pathParameters: {
          id: "M1",
        },
      };

      const res = await getIvaDefectsByManual(event, ctx, () => {
        return;
      });
      expect(res).toEqual(new HTTPResponse(204, []));
    });
  });

  context(
    "on validation failure returns expected client error status code",
    () => {
      it("returns 400 with errors", async () => {
        mockValidateIvaDefectManualQuery.mockReturnValueOnce({
          statusCode: 400,
          body: JSON.stringify({ errors: ["Fake Error"] }),
        });
        jest
          .spyOn(
            IvaDefectsService.prototype,
            "getIvaDefectsByEUVehicleCategory",
          )
          .mockReturnValue(Promise.resolve([]));
        const event = {
          pathParameters: {
            id: "M1",
          },
        };

        const res = await getIvaDefectsByManual(event, ctx, () => {
          return;
        });
        expect(res.statusCode).toEqual(400);
      });
    },
  );
  context("on an internal server error returns expected error code", () => {
    it("returns 500 with error", async () => {
      mockValidateIvaDefectManualQuery.mockReturnValueOnce(undefined);
      jest
        .spyOn(IvaDefectsService.prototype, "getIvaDefectsByEUVehicleCategory")
        .mockReturnValue(
          Promise.reject(new HTTPError(500, "Internal Server Error")),
        );
      const res = await getIvaDefectsByManual(null, ctx, () => {
        return;
      });
      expect(res).toEqual(new HTTPResponse(500, "Internal Server Error"));
    });
  });
});
