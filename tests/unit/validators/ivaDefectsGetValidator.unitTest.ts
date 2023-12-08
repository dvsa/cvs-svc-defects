import { APIGatewayProxyEvent } from "aws-lambda";
import { validateIvaDefectGetQuery } from "../../../src/validators/iva/ivaDefectsGetValidator";
import { mockToken } from "../../util/mockToken";

describe("test the iva defect by get query error validator", () => {
  it("should return Missing authorization header", () => {
    const event = {
      headers: {},
    };
    const res = validateIvaDefectGetQuery(
      event as unknown as APIGatewayProxyEvent,
    );
    expect(res).toEqual({
      statusCode: 400,
      body: "Missing authorization header",
    });
  });

  it("should return undefined when no errors", () => {
    const event = {
      headers: {
        Authorization: mockToken,
      },
    };
    const res = validateIvaDefectGetQuery(
      event as unknown as APIGatewayProxyEvent,
    );
    expect(res).toBeUndefined();
  });
});
