import LambdaTester from "lambda-tester";
// import { getDefects } from "../../src/functions/getDefects";
import { handler } from "../../src/handler";
import {expect} from "chai";

describe("getDefects", () => {
  it("should return a promise", async () => {
    const lambda = LambdaTester(handler);
    return lambda.expectResolve((response: any) => {
      expect(response).to.exist;
    });
  });
});
