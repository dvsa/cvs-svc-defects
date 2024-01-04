import { IRequiredStandard } from "./RequiredStandard";

export interface IIVADefect {
  euVehicleCategory: string;
  sectionNumber: string;
  sectionDescription: string;
  requiredStandards: IRequiredStandard[];
}

export interface INewDefectGETIVA {
  euVehicleCategory: string;
  basic: ISectionIVA[];
  normal: ISectionIVA[];
}

export type InspectionType = "basic" | "normal";

export interface ISectionIVA {
  sectionNumber: string;
  sectionDescription: string;
  requiredStandards: Array<{
    rsNumber: number;
    requiredStandard: string;
    refCalculation: string;
    additionalInfo: boolean;
    inspectionTypes: InspectionType[];
  }>;
  additionalInformation?: {
    notes: string;
  };
}
