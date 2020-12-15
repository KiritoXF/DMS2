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

export interface AddWeekDailyType {
  dailyInfo: DailyInfoType;
}
