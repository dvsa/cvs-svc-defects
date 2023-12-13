import { RequiredStandard } from "./RequiredStandard";

export interface IVADefect{
euVehicleCategory: string;
sectionNumber: string;
sectionDescription: string;
requiredStandards: RequiredStandard[]
}