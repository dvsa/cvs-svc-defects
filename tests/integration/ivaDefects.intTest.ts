import supertest from "supertest";
import {emptyDatabase, populateDatabase} from "../util/dbOperations";
import ivaDefectsData from "../resources/iva-defects.json";
import {mockToken} from "../util/mockToken";

const url = "http://localhost:3001/";
const request = supertest(url);

describe("Defects Service", () => {
    describe("getIvaDefectsByManual", () => {
        context("when database is populated", () => {
            it("should return all defects in the database", async () => {
                // const expectedResponse = JSON.parse(JSON.stringify(ivaDefectsData))
                //   .map((defect: { id: any }) => {
                //     delete defect.id;
                //     return defect;
                //   })
                //   .sort(
                //     (first: { imNumber: number }, second: { imNumber: number }) =>
                //       first.imNumber - second.imNumber,
                //   );

                // await request
                //   .get("defects/iva/manual/M1")
                //   .set({ Authorization: mockToken })
                //   .then((res: any) => {
                //     expect(res.statusCode).toBe(200);
                //     expect(res.headers["access-control-allow-origin"]).toBe("*");
                //     expect(res.headers["access-control-allow-credentials"]).toBe(
                //       "true",
                //     );
                //     expect(res.body.length).toBe(expectedResponse.length);
            });
        });

        it("should return an empty array for unknown id", async () => {
            //   const expectedResponse = [];

            //   await request
            //     .get("defects/iva/manual/fakeId")
            //     .set({ Authorization: mockToken })
            //     .then((res: any) => {
            //       expect(res.statusCode).toBe(204);
            //       expect(res.headers["access-control-allow-origin"]).toBe("*");
            //       expect(res.headers["access-control-allow-credentials"]).toBe(
            //         "true",
            //       );
            //       expect(res.body.length).toBe(expectedResponse.length);
            //     });
            // });
        });
    });

    describe("getIvaDefects", () => {
        context("when database is populated", () => {
            //   it("should return all defects in the database", async () => {
            //     const expectedResponse = JSON.parse(JSON.stringify(ivaDefectsData))
            //       .map((defect: { id: any }) => {
            //         delete defect.id;
            //         return defect;
            //       })
            //       .sort(
            //         (first: { imNumber: number }, second: { imNumber: number }) =>
            //           first.imNumber - second.imNumber,
            //       );

            //     await request
            //       .get("defects/iva")
            //       .set({ Authorization: mockToken })
            //       .then((res: any) => {
            //         expect(res.statusCode).toBe(200);
            //         expect(res.headers["access-control-allow-origin"]).toBe("*");
            //         expect(res.headers["access-control-allow-credentials"]).toBe(
            //           "true",
            //         );
            //         expect(res.body.length).toBe(expectedResponse.length);
            //       });
            //   });
        });
    });
});
