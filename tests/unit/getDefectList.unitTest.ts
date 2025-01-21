import { DefectsService } from "../../src/services/DefectsService";
import { HTTPError } from "../../src/models/HTTPError";
import { cloneDeep } from "lodash";

describe("when calling service method getDefectList", () => {
  describe("when database is on", () => {
    context("when defectsDAO getAll resolves promise with data", () => {
      it("should return a defect item", async () => {
        let dateAndTime = new Date();
        dateAndTime = new Date(dateAndTime.getTime() + 900 * 1000);
        const timeDifference = 600 * 1000;
        const defects = {
          Items: [
            {
              id: 63,
              idNumber: 63,
              shouldItExist: "keep",
            },
            {
              id: 64,
              idNumber: 64,
              shouldItExist: "remove",
            },
            {
              id: 65,
              idNumber: 65,
              shouldItExist: "keep",
            },
            {
              id:66,
              idNumber:66,
              shouldItExist: "remove",
            },
            {
              id: 67,
              idNumber: 67,
              shouldItExist: "keep",
            },
            {
              id: 68,
              idNumber: 68,
              shouldItExist: "remove",
            },
            {
              id: 69,
              idNumber: 69,
              shouldItExist: "remove",
            },
            {
              id: 70,
              idNumber: 70,
              shouldItExist: "keep",
            },
          ],
          Count: 9,
        };
        const MockDefectsDAO = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.resolve(cloneDeep(defects));
            },
          };
        });
        jest.useFakeTimers();
        jest.setSystemTime(dateAndTime);
        const expectedDefects = defects.Items.filter(
          (value: any) => value.shouldItExist === "keep",
        ).map(({ id: id, ...defect }) => defect);
        const mockDefectsDAO = new MockDefectsDAO();
        const service: DefectsService = new DefectsService(mockDefectsDAO);
        // @ts-ignore
        jest.spyOn(service, "getConfig").mockImplementation(async () => [
          // all the comment before each object in this
          // array are applied against current date of 2025-01-15T00:00:00.000Z
          // current is equal or later than start date keeps it
          {
            startDate: dateAndTime.toISOString(),
            stopDate: null,
            id: 63, // 63
          },
          // current is before start date removes it
          {
            startDate: new Date(
              dateAndTime.getTime() + timeDifference,
            ).toISOString(),
            stopDate: null,
            id: 64, // 64
          },
          // current is before stop date keeps it
          {
            startDate: null,
            stopDate: new Date(
              dateAndTime.getTime() + timeDifference,
            ).toISOString(),
            id: 65, // 65
          },
          // current is after stop date removes it
          {
            startDate: null,
            stopDate: new Date(
              dateAndTime.getTime() - timeDifference,
            ).toISOString(),
            id:66, // 66
          },
          // current is after start date and before stop date keep it
          {
            startDate: new Date(
              dateAndTime.getTime() - timeDifference,
            ).toISOString(),
            stopDate: new Date(
              dateAndTime.getTime() + timeDifference,
            ).toISOString(),
            id: 67, // 67
          },
          // current is before start date and before stop date remove it
          {
            startDate: new Date(
              dateAndTime.getTime() - timeDifference,
            ).toISOString(),
            stopDate: new Date(
              dateAndTime.getTime() - timeDifference,
            ).toISOString(),
            id: 68, // 68
          },
          // current is after start date and after stop date remove it
          {
            startDate: new Date(
              dateAndTime.getTime() + timeDifference,
            ).toISOString(),
            stopDate: new Date(
              dateAndTime.getTime() + timeDifference,
            ).toISOString(),
            id: 69, // 69
          },
          // neither exist keep it
          {
            startDate: null,
            stopDate: null,
            id: 70, // 70
          },
        ]);
        const returnedRecords = await service.getDefectList();
        expect(returnedRecords).toEqual(expectedDefects);
      });
    });

    context("when defectsDAO getAll resolves promise with empty data", () => {
      it("should return HTTP Error Code 404-No resources match the search criteria", async () => {
        const expectedDefects = {
          Items: [],
          Count: 0,
        };

        const MockDefectsDAO = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.resolve(expectedDefects);
            },
          };
        });

        const mockDefectsDAO = new MockDefectsDAO();
        const defectsService: DefectsService = new DefectsService(
          mockDefectsDAO,
        );
        try {
          await defectsService.getDefectList();
          expect.assertions(3); // should have thrown an error, test failed
        } catch (errorResponse) {
          expect(errorResponse).toBeInstanceOf(HTTPError);
          expect((errorResponse as HTTPError).statusCode).toBe(404);
          expect((errorResponse as HTTPError).body).toBe(
            "No resources match the search criteria.",
          );
        }
      });
    });

    context(
      "when defectsDAO getAll resolves promise with undefined data",
      () => {
        it("should return 404-No resources match the search criteria", async () => {
          const expectedDefects = {
            Items: undefined,
            Count: 0,
          };

          const MockDefectsDAO = jest.fn().mockImplementation(() => {
            return {
              getAll: () => {
                return Promise.resolve(expectedDefects);
              },
            };
          });

          const mockDefectsDAO = new MockDefectsDAO();
          const defectsService: DefectsService = new DefectsService(
            mockDefectsDAO,
          );
          expect.assertions(3);
          try {
            await defectsService.getDefectList();
          } catch (errorResponse) {
            expect(errorResponse).toBeInstanceOf(HTTPError);
            expect((errorResponse as HTTPError).statusCode).toBe(404);
            expect((errorResponse as HTTPError).body).toBe(
              "No resources match the search criteria.",
            );
          }
        });
      },
    );
  });

  describe("when database is off", () => {
    context("when defectsDAO returns a rejected promise", () => {
      it("should return 500-Internal Server Error", async () => {
        const MockDefectsDAO = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.reject({});
            },
          };
        });

        const mockDefectsDAO = new MockDefectsDAO();
        const service: DefectsService = new DefectsService(mockDefectsDAO);
        expect.assertions(3);
        try {
          await service.getDefectList();
        } catch (errorResponse) {
          expect(errorResponse).toBeInstanceOf(HTTPError);
          expect((errorResponse as HTTPError).statusCode).toBe(500);
          expect((errorResponse as HTTPError).body).toBe(
            "Internal Server Error",
          );
        }
      });
    });
  });
});
