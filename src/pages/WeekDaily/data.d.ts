// 周报的类型
export interface WeekDailyType {
  weekDailyList: DailyInfoType[];
  startList: [{ label: string, value: number }];
  endList: [{ label: string, value: number }];
}

// 日报的类型
export interface DailyInfoType {
  timeInterval: String;
  weekNum: number;
  coding: number;
  testing: number;
  documentWriting: number;
  selfStudying: number;
  translate: number;
  useless: number;
  weekWorkload: number;
  weekday: number;
  averageWorkload: number;
  workSaturation: number;
  weekData: String;
}