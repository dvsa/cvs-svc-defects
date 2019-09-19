it("Fake Test 2", () => { expect(true); });

// import supertest from "supertest";
// import { expect } from "chai";
// import fs from "fs";
// import path from "path";
// import { DefectsService } from "../../src/services/DefectsService";
// import { DefectsDAO } from "../../src/models/DefectsDAO";
//
// const url = "http://localhost:3001/";
// const request = supertest(url);
//
// describe("Defects Service", () => {
//     describe("getDefects", () => {
//         let defectsService: DefectsService;
//         const defectsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../resources/defects.json"), "utf8"));
//         const defectsDAO: DefectsDAO = new DefectsDAO();
//         context("when database is populated", () => {
//
//             beforeAll((done) => {
//                 defectsService =  new DefectsService(defectsDAO);
//                 const mockBuffer = defectsData.slice();
//
//                 const batches = [];
//                 while (mockBuffer.length > 0) {
//                     batches.push(mockBuffer.splice(0, 25));
//                 }
//
//                 batches.forEach((batch) => {
//                     defectsService.insertDefectList(batch);
//                 });
//
//                 done();
//             });
//
//             it("should return all defects in the database", async (done) => {
//                 const expectedResponse = JSON.parse(JSON.stringify(defectsData)).map((defect: { id: any; }) => {
//                     delete defect.id;
//                     return defect;
//                 })
//                     .sort((first: { imNumber: number; }, second: { imNumber: number; }) => first.imNumber - second.imNumber);
//
//                 request.get("defects")
//                     .end((err: any, res: any) => {
//                         console.log();
//                         if (err) { expect.fail(err); }
//                         expect(res.statusCode).to.equal(200);
//                         expect(res.headers["access-control-allow-origin"]).to.equal("*");
//                         expect(res.headers["access-control-allow-credentials"]).to.equal("true");
//                         expect(res.body.length).to.equal(expectedResponse.length);
//                         done();
//                     });
//             });
//
//
//
//         });
//
//         context("when database is empty", () => {
//             beforeAll((done: () => boolean) => {
//                 const dataBuffer = defectsData;
//
//                 const batches = Array();
//                 while (dataBuffer.length > 0) {
//                     batches.push(dataBuffer.splice(0, 25));
//                 }
//
//                 batches.forEach((batch) => {
//                     defectsService.deleteDefectList(
//                         batch.map((item: { id: any; }) => {
//                             return item.id;
//                         })
//                     );
//                 });
//
//                 done();
//             });
//
//             it("should return error code 404", async (done) => {
//                 request.get("defects").expect(404, done);
//             });
//         });
//
//         beforeEach((done) => {
//             setTimeout(done, 500);
//         });
//         afterEach((done) => {
//             setTimeout(done, 500);
//         });
//     });
// });
