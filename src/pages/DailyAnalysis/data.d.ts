
export interface DailyAnalysisStateType {
  // 各种类工作时长图表的数据
  categoryChartData?: any[];
  // 总工作量图表的数据
  sumChartData?: any[];
  // 各工作类型时间变化图表的数据
  everyCategoryChartData?: any[];
  // 工作饱和度图表的数据
  saturationChartData?: any[];
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