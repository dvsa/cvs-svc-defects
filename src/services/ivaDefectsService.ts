import {
  DefectGETIVA,
  EUVehicleCategory,
  InspectionType,
  VehicleType,
} from "@dvsa/cvs-type-definitions/types/iva/defects/get/index";

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
          euVehicleCategories: ["m1"],
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
          euVehicleCategories: ["m1"],
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
