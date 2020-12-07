import DailyInfoType from '../WeekDaily/data';

interface SummaryDataType {
  weekday: string;
  coding: number;
  testing: number;
  documentWriting: number;
  selfStudying: number;
  translate: number;
  useless: number;
}

export interface AddWeekDailyType {
  dailyInfo: DailyInfoType;
  // 汇总页的table数据
  summaryData: SummaryDataType[];
}

