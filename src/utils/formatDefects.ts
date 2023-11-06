import { DefectGETIVA } from "@dvsa/cvs-type-definitions/types/iva/defects/get";

interface INestedObject<T> {
  [key: string]: T | INestedObject<T>;
}

/**
 * Converts flat data from an array of objects with key value pairs to a structured nested object
 * @param flatData -  Flat data to convert
 * @returns An array of nested objects
 * @template T - The type of values in the resulting nested object
 */
export const convertFlatDataToProperJSON = <T extends DefectGETIVA>(
  flatData: Array<Record<string, any>>,
): Array<INestedObject<T>> =>
  flatData.map((flatObject) => {
    const createNestedObject = (
      flatObject: Record<string, any>,
    ): INestedObject<T> => {
      const nestedObject: INestedObject<T> = {};

      for (const key in flatObject) {
        if (!flatObject.hasOwnProperty(key)) {
          continue;
        }

        const keys = key.split("_");
        let currentLevel: any = nestedObject;

        for (let i = 0; i < keys.length - 1; i++) {
          const currentKey = keys[i];
          const isArrayKey = /^[0-9]+$/.test(keys[i + 1]);

          currentLevel = currentLevel[currentKey] ??= isArrayKey ? [] : {};
        }

        const lastKey = keys[keys.length - 1];

        currentLevel[lastKey] = (currentLevel[lastKey] ??= []).concat(
          flatObject[key],
        );
      }

      const removeSingleItemArrays = (obj: any) => {
        for (const key in obj) {
          if (Array.isArray(obj[key]) && obj[key].length === 1) {
            obj[key] = obj[key][0];
          } else if (typeof obj[key] === "object") {
            removeSingleItemArrays(obj[key]);
          }
        }
      };

      removeSingleItemArrays(nestedObject);

      return nestedObject;
    };

    return createNestedObject(flatObject);
  });
