export interface IConfig {
  id: number;
  config: IDateConstraints[];
}

export interface IDateConstraints {
  startDate: string;
  stopDate: string;
}
