import { IDateRestrictions } from "../../src/models/DateRestrictions";
import {
  filterEffectiveDates,
  removeEffectiveDates,
} from "../../src/utils/DateRestrictions";

describe("ConfigurationUtil", () => {
  describe("Testing filterEffectiveDates()", () => {
    context("when object is passed in with current date", () => {
      it("should return true when effectiveFrom is equal to currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveFrom: IDateRestrictions = {
          effectiveFrom: "2025-01-01",
        };
        expect(
          filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveFrom,
          ),
        ).toBe(true);
      });

      it("should return false when effectiveFrom is greater than currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveFrom: IDateRestrictions = {
          effectiveFrom: "2025-01-02",
        };
        expect(
          filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveFrom,
          ),
        ).toBe(false);
      });

      it("should return true when effectiveTo is greater than currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveTo: IDateRestrictions = {
          effectiveTo: "2025-01-02",
        };
        expect(
          filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveTo,
          ),
        ).toBe(true);
      });

      it("should return false when effectiveTo is less than currentDate", () => {
        const currentDate = new Date("2025-01-02").valueOf();
        const objectWithEffectiveTo: IDateRestrictions = {
          effectiveTo: "2025-01-01",
        };
        expect(
          filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveTo,
          ),
        ).toBe(false);
      });

      it("should return true when effectiveFrom is less than currentDate and effectiveTo is greater than currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveFromAndTo: IDateRestrictions = {
          effectiveFrom: "2024-12-31",
          effectiveTo: "2025-01-02",
        };
        expect(
          filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveFromAndTo,
          ),
        ).toBe(true);
      });

      it("should return false when effectiveFrom is greater than currentDate and effectiveTo is less than currentDate", () => {
        const currentDate = new Date("2025-01-01").valueOf();
        const objectWithEffectiveFromAndTo: IDateRestrictions = {
          effectiveFrom: "2025-01-02",
          effectiveTo: "2024-12-31",
        };
        expect(
          filterEffectiveDates<IDateRestrictions>(currentDate)(
            objectWithEffectiveFromAndTo,
          ),
        ).toBe(false);
      });
    });
  });

  describe("Testing removeEffectiveDates()", () => {
    it("should remove effectiveFrom property if it exists", () => {
      const objectWithEffectiveFrom: IDateRestrictions = {
        effectiveFrom: "2025-01-01",
      };
      removeEffectiveDates<IDateRestrictions>(objectWithEffectiveFrom);
      expect(objectWithEffectiveFrom.effectiveFrom).toBeUndefined();
    });

    it("should remove effectiveTo property if it exists", () => {
      const objectWithEffectiveTo: IDateRestrictions = {
        effectiveTo: "2025-01-01",
      };
      removeEffectiveDates<IDateRestrictions>(objectWithEffectiveTo);
      expect(objectWithEffectiveTo.effectiveTo).toBeUndefined();
    });

    it("should remove both effectiveFrom and effectiveTo properties if they exist", () => {
      const objectWithBoth: IDateRestrictions = {
        effectiveFrom: "2025-01-01",
        effectiveTo: "2025-01-02",
      };
      removeEffectiveDates<IDateRestrictions>(objectWithBoth);
      expect(objectWithBoth.effectiveFrom).toBeUndefined();
      expect(objectWithBoth.effectiveTo).toBeUndefined();
    });

    it("should not throw an error if effectiveFrom and effectiveTo properties do not exist", () => {
      const objectWithoutDates: IDateRestrictions = {};
      expect(() =>
        removeEffectiveDates<IDateRestrictions>(objectWithoutDates),
      ).not.toThrow();
    });
  });
});
