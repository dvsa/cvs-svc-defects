import { DefectGETIVA  } from '@dvsa/cvs-type-definitions/types/iva/defects/get/index'

export class IvaDefectsService {  
    public getIvaDefects(manualId: string) : Promise<DefectGETIVA[]> {
        return new Promise((resolve) => {
            const mockIvaDefects: DefectGETIVA[] = [
                {
                    sectionNumber: "01",
                    sectionDescription: "Noise",
                    vehicleTypes: "hgv",
                    euVehicleCategories: "m1",
                    requiredStandards: [
                        {
                            rsNumber: 1,
                            requiredStandard: "A mock standard",
                            refCalculation: "1.1",
                            additionalInfo: true,
                            inspectionTypes: "basic"
                        }
                    ]
                }
            ];

            resolve(mockIvaDefects);
        });
    }
}