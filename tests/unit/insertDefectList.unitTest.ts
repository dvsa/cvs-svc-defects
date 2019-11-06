import { DefectsService } from "../../src/services/DefectsService";
import { HTTPError } from "../../src/models/HTTPError";

describe("when service method insertDefectList is called", () => {
    describe("when database is off", () => {
        context("when defectsDAO createMultiple returns a rejected promise", () => {
            it("should return 500-Internal Server Error", async () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        createMultiple: () => {
                            return Promise.reject({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const service: DefectsService = new DefectsService(mockDefectsDAO);
                expect.assertions(3);
                try {
                    await service.insertDefectList([]);
                } catch (errorResponse) {
                    expect(errorResponse).toBeInstanceOf(HTTPError);
                    expect(errorResponse.statusCode).toBe(500);
                    expect(errorResponse.body).toBe("Internal Server Error");
                }
            });
        });
    });

    describe("when database is on", () => {
        context("when defectsDAO createMultiple yields promise with unprocessed defect items", () => {
            it("should return HTTP 200 along with unprocessed items", async () => {
                const expectedUnprocessedDefects = {
                    UnprocessedItems: [{ imNumber: "1" }],
                    Count: 1
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        createMultiple: () => {
                            return Promise.resolve(expectedUnprocessedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                const result = await defectsService.insertDefectList(["1"]);
                expect(Object.keys(result).length).toBe(1);
                expect(result).toEqual(expectedUnprocessedDefects.UnprocessedItems);
            });
        });


        context("when defectsDAO createMultiple yields promise with no unprocessed defect items", () => {
            it("should return HTTP 200", async () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        createMultiple: () => {
                            return Promise.resolve({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                const returnedRecords = await defectsService.insertDefectList(["1"]);
                expect(returnedRecords).toBe(undefined);
            });
        });
    });
});
