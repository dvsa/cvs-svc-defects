export interface IConfig {
  id: number;
  config: IDateConstraints[];
}

export interface IDateConstraints {
  id: number;
  startDate: string;
  stopDate: string;
}
