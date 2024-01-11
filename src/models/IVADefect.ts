import { IRequiredStandard } from "./RequiredStandard";

export interface ITaxonomySectionIVA {
  euVehicleCategory: string;
  sectionNumber: string;
  sectionDescription: string;
  requiredStandards: IRequiredStandard[];
}
