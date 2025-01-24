export interface IDefectChild {
  ref?: string;
  deficiencyId?: string;
  deficiencySubId?: string | null;
  deficiencyCategory?: string;
  stdForProhibition?: boolean;
  deficiencyText?: string;
  deficiencyTextWelsh?: string;
  forVehicleType?: string[];
}

export interface IItem {
  itemNumber?: number;
  itemDescription?: string;
  itemDescriptionWelsh?: string;
  forVehicleType?: string[];
  deficiencies: IDefectChild[];
}

export interface IDefectParent {
  id?: number;
  imNumber: number;
  imDescription?: string;
  imDescriptionWelsh?: string;
  forVehicleType?: string[];
  additionalInfo?: any;
  items: IItem[];
}

export interface IDateRestrictions {
  effectiveFrom?: string;
  effectiveTo?: string;
}
