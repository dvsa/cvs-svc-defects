import { IDateRestrictions } from "../models/DateRestrictions";

export const filterEffectiveDates = <T extends IDateRestrictions>(
  currentDate: number,
): ((value: T) => boolean) => {
  return (value: T): boolean => {
    const currenAfterEffectiveFrom: boolean = value?.effectiveFrom
      ? currentDate >=
        new Date(value.effectiveFrom + "T00:00:00.000Z").valueOf()
      : true;

    const currentBeforeEffectiveTo: boolean = value?.effectiveTo
      ? currentDate < new Date(value.effectiveTo + "T00:00:00.000Z").valueOf()
      : true;

    return currenAfterEffectiveFrom && currentBeforeEffectiveTo;
  };
};

export const removeEffectiveDates = <T extends IDateRestrictions>(value: T) => {
  if (value?.effectiveFrom !== undefined) {
    delete value.effectiveFrom;
  }
  if (value?.effectiveTo !== undefined) {
    delete value.effectiveTo;
  }
};
