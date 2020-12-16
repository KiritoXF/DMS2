import DailyInfoType from '../WeekDaily/data';

interface SummaryDataType {
  weekday: string;
  date?: string;
  coding: number;
  testing: number;
  documentWriting: number;
  selfStudying: number;
  translate: number;
  useless: number;
}
interface DayInfoType {
  date: string;
  sumCost: number;
  ps?: string;
  workInfos: WorkInfoType[];
}

export interface AddWeekDailyType {
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
