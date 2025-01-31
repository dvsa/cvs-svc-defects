import { HTTPError } from "../models/HTTPError";
import { DefectsDAO } from "../models/DefectsDAO";
import { IDefectChild, IDefectParent, IItem } from "../models/Defects";
import { ScanOutput } from "@aws-sdk/client-dynamodb";
import { Configuration } from "../utils/Configuration";
import {
  filterEffectiveDates,
  removeEffectiveDates,
} from "../utils/DateRestrictions";
import { IDateRestrictions } from "../models/DateRestrictions";

export class DefectsService {
  public readonly defectsDAO: DefectsDAO;
  private readonly config: Configuration;

  constructor(defectsDAO: DefectsDAO) {
    this.defectsDAO = defectsDAO;
    this.config = Configuration.getInstance();
  }

  public async getDefectList(): Promise<IDefectParent[]> {
    let defectDBResult: ScanOutput;
    try {
      defectDBResult = (await this.defectsDAO.getAll()) as ScanOutput;
    } catch (e) {
      const error = e as { statusCode: number; body: string };
      if (!(error instanceof HTTPError)) {
        console.error(error);
        error.statusCode = 500;
        error.body = "Internal Server Error";
      }
      throw new HTTPError(error.statusCode, error.body);
    }

    const arrayOfDefectParent: IDefectParent[] =
      defectDBResult.Items as unknown as IDefectParent[];
    if (defectDBResult.Count === 0) {
      throw new HTTPError(404, "No resources match the search criteria.");
    }

    const dateToUse: number | null = this.config.getCurrentDateOverride();
    const currentDate: number = dateToUse ?? new Date().valueOf();
    arrayOfDefectParent
      .map((defectParent: IDefectParent) => {
        defectParent.items = defectParent.items.filter(
          filterEffectiveDates<IDefectChild & IDateRestrictions>(currentDate),
        );
        defectParent.items.map((item: IItem & IDateRestrictions) => {
          item.deficiencies = item.deficiencies.filter(
            filterEffectiveDates<IDefectChild & IDateRestrictions>(currentDate),
          );
          item.deficiencies.map(
            removeEffectiveDates<IDefectChild & IDateRestrictions>,
          );
          removeEffectiveDates<IItem & IDateRestrictions>(item);
        });
        delete defectParent.id;
        return defectParent;
      })
      .sort((first: IDefectParent, second: IDefectParent): number => {
        return first.imNumber - second.imNumber;
      });
    return arrayOfDefectParent;
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
