import { DefectsDAO } from "./../../src/models/DefectsDAO";
import defects from "../resources/defects.json";
import { cloneDeep } from "lodash";

export const populateDatabase = async () => {
  const defectsMockDB = cloneDeep(defects);
  const defectsDAO = new DefectsDAO();

  const batches = [];
  while (defectsMockDB.length > 0) {
    batches.push(defectsMockDB.splice(0, 25));
  }

  for (const batch of batches) {
    await defectsDAO.createMultiple(batch);
  }
};

export const emptyDatabase = async () => {
  const ids = cloneDeep(defects).map((defect) => defect.id);
  const preparersDAO = new DefectsDAO();

  const batches = [];
  while (ids.length > 0) {
    batches.push(ids.splice(0, 25));
  }

  for (const batch of batches) {
    // @ts-ignore defect ids are numbers! need to fix types in the whole service
    await preparersDAO.deleteMultiple(batch);
  }
};
