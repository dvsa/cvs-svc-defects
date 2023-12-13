import { IRequiredStandard } from "./RequiredStandard";

export interface IIVADefect {
  euVehicleCategory: string;
  sectionNumber: string;
  sectionDescription: string;
  requiredStandards: IRequiredStandard[];
}
