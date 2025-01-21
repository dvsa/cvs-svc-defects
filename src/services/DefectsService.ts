import { HTTPError } from "../models/HTTPError";
import { DefectsDAO } from "../models/DefectsDAO";
import { IDateConstraints } from "../models/DateConstraints";
import { getAppConfig } from "@aws-lambda-powertools/parameters/appconfig";

export class DefectsService {
  public readonly defectsDAO: DefectsDAO;

  constructor(defectsDAO: DefectsDAO) {
    this.defectsDAO = defectsDAO;
  }

  public getDefectList() {
    return this.defectsDAO
      .getAll()
      .then(async (data: any) => {
        if (data.Count === 0) {
          throw new HTTPError(404, "No resources match the search criteria.");
        }

        // @ts-ignore
        const configFromAppConfig =
          (await this.getConfig()) as IDateConstraints[];

        const currentDate: number = new Date().valueOf();
        data.Items.sort((a: any, b: any) => a.id - b.id);
        const arrayOfIdsToBeRemoved: number[] = configFromAppConfig
          .filter((value: IDateConstraints) => {
            const beforeStartDate: boolean = value?.startDate
              ? new Date(value.startDate).valueOf() > currentDate
              : false;
            const afterStopDate: boolean = value?.stopDate
              ? new Date(value.stopDate).valueOf() < currentDate
              : false;
            return beforeStartDate || afterStopDate;
          })
          .map((value: IDateConstraints): number => value.id);

        // const beforeStartDate: boolean = value?.startDate ? (((currentDate - new Date(value.startDate).valueOf() >> 31) & 1) === 1)  : false;
        // const afterStopDate: boolean = value?.stopDate ? (((new Date(value.stopDate).valueOf() - currentDate >> 31) & 1) === 1)  : false;

        return data.Items.filter((value: any) => {
          return !arrayOfIdsToBeRemoved.includes(value.id);
        })
          .map((defect: any) => {
            if (defect?.restrictionsDates) {
              delete defect.restrictionsDates;
            }
            delete defect.id;
            return defect;
          })
          .sort(
            (
              first: { imNumber: number },
              second: { imNumber: number },
            ): number => {
              return first.imNumber - second.imNumber;
            },
          );
      })
      .catch((error) => {
        if (!(error instanceof HTTPError)) {
          console.log(error);
          error.statusCode = 500;
          error.body = "Internal Server Error";
        }
        throw new HTTPError(error.statusCode, error.body);
      });
  }

  public insertDefectList(defectItems: any) {
    return this.defectsDAO
      .createMultiple(defectItems)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems;
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error);
          throw new HTTPError(500, "Internal Server Error");
        }
      });
  }

  private async getConfig(): Promise<IDateConstraints[] | undefined> {
    // @ts-ignore
    // tslint:disable-next-line:radix
    const MAX_AGE: number = Number.parseInt(
      process.env.FEATURE_FLAGS_MAX_AGE ?? 5 * 60,
    );
    const ENVIRONMENT_NAME = process.env.BRANCH ?? "local";
    const APP_NAME: string =
      process.env.FEATURE_FLAGS_APP_NAME ?? "cvs-app-config";
    const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT ?? 10000;
    try {
      return (await getAppConfig("SpikeTesting-15861-configurationObject", {
        application: APP_NAME,
        environment: ENVIRONMENT_NAME,
        maxAge: MAX_AGE,
        requestTimeout: REQUEST_TIMEOUT,
        transform: "json",
      })) as IDateConstraints[];
    } catch (error) {
      // matching previous but probably bad implementation
      if (error) {
        console.error(error);
        throw new HTTPError(500, "Internal ServerError");
      }
    }
  }

  public deleteDefectList(defectItemKeys: string[]) {
    return this.defectsDAO
      .deleteMultiple(defectItemKeys)
      .then((data) => {
        if (data.UnprocessedItems) {
          return data.UnprocessedItems;
        }
      })
      .catch((error) => {
        if (error) {
          console.error(error);
          throw new HTTPError(500, "Internal ServerError");
        }
      });
  }
}
