import { Configuration } from "../utils/Configuration";
import AWSXRay from "aws-xray-sdk";
import { DynamoDBClient, ScanOutput } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { ServiceException } from "@smithy/smithy-client";
import { IDBConfig } from ".";

export class DefectsDAO {
  private readonly tableName: string;
  private static dbClient: DynamoDBDocumentClient;

  constructor() {
    const config: IDBConfig = Configuration.getInstance().getDynamoDBConfig();
    this.tableName = config.defects.table;
    if (!DefectsDAO.dbClient) {
      let client;
      if (process.env._X_AMZN_TRACE_ID) {
        client = AWSXRay.captureAWSv3Client(new DynamoDBClient(config.defects));
      } else {
        console.log("Serverless Offline detected; skipping AWS X-Ray setup");
        client = new DynamoDBClient(config.defects);
      }
      DefectsDAO.dbClient = DynamoDBDocumentClient.from(client);
    }
  }

  public async getAll(): Promise<ScanOutput | ServiceException> {
    const command = new ScanCommand({ TableName: this.tableName });
    return await DefectsDAO.dbClient.send(command);
  }

  public generatePartialParams(): any {
    return {
      RequestItems: {
        [this.tableName]: [],
      },
    };
  }

  public async createMultiple(defectItems: any[]): Promise<any> {
    const params = this.generatePartialParams();

    defectItems.map((defectItem: any) => {
      params.RequestItems[this.tableName].push({
        PutRequest: {
          Item: defectItem,
        },
      });
    });
    const command = new BatchWriteCommand(params);
    return await DefectsDAO.dbClient.send(command);
  }

  public async deleteMultiple(primaryKeysToBeDeleted: string[]): Promise<any> {
    const params = this.generatePartialParams();

    primaryKeysToBeDeleted.forEach((key) => {
      params.RequestItems[this.tableName].push({
        DeleteRequest: {
          Key: {
            id: key,
          },
        },
      });
    });
    const command = new BatchWriteCommand(params);
    return await DefectsDAO.dbClient.send(command);
  }
}
