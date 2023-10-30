import { convertFlatDataToProperJSON } from "../../src/utils/formatDefects";

describe("convertFlatDataToProperJSON", () => {
  it("should convert flat data to proper JSON", () => {
    const flatData = [
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes_0: "Cars",
        euVehicleCategories_0: "M1",
        requiredStandards_0_rsNumber: 1,
        requiredStandards_0_requiredStandard:
          "The exhaust must be securely mounted.",
        requiredStandards_0_refCalculation: "1.1",
        requiredStandards_0_additionalInfo: true,
        requiredStandards_0_inspectionTypes_0: "basic",
        requiredStandards_1_rsNumber: 2,
        requiredStandards_1_requiredStandard:
          "The exhaust must have all components secure.",
        requiredStandards_1_refCalculation: "1.2",
        requiredStandards_1_additionalInfo: true,
        requiredStandards_1_inspectionTypes_0: "basic",
      },
    ];

    const expectedResult = [
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes: ["Cars"],
        euVehicleCategories: ["M1"],
        requiredStandards: [
          {
            rsNumber: 1,
            requiredStandard: "The exhaust must be securely mounted.",
            refCalculation: "1.1",
            additionalInfo: true,
            inspectionTypes: ["basic"],
          },
          {
            rsNumber: 2,
            requiredStandard: "The exhaust must have all components secure.",
            refCalculation: "1.2",
            additionalInfo: true,
            inspectionTypes: ["basic"],
          },
        ],
      },
    ];

    const result = convertFlatDataToProperJSON(flatData);
    expect(result).toEqual(expectedResult);
  });

  it("should handle empty input data", () => {
    const flatData: Array<Record<string, any>> = [];
    const result = convertFlatDataToProperJSON(flatData);
    expect(result).toEqual([]);
  });

  it("should convert a flat object to a nested object", () => {
    const flatData = [
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes_0: "Cars",
        euVehicleCategories_0: "M1",
      },
    ];

    const result = convertFlatDataToProperJSON(flatData);

    expect(result).toEqual([
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes: ["Cars"],
        euVehicleCategories: ["M1"],
      },
    ]);
  });

  it("should convert a flat object with array values to a nested object with arrays", () => {
    const flatData = [
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes_0: "Cars",
        euVehicleCategories_0: "M1",
        vehicleTypes_1: "Bikes",
        euVehicleCategories_1: "L1",
      },
    ];

    const result = convertFlatDataToProperJSON(flatData);

    expect(result).toEqual([
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes: ["Cars", "Bikes"],
        euVehicleCategories: ["M1", "L1"],
      },
    ]);
  });

  it("should handle a flat object with no data", () => {
    const flatData = [{}];
    const result = convertFlatDataToProperJSON(flatData);

    expect(result).toEqual([{}]);
  });

  it("should convert a flat object with duplicate keys", () => {
    const flatData = [
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes_0: "Cars",
        vehicleTypes_1: "Bikes",
      },
    ];

    const result = convertFlatDataToProperJSON(flatData);

    expect(result).toEqual([
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes: ["Cars", "Bikes"],
      },
    ]);
  });

  it("should convert a flat object with numeric and non-numeric keys", () => {
    const flatData = [
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes_0: "Cars",
        vehicleTypes_x: "Bikes",
      },
    ];

    const result = convertFlatDataToProperJSON(flatData);

    expect(result).toEqual([
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes: ["Cars"],
      },
    ]);
  });

  it("should handle an empty input array", () => {
    const flatData: Array<Record<string, any>> = [];
    const result = convertFlatDataToProperJSON(flatData);

    expect(result).toEqual([]);
  });

  it("should handle a flat object with both arrays and non-array keys", () => {
    const flatData = [
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes_0: "Cars",
        vehicleTypes_1: "Bikes",
        euVehicleCategories_0: "M1",
        euVehicleCategories_1: "L1",
        requiredStandards_0_requiredStandard: "Standard 1",
        requiredStandards_1_requiredStandard: "Standard 2",
      },
    ];

    const result = convertFlatDataToProperJSON(flatData);

    expect(result).toEqual([
      {
        sectionNumber: "01",
        sectionDescription: "Noise",
        vehicleTypes: ["Cars", "Bikes"],
        euVehicleCategories: ["M1", "L1"],
        requiredStandards: [
          {
            requiredStandard: "Standard 1",
          },
          {
            requiredStandard: "Standard 2",
          },
        ],
      },
    ]);
  });
});
