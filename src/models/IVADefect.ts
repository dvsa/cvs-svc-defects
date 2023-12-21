import { IRequiredStandard } from "./RequiredStandard";

export interface IIVADefect {
  euVehicleCategory: string;
  sectionNumber: string;
  sectionDescription: string;
  requiredStandards: IRequiredStandard[];
}

export interface newDefectGETIVA {
  euVehicleCategory: string;
  basic: SectionIVA[];
  normal: SectionIVA[];
}

export type InspectionType = "basic" | "normal";

export interface SectionIVA {
  sectionNumber: string;
  sectionDescription: string;
  requiredStandards: {
    rsNumber: number;
    requiredStandard: string;
    refCalculation: string;
    additionalInfo: boolean;
    inspectionTypes: InspectionType[];
  }[];
  additionalInformation?: {
    notes: string;
  };
}
