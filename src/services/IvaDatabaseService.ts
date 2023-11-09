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

  public getDefectsByManualId(
    manualId: string,
  ): Promise<PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>> {
    return IvaDatabaseService.dbClient
      .scan({
        TableName: this.tableName,
        FilterExpression: "euVehicleCategories_0 = :manualId",
        ExpressionAttributeValues: {
          ":manualId": manualId,
        },
      })
      .promise();
  }

  public getDefectsByCriteria(
    vehicleType: VehicleType | null,
    euVehicleCategory: EUVehicleCategory | null,
    inspectionType: InspectionType | null,
  ): Promise<PromiseResult<DocumentClient.ScanOutput, AWS.AWSError>> {
    // This should be a query, how do we build up the query attributes?
    return IvaDatabaseService.dbClient
      .scan({
        TableName: this.tableName,
        ExpressionAttributeValues: {
          ":vt": vehicleType,
          ":vc": euVehicleCategory,
          ":it": inspectionType,
        },
        FilterExpression:
          "vehicleTypes_0 = :vt and euVehicleCategories_0 = :vc and requiredStandards_1_inspectionTypes_0 = :it",
      })
      .promise();
  }
}
