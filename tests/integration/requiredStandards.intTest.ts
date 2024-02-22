import supertest from "supertest";
import requiredStandardsData from "../resources/iva-defects.json";
import { mockToken } from "../util/mockToken";

const url = "http://localhost:3001/";
const request = supertest(url);

describe("Defects Service", () => {
  describe("getRequiredStandardsByEUVehicleCategory", () => {
    context("when database is populated", () => {
      it("should return all defects in the database for a known euVehicleCategory", async () => {
        const expectedResponse = JSON.parse(
          JSON.stringify(requiredStandardsData),
        ).map((defect: { id: any }) => {
          delete defect.id;
          return defect;
        });
        await request
          .get("defects/required-standards?euVehicleCategory=m1")
          .set({ Authorization: mockToken })
          .then((res: any) => {
            expect(res.statusCode).toBe(200);
            expect(res.headers["access-control-allow-origin"]).toBe("*");
            expect(res.headers["access-control-allow-credentials"]).toBe(
              "true",
            );

            expect(res.body).not.toBeNull();
            expect(res.body?.euVehicleCategories?.at(0)).toBe("m1");
            expect(res.body?.basic?.length).toBe(49);
            expect(res.body?.normal?.length).toBe(51);
          });
      });

      it("should return a bad request response for an unknown euVehicleCategory", async () => {
        await request
          .get("defects/required-standards?euVehicleCategory=f1")
          .set({ Authorization: mockToken })
          .then((res: any) => {
            expect(res.statusCode).toBe(400);
            expect(res.headers["access-control-allow-origin"]).toBe("*");
            expect(res.headers["access-control-allow-credentials"]).toBe(
              "true",
            );
            expect(res.body).toBe("f1 is not a recognised EU Vehicle Category");
          });
      });

      it("should return a bad request response for a missing euVehicleCategory", async () => {
        await request
          .get("defects/required-standards")
          .set({ Authorization: mockToken })
          .then((res: any) => {
            expect(res.statusCode).toBe(400);
            expect(res.headers["access-control-allow-origin"]).toBe("*");
            expect(res.headers["access-control-allow-credentials"]).toBe(
              "true",
            );
            expect(res.body).toBe("euVehicleCategory required");
          });
      });

      it("a validation error should be produced where there multiple duplicated query parameters", async () => {
          const expectedResponse = JSON.parse(
              JSON.stringify(requiredStandardsData),
          ).map((defect: { id: any }) => {
              delete defect.id;
              return defect;
          });
          await request
              .get("defects/required-standards?euVehicleCategory=m1&euVehicleCategory=m1")
              .set({Authorization: mockToken})
              .then((res: any) => {
                  expect(res.statusCode).toBe(400);
                  expect(res.headers["access-control-allow-origin"]).toBe("*");
                  expect(res.headers["access-control-allow-credentials"]).toBe(
                      "true",
                  );

                  expect(res.body).not.toBeNull();
                  expect(res.body).toBe("Multiple EU Vehicle Categories are not allowed");
              });
        });
    });
  });
});
