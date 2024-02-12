const mockValidateRequiredStandardsGetQuery = jest.fn();

jest.mock("../../../src/validators/required-standards/requiredStandardsGetValidator", () => ({
  validateRequiredStandardsGetQuery: mockValidateRequiredStandardsGetQuery,
}));

import { getRequiredStandards } from "../../../src/functions/getRequiredStandards";
import mockContext, { Context } from "aws-lambda";
import { RequiredStandardsService } from "../../../src/services/requiredStandardsService";
import { HTTPResponse } from "../../../src/models/HTTPResponse";
import { HTTPError } from "../../../src/models/HTTPError";
import RequiredStandards from "../../resources/iva-defects.json";

describe("getRequiredStandards Function", () => {
  const ctx = mockContext as Context;

  context("on successful retrieval of results", () => {
    it("returns 200 with data", async () => {
      mockValidateRequiredStandardsGetQuery.mockReturnValueOnce(undefined);
      jest
        .spyOn(RequiredStandardsService.prototype, "getRequiredStandardsByEUVehicleCategory")
        .mockReturnValue(Promise.resolve(RequiredStandards as any));
      const event = {
        queryStringParameters: {
          euVehicleCategory: "m1",
        },
      };

      const res = await getRequiredStandards(event, ctx, () => {
        return;
      });

      expect(res).toEqual(new HTTPResponse(200, RequiredStandards));
    });
  });

  context(
    "on validation failure returns expected client error status code",
    () => {
      it("returns 400 with errors", async () => {
        mockValidateRequiredStandardsGetQuery.mockReturnValueOnce({
          statusCode: 400,
          body: JSON.stringify({ errors: ["Fake Error"] }),
        });

        const event = {};

        const res = await getRequiredStandards(event, ctx, () => {
          return;
        });
        expect(res.statusCode).toEqual(400);
      });
    },
  );
  context("on an internal server error returns expected error code", () => {
    it("returns 500 with error", async () => {
      mockValidateRequiredStandardsGetQuery.mockReturnValueOnce(undefined);
      jest
        .spyOn(RequiredStandardsService.prototype, "getRequiredStandardsByEUVehicleCategory")
        .mockRejectedValue(new HTTPError(500, "Internal Server Error"));

      const event = {
        queryStringParameters: {
          euVehicleCategory: "m1",
        },
      };

      const res = await getRequiredStandards(event, ctx, () => {
        return;
      });
      expect(res).toEqual(new HTTPResponse(500, "Internal Server Error"));
    });
  });
});
