import {Configuration} from "../../src/utils/Configuration";
import {IDBConfig, IInvokeConfig} from "../../src/models";
import {ERRORS} from "../../src/assets/Enums";

describe("ConfigurationUtil", () => {
    const branch = process.env.BRANCH;
    context("when calling getConfig", () => {
        it("returns the full config object", () => {
            const conf = Configuration.getInstance().getConfig();
            expect(Object.keys(conf)).toEqual(expect.arrayContaining(["invoke", "dynamodb"]));
            expect(Object.keys(conf.invoke)).toEqual(expect.arrayContaining(["local", "remote"]));
            expect(Object.keys(conf.dynamodb)).toEqual(expect.arrayContaining(["local", "local-global", "remote"]));
        });
    });

    context("when calling the getInvokeConfig()", () => {
        beforeEach(() => {jest.resetModules(); });

        context("the config is empty", () => {
            it("should throw error", () => {
                process.env.BRANCH = "local";
                const emptyConfig = new Configuration("../../tests/resources/EmptyConfig.yml");
                expect.assertions(1);
                try {
                    emptyConfig.getInvokeConfig();
                } catch (e) {
                    expect(e.message).toBe(ERRORS.LambdaInvokeConfigNotDefined);
                }
            });
        });
        context("the BRANCH environment variable is local", () => {
            process.env.BRANCH = "local";
            const invokeConfig: IInvokeConfig = Configuration.getInstance().getInvokeConfig();
            it("should return the local invoke config", () => {
                expect(Object.keys(invokeConfig.functions)).toContain("getDefects");
                expect(invokeConfig.params.apiVersion).toBeTruthy();
                expect(invokeConfig.params.endpoint).toBeTruthy();
            });
        });

        context("the BRANCH environment variable is not defined", () => {
            process.env.BRANCH = "";
            const invokeConfig: IInvokeConfig = Configuration.getInstance().getInvokeConfig();
            it("should return the local invoke config", () => {
                expect(Object.keys(invokeConfig.functions)).toContain("getDefects");
                expect(invokeConfig.params.apiVersion).toBeTruthy();
                expect(invokeConfig.params.endpoint).toBeTruthy();
            });
        });

        context("the BRANCH environment variable is different than local", () => {
            process.env.BRANCH = "test";
            const invokeConfig: IInvokeConfig = Configuration.getInstance().getInvokeConfig();
            it("should return the remote S3 config", () => {
                expect(Object.keys(invokeConfig.functions)).toContain("getDefects");
                expect(invokeConfig.params.apiVersion).toBeTruthy();
                expect(invokeConfig.params.endpoint).not.toBeTruthy();
            });
        });
    });

    context("when calling the getDynamoDBConfig()", () => {
        beforeEach(() => {jest.resetModules(); });

        context("the config is empty", () => {
            process.env.BRANCH = "local";
            const emptyConfig: Configuration = new Configuration("../../tests/resources/EmptyConfig.yml");
            it("should throw error", () => {
                expect.assertions(1);
                try {
                    emptyConfig.getDynamoDBConfig();
                } catch (e) {
                    expect(e.message).toBe(ERRORS.DynamoDBConfigNotDefined);
                }
            });
        });
        context("the BRANCH environment variable is local", () => {
            process.env.BRANCH = "local";
            const dbConfig: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
            it("should return the local invoke config", () => {
                expect(Object.keys(dbConfig)).toEqual(expect.arrayContaining(["params", "table", "keys"]));
                expect(dbConfig.table).toBe("cvs-local-defects");
            });
        });

        context("the BRANCH environment variable is local", () => {
            process.env.BRANCH = "local-global";
            const dbConfig: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
            it("should return the local invoke config", () => {
                expect(Object.keys(dbConfig)).toEqual(expect.arrayContaining(["params", "table"]));
                expect(Object.keys(dbConfig)).not.toContain("keys");
                expect(dbConfig.table).toBe("cvs-local-global-defects");
                expect(Object.keys(dbConfig.params)).toEqual(expect.arrayContaining(["region", "endpoint"]));
            });
        });

        context("the BRANCH environment variable is 'develop'", () => {
            it("should return the remote invoke config", () => {
                process.env.BRANCH = "develop";
                // Switch to mockedConfig to simplify environment mocking
                const dbConfig: IDBConfig = getMockedConfig().getDynamoDBConfig();
                expect(Object.keys(dbConfig)).toEqual(expect.arrayContaining(["params", "table"]));
                expect(Object.keys(dbConfig)).not.toContain("keys");
                expect(dbConfig.table).toBe("cvs-develop-defects");
                expect(dbConfig.params).toEqual({});
            });
        });

        context("the BRANCH environment variable is not defined", () => {
            it("should throw error", () => {
                process.env.BRANCH = "";
                expect.assertions(1);
                try {
                    getMockedConfig().getDynamoDBConfig();
                } catch (e) {
                    expect(e.message).toEqual(ERRORS.NoBranch);
                }
            });
        });
    });

    afterAll(() => {
        process.env.BRANCH = branch;
    });
});

/**
 * Configuration does the token replacement for ${BRANCH} on instantiation, so in order to
 * catch this early enough, need to use jest.resetModules() and a "require" import
 * of Configuration again
 */
const getMockedConfig: () => Configuration = () => {
    jest.resetModules();
    const ConfImp = require("../../src/utils/Configuration");
    return ConfImp.Configuration.getInstance();
};
