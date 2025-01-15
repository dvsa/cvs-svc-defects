import { HTTPError } from "../models/HTTPError";
import { DefectsDAO } from "../models/DefectsDAO";
import { IRestrictionsDates } from "../models/RestrictionDates";

export class DefectsService {
  public readonly defectsDAO: DefectsDAO;

  constructor(defectsDAO: DefectsDAO) {
    this.defectsDAO = defectsDAO;
  }

  public getDefectList() {
    return this.defectsDAO
      .getAll()
      .then((data: any) => {
        if (data.Count === 0) {
          throw new HTTPError(404, "No resources match the search criteria.");
        }
        const currentDate: number = new Date().valueOf();
        return data.Items.filter((value: any) => {
          const {
            restrictionsDates,
          }: { restrictionsDates: IRestrictionsDates } = value;
          if (restrictionsDates) {
            const afterStartDate: boolean = !restrictionsDates?.startDate
              ? true
              : currentDate >= new Date(restrictionsDates.startDate).valueOf();
            const beforeStopDate: boolean = !restrictionsDates?.stopDate
              ? true
              : currentDate <= new Date(restrictionsDates.stopDate).valueOf();
            return afterStartDate && beforeStopDate;
          }
          return true;
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
          console.error(error);
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
