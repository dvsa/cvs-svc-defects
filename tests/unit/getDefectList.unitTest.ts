import { DefectsService } from "../../src/services/DefectsService";
import { HTTPError } from "../../src/models/HTTPError";
import { cloneDeep } from "lodash";
import {
  IDateRestrictions,
  IDefectChild,
  IDefectParent,
} from "../../src/models/Defects";
import defectsMock from "../resources/defects.json";
import defects8BeforeChange from "../resources/defect8beforeChange.json";
import defect8AfterChange from "../resources/defect8AfterChange.json";
import { DefectsDAO } from "../../src/models/DefectsDAO";

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

  describe("Testing filterEffectiveDates()", () => {
    context("when object is passed in with current date", () => {
      const MockDefectsDAO = jest.fn().mockImplementation(() => {
        return {
          getAll: () => {
            return Promise.reject({});
          },
        };
      });
      const defectsDAO = new MockDefectsDAO();
      const service: DefectsService = new DefectsService(defectsDAO);

      it("should return true when effectiveFrom is equal to currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveFrom: IDateRestrictions = {
          effectiveFrom: "2025-01-01",
        };
        expect(
          service.filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveFrom,
          ),
        ).toBe(true);
      });

      it("should return false when effectiveFrom is greater than currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveFrom: IDateRestrictions = {
          effectiveFrom: "2025-01-02",
        };
        expect(
          service.filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveFrom,
          ),
        ).toBe(false);
      });

      it("should return true when effectiveTo is greater than currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveTo: IDateRestrictions = {
          effectiveTo: "2025-01-02",
        };
        expect(
          service.filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveTo,
          ),
        ).toBe(true);
      });

      it("should return false when effectiveTo is less than currentDate", () => {
        const currentDate = new Date("2025-01-02").valueOf();
        const objectWithEffectiveTo: IDateRestrictions = {
          effectiveTo: "2025-01-01",
        };
        expect(
          service.filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveTo,
          ),
        ).toBe(false);
      });

      it("should return true when effectiveFrom is less than currentDate and effectiveTo is greater than currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveFromAndTo: IDateRestrictions = {
          effectiveFrom: "2024-12-31",
          effectiveTo: "2025-01-02",
        };
        expect(
          service.filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveFromAndTo,
          ),
        ).toBe(true);
      });

      it("should return false when effectiveFrom is greater than currentDate and effectiveTo is less than currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveFromAndTo: IDateRestrictions = {
          effectiveFrom: "2025-01-02",
          effectiveTo: "2024-12-31",
        };
        expect(
          service.filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveFromAndTo,
          ),
        ).toBe(false);
      });
    });
  });

  describe("Testing removeEffectiveDates()", () => {
    const defectsDAO = new DefectsDAO();
    const service: DefectsService = new DefectsService(defectsDAO);

    it("should remove effectiveFrom property if it exists", () => {
      const objectWithEffectiveFrom: IDateRestrictions = {
        effectiveFrom: "2025-01-01",
      };
      service.removeEffectiveDates<IDateRestrictions>(objectWithEffectiveFrom);
      expect(objectWithEffectiveFrom.effectiveFrom).toBeUndefined();
    });

    it("should remove effectiveTo property if it exists", () => {
      const objectWithEffectiveTo: IDateRestrictions = {
        effectiveTo: "2025-01-01",
      };
      service.removeEffectiveDates<IDateRestrictions>(objectWithEffectiveTo);
      expect(objectWithEffectiveTo.effectiveTo).toBeUndefined();
    });

    it("should remove both effectiveFrom and effectiveTo properties if they exist", () => {
      const objectWithBoth: IDateRestrictions = {
        effectiveFrom: "2025-01-01",
        effectiveTo: "2025-01-02",
      };
      service.removeEffectiveDates<IDateRestrictions>(objectWithBoth);
      expect(objectWithBoth.effectiveFrom).toBeUndefined();
      expect(objectWithBoth.effectiveTo).toBeUndefined();
    });

    it("should not throw an error if effectiveFrom and effectiveTo properties do not exist", () => {
      const objectWithoutDates: IDateRestrictions = {};
      expect(() =>
        service.removeEffectiveDates<IDateRestrictions>(objectWithoutDates),
      ).not.toThrow();
    });
  });
});
