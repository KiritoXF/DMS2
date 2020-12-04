// 周报的类型
export interface WeekDailyType {
  weekDailyList: DailyInfoType[];
  startList: [{ label: string, value: number }];
  endList: [{ label: string, value: number }];
}

// 每天的工作内容数组的类型
export interface WorkInfoType {
  id: number;
  title: string;
  cost: number;
  category: string;
}

// 每天的数据的类型
export interface DayInfoType {
  date: string;
  sumCost: number;
  ps?: string;
  workInfos: WorkInfoType[];
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
  weekData: {
    monday: DayInfoType,
    tuesday: DayInfoType,
    wednesday: DayInfoType,
    thursday: DayInfoType,
    friday: DayInfoType,
    saturday: DayInfoType,
    sunday: DayInfoType,
  };
}