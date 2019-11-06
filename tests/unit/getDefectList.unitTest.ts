import { DefectsService } from "../../src/services/DefectsService";
import { HTTPError } from "../../src/models/HTTPError";

describe("when calling service method getDefectList", () => {
    describe("when database is on", () => {
        context("when defectsDAO getAll resolves promise with data", () => {
            it("should return a defect item", async () => {
                const expectedDefects = {
                    Items: [{ imNumber: 1 }]
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        getAll: () => {
                            return Promise.resolve(expectedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const service: DefectsService = new DefectsService(mockDefectsDAO);
                const returnedRecords = await service.getDefectList();
                expect(returnedRecords).not.toBe(undefined);
                expect(returnedRecords).not.toBe({});
                expect(returnedRecords).toEqual(expectedDefects.Items);
                expect(returnedRecords.length).toBe(expectedDefects.Items.length);
            });
        });

        context("when defectsDAO getAll resolves promise with empty data", () => {
            it("should return HTTP Error Code 404-No resources match the search criteria", async () => {
                const expectedDefects = {
                    Items: [],
                    Count: 0
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        getAll: () => {
                            return Promise.resolve(expectedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                try {
                    await defectsService.getDefectList();
                    expect.assertions(3); // should have thrown an error, test failed
                } catch (errorResponse) {
                    expect(errorResponse).toBeInstanceOf(HTTPError);
                    expect(errorResponse.statusCode).toBe(404);
                    expect(errorResponse.body).toBe("No resources match the search criteria.");
                }
            });
        });

        context("when defectsDAO getAll resolves promise with undefined data", () => {
            it("should return 404-No resources match the search criteria", async () => {
                const expectedDefects = {
                    Items: undefined,
                    Count: 0
                };

                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        getAll: () => {
                            return Promise.resolve(expectedDefects);
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const defectsService: DefectsService = new DefectsService(mockDefectsDAO);
                expect.assertions(3);
                try {
                    await defectsService.getDefectList();
                } catch (errorResponse) {
                    expect(errorResponse).toBeInstanceOf(HTTPError);
                    expect(errorResponse.statusCode).toBe(404);
                    expect(errorResponse.body).toBe("No resources match the search criteria.");
                }
            });
        });
    });

    describe("when database is off", () => {
        context("when defectsDAO returns a rejected promise", () => {
            it("should return 500-Internal Server Error", async () => {
                const MockDefectsDAO = jest.fn().mockImplementation(() => {
                    return {
                        getAll: () => {
                            return Promise.reject({});
                        }
                    };
                });

                const mockDefectsDAO = new MockDefectsDAO();
                const service: DefectsService = new DefectsService(mockDefectsDAO);
                expect.assertions(3);
                try {
                    await service.getDefectList();
                } catch (errorResponse) {
                    expect(errorResponse).toBeInstanceOf(HTTPError);
                    expect(errorResponse.statusCode).toBe(500);
                    expect(errorResponse.body).toBe("Internal Server Error");
                }
            });
        });
    });
});
