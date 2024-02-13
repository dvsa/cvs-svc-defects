import { APIGatewayProxyEvent } from "aws-lambda";
import { validateRequiredStandardsGetQuery } from "../../../src/validators/required-standards/requiredStandardsGetValidator";
import { mockToken } from "../../util/mockToken";

describe("The required standards get query error validator", () => {
  it("should return Missing authorization header", () => {
    const event = {
      headers: {},
    };
    const res = validateRequiredStandardsGetQuery(
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
    const res = validateRequiredStandardsGetQuery(
      event as unknown as APIGatewayProxyEvent,
    );
    expect(res).toBeUndefined();
  });
});
