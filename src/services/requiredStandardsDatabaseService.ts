import { DynamoDBClient, QueryOutput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ServiceException } from "@smithy/smithy-client";
import { IDBConfig } from "../models";
import { Configuration } from "../utils/Configuration";

export class RequiredStandardsDatabaseService {
  private readonly tableName: string;
  private static dbClient: DynamoDBDocumentClient;

  /**
   * Constructor for the IvaDatabaseService class, configures and instantiates DynamoDB config
   */
  constructor() {
    const config: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
    this.tableName = config.ivaDefects.table;
    if (!RequiredStandardsDatabaseService.dbClient) {
      const client = new DynamoDBClient(config.ivaDefects);
      RequiredStandardsDatabaseService.dbClient =
        DynamoDBDocumentClient.from(client);
    }
  }

  /**
   * Retrieves required standards based on the provided manualID
   * @param euVehicleCategory the EU Vehicle Category, e.g M1, N1, MSVA
   * @returns Array of Records containing raw required standards
   */
  public async getRequiredStandardsByEUVehicleCategory(
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
   * Generic method used to query all data in the required standards table
   * @param params the parameters to configure the scan with
   * @returns Array of Records containing raw required standards
   */
  private async queryAllData(
    params: any,
    allData: Array<Record<string, any>> = [],
  ): Promise<Array<Record<string, any>>> {
    const data: QueryOutput | ServiceException =
      await RequiredStandardsDatabaseService.dbClient.send(
        new ScanCommand(params),
      );
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
