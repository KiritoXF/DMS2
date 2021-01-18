import DailyInfoType from '../WeekDaily/data';
import WorkInfoType from '../WeekDaily/data';

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

interface WeekDataType {
  monday: DayInfoType,
  tuesday: DayInfoType,
  wednesday: DayInfoType,
  thursday: DayInfoType,
  friday: DayInfoType,
  saturday: DayInfoType,
  sunday: DayInfoType,
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
  weekData: WeekDataType;
}
