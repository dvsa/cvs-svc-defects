import {
  DefectGETIVA,
  InspectionType,
  VehicleType,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get";
import {EUVehicleCategory} from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";

export class IvaDefectsService {
  public getIvaDefects(
    vehicleType: VehicleType | null,
    euVehicleCategory: EUVehicleCategory | null,
    inspectionType: InspectionType | null,
  ): Promise<DefectGETIVA[]> {
    return new Promise((resolve) => {
      const mockIvaDefects: DefectGETIVA[] = [
        {
          sectionNumber: "01",
          sectionDescription: "Noise",
          vehicleTypes: ["hgv"],
          euVehicleCategories: [EUVehicleCategory.M1],
          requiredStandards: [
            {
              rsNumber: 1,
              requiredStandard: "A mock standard",
              refCalculation: "1.1",
              additionalInfo: true,
              inspectionTypes: ["basic"],
            },
          ],
        },
      ];

      resolve(mockIvaDefects);
    });
  }

  public getIvaDefectsByManualId(manualId: string): Promise<DefectGETIVA[]> {
    return new Promise((resolve) => {
      const mockIvaDefects: DefectGETIVA[] = [
        {
          sectionNumber: "01",
          sectionDescription: "Noise",
          vehicleTypes: ["hgv"],
          euVehicleCategories: [EUVehicleCategory.M1],
          requiredStandards: [
            {
              rsNumber: 1,
              requiredStandard: "A mock standard",
              refCalculation: "1.1",
              additionalInfo: true,
              inspectionTypes: ["basic"],
            },
          ],
        },
      ];

      resolve(mockIvaDefects);
    });
  }
}
