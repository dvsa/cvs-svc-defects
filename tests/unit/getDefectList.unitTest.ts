import { DefectsService } from "../../src/services/DefectsService";
import { HTTPError } from "../../src/models/HTTPError";
import { cloneDeep } from "lodash";

describe("when calling service method getDefectList", () => {
  describe("when database is on", () => {
    context("when defectsDAO getAll resolves promise with data", () => {
      it("should return a defect item", async () => {
        const defects = {
          Items: [
            {
              id: 1,
              restrictionsDates: {
                startDate: null,
                stopDate: "2025-01-14T23:59:59.999Z",
              },
              imNumber: 1,
              imDescription: "Registration Plate",
              imDescriptionWelsh: "Plât Cofrestru",
              forVehicleType: ["psv", "hgv"],
              additionalInfo: {
                psv: {
                  location: {
                    vertical: null,
                    horizontal: null,
                    lateral: null,
                    longitudinal: ["front", "rear"],
                    rowNumber: null,
                    seatNumber: null,
                    axleNumber: null,
                  },
                  notes: false,
                },
                hgv: {
                  location: {
                    vertical: null,
                    horizontal: null,
                    lateral: null,
                    longitudinal: ["front", "rear"],
                    rowNumber: null,
                    seatNumber: null,
                    axleNumber: null,
                  },
                  notes: false,
                },
                trl: {},
              },
              items: [
                {
                  itemNumber: 1,
                  itemDescription: "A registration plate:",
                  itemDescriptionWelsh: "Plât cofrestru:",
                  forVehicleType: ["psv", "hgv"],
                  deficiencies: [
                    {
                      ref: "1.1.a",
                      deficiencyId: "a",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText: "missing.",
                      deficiencyTextWelsh: "ar goll.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                    {
                      ref: "1.1.b",
                      deficiencyId: "b",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText: "insecure.",
                      deficiencyTextWelsh: "yn anniogel.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                  ],
                },
                {
                  itemNumber: 2,
                  itemDescription: "A registration mark:",
                  itemDescriptionWelsh: "Marc cofrestru",
                  forVehicleType: ["psv", "hgv"],
                  deficiencies: [
                    {
                      ref: "1.2.a",
                      deficiencyId: "a",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText: "missing.",
                      deficiencyTextWelsh: "ar goll.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                    {
                      ref: "1.2.b",
                      deficiencyId: "b",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText: "illegible.",
                      deficiencyTextWelsh: "annarllenadwy.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                    {
                      ref: "1.2.c",
                      deficiencyId: "c",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText:
                        "not in accordance with the requirements.",
                      deficiencyTextWelsh: "ddim yn unol â'r gofynion.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                  ],
                },
              ],
            },
            {
              id: 1,
              restrictionsDates: {
                startDate: "2025-01-15T00:00:00.000Z",
                stopDate: null,
              },
              imNumber: 1,
              imDescription: "Registration Plate",
              imDescriptionWelsh: "Plât Cofrestru",
              forVehicleType: ["psv", "hgv"],
              additionalInfo: {
                psv: {
                  location: {
                    vertical: null,
                    horizontal: null,
                    lateral: null,
                    longitudinal: ["front", "rear"],
                    rowNumber: null,
                    seatNumber: null,
                    axleNumber: null,
                  },
                  notes: false,
                },
                hgv: {
                  location: {
                    vertical: null,
                    horizontal: null,
                    lateral: null,
                    longitudinal: ["front", "rear"],
                    rowNumber: null,
                    seatNumber: null,
                    axleNumber: null,
                  },
                  notes: false,
                },
                trl: {},
              },
              items: [
                {
                  itemNumber: 1,
                  itemDescription: "A registration plate:",
                  itemDescriptionWelsh: "Plât cofrestru:",
                  forVehicleType: ["psv", "hgv"],
                  deficiencies: [
                    {
                      ref: "1.1.a",
                      deficiencyId: "a",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText: "missing.",
                      deficiencyTextWelsh: "ar goll.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                    {
                      ref: "1.1.b",
                      deficiencyId: "b",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText: "insecure.",
                      deficiencyTextWelsh: "yn anniogel.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                  ],
                },
                {
                  itemNumber: 2,
                  itemDescription: "A registration mark:",
                  itemDescriptionWelsh: "Marc cofrestru",
                  forVehicleType: ["psv", "hgv"],
                  deficiencies: [
                    {
                      ref: "1.2.a",
                      deficiencyId: "a",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText: "missing.",
                      deficiencyTextWelsh: "ar goll.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                    {
                      ref: "1.2.b",
                      deficiencyId: "b",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText: "illegible.",
                      deficiencyTextWelsh: "annarllenadwy.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                    {
                      ref: "1.2.c",
                      deficiencyId: "c",
                      deficiencySubId: null,
                      deficiencyCategory: "major",
                      deficiencyText:
                        "not in accordance with the requirements. (There is a changed value here)",
                      deficiencyTextWelsh: "ddim yn unol â'r gofynion.",
                      stdForProhibition: false,
                      forVehicleType: ["psv", "hgv"],
                    },
                  ],
                },
              ],
            },
          ],
          Count: 2,
        };
        const { id, restrictionsDates, ...expectedDefect } = defects.Items[1];
        const MockDefectsDAO = jest.fn().mockImplementation(() => {
          return {
            getAll: () => {
              return Promise.resolve(cloneDeep(defects));
            },
          };
        });
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2025, 0, 15, 0, 0, 0, 0));
        const mockDefectsDAO = new MockDefectsDAO();
        const service: DefectsService = new DefectsService(mockDefectsDAO);
        const returnedRecords = await service.getDefectList();
        expect(returnedRecords).not.toBe(undefined);
        expect(returnedRecords).not.toBe({});
        expect(returnedRecords?.[1]).toEqual(undefined);
        expect(returnedRecords?.length).toEqual(1);
        expect(returnedRecords).toEqual([expectedDefect]);
        expect(returnedRecords.length).toBe(1);
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
