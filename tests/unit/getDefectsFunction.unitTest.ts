import {getDefects} from "../../src/functions/getDefects";
import {DefectsService} from "../../src/services/DefectsService";
import sinon from "sinon";
import mockContext from "aws-lambda-mock-context";
import {expect} from "chai";
import {HTTPResponse} from "../../src/models/HTTPResponse";
import {HTTPError} from "../../src/models/HTTPError";
const sandbox = sinon.createSandbox();

describe("getDefects Function", () => {
    let ctx = mockContext();
    afterEach(() => {sandbox.restore(); });

    context("on success of downstream services", () => {
        it("returns 200 with data", async () => {
           sandbox.stub(DefectsService.prototype, "getDefectList").resolves("Success");
           const res = await getDefects(null, ctx, () => {return; });
           expect(res).to.deep.equal(new HTTPResponse(200, "Success"));
        });
    });

    context("on failure of downstream services", () => {
        it("returns 200 with data", async () => {
            sandbox.stub(DefectsService.prototype, "getDefectList").rejects(new HTTPError(418, "Failed"));
            const res = await getDefects(null, ctx, () => {return; });
            expect(res).to.deep.equal(new HTTPResponse(418, "Failed"));
        });
    });
});
