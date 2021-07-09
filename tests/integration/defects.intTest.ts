import supertest from "supertest";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";
import defectsData from "../resources/defects.json";

const url = "http://localhost:3001/";
const request = supertest(url);

describe("Defects Service", () => {
  beforeAll(async () => {
    await emptyDatabase();
  });

  beforeEach(async () => {
    await populateDatabase();
  });

  afterEach(async () => {
    await emptyDatabase();
  });

  afterAll(async () => {
    await populateDatabase();
  });

  describe("getDefects", () => {
    context("when database is populated", () => {
      it("should return all defects in the database", async () => {
        const expectedResponse = JSON.parse(JSON.stringify(defectsData))
          .map((defect: { id: any }) => {
            delete defect.id;
            return defect;
          })
          .sort(
            (first: { imNumber: number }, second: { imNumber: number }) =>
              first.imNumber - second.imNumber
          );

        await request.get("defects").then((res: any) => {
          expect(res.statusCode).toBe(200);
          expect(res.headers["access-control-allow-origin"]).toBe("*");
          expect(res.headers["access-control-allow-credentials"]).toBe("true");
          expect(res.body.length).toBe(expectedResponse.length);
        });
      });
    });

    context("when database is empty", () => {
      it("should return error code 404", async () => {
        await emptyDatabase();
        await request.get("defects").expect(404);
      });
    });
  });
});
