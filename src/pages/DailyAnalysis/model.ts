import { getWeekDailyList } from '@/services/daily';
import { Effect, Reducer } from 'umi';
import { DailyAnalysisStateType, DailyInfoType } from './data';

export interface ModelType {
  namespace: string;
  state: DailyAnalysisStateType;
  effects: {
    getWeekDailyList: Effect;
  };
  reducers: {
    saveWeekDailyList: Reducer<DailyAnalysisStateType>;
  };
}

const Model: ModelType = {
  namespace: 'dailyAnalysis',

  state: {
    categoryChartData: [],
    sumChartData: [],
    everyCategoryChartData: [],
    saturationChartData: [],
  },

  effects: {
    // 获取所有周报的信息
    *getWeekDailyList({ payload }, { call, put }) {
      const weekDailyList: DailyInfoType[] = yield call(getWeekDailyList, payload);
      // 处理四个图表用的数据，然后put

      // 类别 TODO:稍后抽作共通 TOTODO:读配置
      const categoryOptions = [
        { label: '编码', value: 'coding', },
        { label: '测试', value: 'testing' },
        { label: '文档编写', value: 'documentWriting' },
        { label: '自学', value: 'selfStudying' },
        { label: '翻译', value: 'translate' },
        { label: '准备工作', value: 'useless' },
      ];

      // 用于临时存储各种类的工作时长
      const categoryDataObj = {};

      // 初始化
      categoryOptions.forEach(category => {
        categoryDataObj[category.value] = 0;
      });

      // 各种类工作时长图表用的数据
      const categoryChartData: { category: string; value: number; }[] = [];
      // 总工作量图表用的数据
      const sumChartData: { weekNum: string; value: number; }[] = [];
      // 各工作类型时间用的数据
      const everyCategoryChartData: { type: string; weekNum: string; value: number; }[] = [];
      // 工作饱和度图表用的数据
      const saturationChartData: { weekNum: string; value: number; }[] = [];

      // 制造各个图表用的数据
      weekDailyList.forEach((info: DailyInfoType, i: number) => {
        categoryOptions.forEach(category => {
          categoryDataObj[category.value] += info[category.value];
          everyCategoryChartData.push({
            type: category.value,
            weekNum: `第${info.weekNum}周`,
            value: info[category.value],
          });
        });
        sumChartData.push({ weekNum: `第${i + 1}周`, value: info.weekWorkload });
        saturationChartData.push({ weekNum: `第${i + 1}周`, value: info.workSaturation });
      });

      categoryOptions.forEach(category => {
        categoryChartData.push({
          category: category.label,
          value: categoryDataObj[category.value],
        });
      });

      return yield put({
        type: 'saveWeekDailyList', payload: {
          categoryChartData,
          sumChartData,
          everyCategoryChartData,
          saturationChartData,
        }
      });
    },
  },

  reducers: {
    saveWeekDailyList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
}

export default Model;
