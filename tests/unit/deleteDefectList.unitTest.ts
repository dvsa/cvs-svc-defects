import { DefectsService } from "../../src/services/DefectsService";
import { HTTPError } from "../../src/models/HTTPError";

describe("when service method deleteDefectList is called", () => {
    describe("when database is off", () => {
        context("when defectsDAO deleteMultiple returns a rejected promise", () => {
            it("should return 500-Internal Server Error", async () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        deleteMultiple: () => {
                            return Promise.reject({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                expect.assertions(3);
                try {
                    await defectsService.deleteDefectList([]);
                } catch (errorResponse) {
                    expect(errorResponse).toBeInstanceOf(HTTPError);
                    expect(errorResponse.statusCode).toBe(500);
                    expect(errorResponse.body).toBe("Internal ServerError");
                }
            });
        });
    });

    describe("when database is on", () => {
        context("when defectsDAO deleteMultiple yields promise with unprocessed defect items", () => {
            it("should return 200 along with unprocessed items", async () => {
                const expectedUnprocessedDefects = {
                    UnprocessedItems: [{ imNumber: "1" }],
                    Count: 1
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        deleteMultiple: () => {
                            return Promise.resolve(expectedUnprocessedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                const returnedRecords = await defectsService.deleteDefectList(["1"]);
                expect(Object.keys(returnedRecords).length).toBe(1);
                expect(returnedRecords.constructor).toEqual(Array);
                expect(returnedRecords).not.toBe(undefined);
                expect(returnedRecords).not.toEqual({});
                expect(returnedRecords).toEqual(expectedUnprocessedDefects.UnprocessedItems);
                expect(returnedRecords.length).toBe(expectedUnprocessedDefects.UnprocessedItems.length);
            });
        });

        context("when defectsDAO deleteMultiple yields promise with no unprocessed defect items", () => {
            it("should return HTTP 200", async () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        deleteMultiple: () => {
                            return Promise.resolve({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                const returnedRecords = await defectsService.deleteDefectList(["1"]);
                expect(returnedRecords).toBe(undefined);
            });
        });
    });
});
