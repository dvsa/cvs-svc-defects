import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IDBConfig } from "../models";
import { Configuration } from "../utils/Configuration";
import { PromiseResult } from "aws-sdk/lib/request";

export class IvaDatabaseService {
  private readonly tableName: string;
  private static dbClient: DocumentClient;

  /**
   * Constructor for the IvaDatabaseService class, configures and instantiates DynamoDB config
   */
  constructor() {
    const config: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
    this.tableName = config.ivaDefects.table;
    if (!IvaDatabaseService.dbClient) {
      IvaDatabaseService.dbClient = new DynamoDB.DocumentClient(
        config.ivaDefects,
      );
    }
  }

  /**
   * Retrieves IVA Defects based on the provided manualID
   * @param euVehicleCategory the EU Vehicle Category, e.g M1, N1, MSVA
   * @returns Array of Records containing raw IVA defects
   */
  public async getDefectsByEUVehicleCategory(
    euVehicleCategory: string,
  ): Promise<Array<Record<string, any>>> {
    return await this.queryAllData({
      TableName: this.tableName,
      FilterExpression: "euVehicleCategory = :euVehicleCategory",
      ExpressionAttributeValues: {
        ":euVehicleCategory": euVehicleCategory,
      },
    });
  }

  /**
   * Generic method used to query all data in the IVA Defects table
   * @param params the parameters to configure the scan with
   * @returns Array of Records containing raw IVA defects
   */
  private async queryAllData(
    params: any,
    allData: Array<Record<string, any>> = [],
  ): Promise<Array<Record<string, any>>> {
    const data: PromiseResult<DocumentClient.QueryOutput, AWS.AWSError> =
      await IvaDatabaseService.dbClient.scan(params).promise();
    if (data.Items && data.Items.length > 0) {
      allData = [...allData, ...data.Items];
    }
    if (data.LastEvaluatedKey) {
      params.ExclusiveStartKey = data.LastEvaluatedKey;
      return this.queryAllData(params, allData);
    }

    return allData;
  }
}
