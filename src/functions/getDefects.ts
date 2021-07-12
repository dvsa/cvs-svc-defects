import { Handler } from "aws-lambda";
import { DefectsDAO } from "../models/DefectsDAO";
import { DefectsService } from "../services/DefectsService";
import { HTTPResponse } from "../models/HTTPResponse";

export const getDefects: Handler = async () => {
  const defectsDAO = new DefectsDAO();
  const defectsService = new DefectsService(defectsDAO);

  return defectsService
    .getDefectList()
    .then((data: any) => {
      return new HTTPResponse(200, data);
    })
    .catch((error: any) => {
      return new HTTPResponse(error.statusCode, error.body);
    });
};
