import { DefectsService } from "../../src/services/DefectsService";
import { HTTPError } from "../../src/models/HTTPError";
import { cloneDeep } from "lodash";
import { IDefectChild, IDefectParent } from "../../src/models/Defects";
import defectsMock from "../resources/defects.json";
import defects8BeforeChange from "../resources/defect8beforeChange.json";
import defect8AfterChange from "../resources/defect8AfterChange.json";
import { IDateRestrictions } from "../../src/models/DateRestrictions";

describe("when calling service method getDefectList", () => {
  describe("when database is on", () => {
    context("when defectsDAO getAll resolves promise with data", () => {
      it("should return a defect item only defects before change", async () => {
        const passedInDate: string = "2025-01-02";
        const defects: { Count: number; Items: IDefectParent[] } = {
          Items: [],
          Count: 9,
        };
        defects.Items = [cloneDeep(defectsMock[7])] as IDefectParent[];
        const MockDefectsDAO = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.resolve(cloneDeep(defects));
            },
          };
        });
        jest.useFakeTimers();
        jest.setSystemTime(new Date(passedInDate));
        const expectedDefects = [defects8BeforeChange] as any;

        const mockDefectsDAO = new MockDefectsDAO();
        const service: DefectsService = new DefectsService(mockDefectsDAO);
        const returnedRecords = await service.getDefectList();
        expect(returnedRecords).toEqual(expectedDefects);
      });

      it("should return a defect item only defects after change", async () => {
        const passedInDate: string = "2025-01-01";

        const defects: { Count: number; Items: IDefectParent[] } = {
          Items: [],
          Count: 9,
        };
        defects.Items = [cloneDeep(defectsMock[7])] as IDefectParent[];
        const MockDefectsDAO = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.resolve(cloneDeep(defects));
            },
          };
        });
        jest.useFakeTimers();
        jest.setSystemTime(new Date(passedInDate));
        process.env.CURRENT_DATE_OVERRIDE = "2025-03-01";
        const expectedDefects = [defect8AfterChange] as any;

        const mockDefectsDAO = new MockDefectsDAO();
        const service: DefectsService = new DefectsService(mockDefectsDAO);
        const returnedRecords = await service.getDefectList();
        expect(returnedRecords).toEqual(expectedDefects);
      });

      it("should return a defect item only defects after with additional changes to deficiency", async () => {
        const passedInDate: string = "2025-01-02";

        const defects: { Count: number; Items: IDefectParent[] } = {
          Items: [],
          Count: 9,
        };
        defects.Items = [cloneDeep(defectsMock[7])] as IDefectParent[];
        defects.Items[0].items[0].deficiencies[0] = {
          ...defects.Items[0].items[0].deficiencies[0],
          effectiveTo: "2025-01-01",
        } as IDefectChild & IDateRestrictions;
        const MockDefectsDAO = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.resolve(cloneDeep(defects));
            },
          };
        });
        jest.useFakeTimers();
        jest.setSystemTime(new Date(passedInDate));
        const expectedDefects: IDefectParent[] = [defect8AfterChange] as any;
        expectedDefects[0].items[0].deficiencies.shift();

        const mockDefectsDAO = new MockDefectsDAO();
        const service: DefectsService = new DefectsService(mockDefectsDAO);
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
