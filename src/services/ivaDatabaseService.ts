import DynamoDB, { DocumentClient } from "aws-sdk/clients/dynamodb";
import { IDBConfig } from "../models";
import { Configuration } from "../utils/Configuration";
import { PromiseResult } from "aws-sdk/lib/request";
import {
  EUVehicleCategory,
  InspectionType,
  VehicleType,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get";

export class IvaDatabaseService {
  private readonly tableName: string;
  private static dbClient: DocumentClient;

  constructor() {
    const config: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
    this.tableName = config.ivaDefects.table;
    if (!IvaDatabaseService.dbClient) {
      IvaDatabaseService.dbClient = new DynamoDB.DocumentClient(
        config.ivaDefects,
      );
    }
  }

  public async getDefectsByManualId(
    manualId: string,
  ): Promise<Array<Record<string, any>>> {
    return await this.queryAllData({
      TableName: this.tableName,
      FilterExpression: "euVehicleCategories_0 = :manualId",
      ExpressionAttributeValues: {
        ":manualId": manualId,
      },
    });
  }

  public getDefectsByCriteria(
    vehicleType: VehicleType | null,
    euVehicleCategory: EUVehicleCategory | null,
    inspectionType: InspectionType | null,
  ): Promise<PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>> {
    // This should be a query, how do we build up the query attributes?
    return IvaDatabaseService.dbClient
      .scan({
        TableName: this.tableName
      })
      .promise();
  }

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
