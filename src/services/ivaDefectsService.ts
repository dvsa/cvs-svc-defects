import {EUVehicleCategory} from "@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum";
import {IvaDatabaseService} from "./ivaDatabaseService";
import {HTTPError} from "../models/HTTPError";
import {IIVADefect, newDefectGETIVA, SectionIVA} from "../models/IVADefect";
import {DefectGETIVA, InspectionType} from "@dvsa/cvs-type-definitions/types/iva/defects/get";


export class IvaDefectsService {
    public readonly ivaDatabaseService: IvaDatabaseService;

    /**
     * Constructor for the IvaDefectsService class
     * @param ivaDatabaseService the IVA database service
     */
    constructor(ivaDatabaseService: IvaDatabaseService) {
        this.ivaDatabaseService = ivaDatabaseService;
    }

    /**
     * Retrieves IVA Defects based on the optionally provided euVehicleCategory, and inspectionType and formats the response
     * @param euVehicleCategory the EU Vehicle Category
     * @param basicInspection the Inspection Type
     * @returns Array of IVA Defects
     */
    public async getIvaDefects(
        euVehicleCategory: EUVehicleCategory | null,
        basicInspection: boolean | false
    ): Promise<DefectGETIVA[]> {
        try {
            const results = await this.ivaDatabaseService.getDefectsByCriteria(
                euVehicleCategory,
                basicInspection
            );

            return [];
        } catch (error) {
            this.handleUnexpectedError(error);
            throw new HTTPError(500, "Internal Server Error");
        }
    }

    /**
     * Retrieves IVA Defects based on the provided manualId and formats the response
     * @param euVehicleCategory euVehicleCategory id
     * @returns Array of IVA Defects
     */
    public async getIvaDefectsByEUVehicleCategory(
        euVehicleCategory: string
    ): Promise<newDefectGETIVA> {
        try {
            const results = (await this.ivaDatabaseService.getDefectsByEUVehicleCategory(
                euVehicleCategory
            )) as IIVADefect[];

            return this.formatIvaDefects(results, euVehicleCategory);
        } catch (error) {
            this.handleUnexpectedError(error);
            throw new HTTPError(500, "Internal Server Error");
        }
    }

    /**
     * Helper function to handle unexpected errors
     * @param error the error object
     */
    private handleUnexpectedError(error: any): void {
        if (!(error instanceof HTTPError)) {
            console.error("Unexpected error:", error);
        }
    }

    /**
     * Get enum key by enum value
     * @param myEnum the enum object
     * @param enumValue the enum value
     * @returns the enum key or undefined
     */
    public getEnumKeyByEnumValue<T extends Record<string, string>>(
        myEnum: T,
        enumValue: string
    ): keyof T | undefined {
        return Object.keys(myEnum).find((key) => myEnum[key] === enumValue);
    }

    /**
     * Transforms an array of standards by adding an inspectionTypes property based on normalInspection and basicInspection
     * @param {any[]} standards - The array of standards to transform.
     * @returns {any[]} - The transformed array of standards.
     */
    private transformStandards(standards: any[]): any[] {
        return standards
            .map((x) => ({
                ...x,
                inspectionTypes: (x.normalInspection && x.basicInspection)
                    ? ["basic", "normal"] as InspectionType[]
                    : x.basicInspection
                        ? ["basic"] as InspectionType[]
                        : ["normal"] as InspectionType[],
            }))
            .filter((std) => std.inspectionTypes.length > 0);
    }

    /**
     * Formats IVA Defects inspection types based on the provided section
     * @param {IIVADefect[]} sections - Array of IVA Defect sections
     * @returns {SectionIVA[]} - Formatted array of SectionIVA.
     */
    public formatInspectionTypes(sections: IIVADefect[]): SectionIVA[] {
        return sections
            .map((x) => ({
                sectionNumber: x.sectionNumber,
                sectionDescription: x.sectionDescription,
                requiredStandards: this.transformStandards(x.requiredStandards),
            }))
            .filter((section) => section.requiredStandards.length > 0) as SectionIVA[];
    }

    /**
     * Formats IVA Defects based on the provided results and EU vehicle category
     * @param {IIVADefect[]} results - Array of IVA Defect results
     * @param {string} euVehicleCategory - EU vehicle category
     * @returns {newDefectGETIVA} - Formatted IVA Defects object
     */
    public formatIvaDefects(results: IIVADefect[], euVehicleCategory: string): newDefectGETIVA {
        const euVehicleCategoryFromEnum = this.getEnumKeyByEnumValue(EUVehicleCategory, euVehicleCategory) || '';

        const filterSections = (filterFn: (x: any) => boolean) => results
            .filter((x) => x.requiredStandards.some(filterFn))
            .map(({ requiredStandards, ...x }) => ({
                ...x,
                requiredStandards: this.transformStandards(requiredStandards),
            }));

        return {
            euVehicleCategory: euVehicleCategoryFromEnum,
            basic: this.formatInspectionTypes(filterSections((x) => x.basicInspection)),
            normal: this.formatInspectionTypes(
                filterSections((x) => x.normalInspection || (!x.basicInspection && !x.normalInspection))
            ),
        };
    }
}
