import { IRequiredStandard } from "./RequiredStandard";

export interface IIVATaxonomySection {
  euVehicleCategory: string;
  sectionNumber: string;
  sectionDescription: string;
  requiredStandards: IRequiredStandard[];
}
