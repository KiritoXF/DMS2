import { getWeekDailyList, importDailyInfo } from '@/services/daily';
import { Effect, Reducer } from 'umi';
import { DailyInfoType, WeekDailyType } from './data';

export interface ModelType {
  namespace: string;
  state: WeekDailyType;
  effects: {
    getWeekDailyList: Effect;
    importDailyInfo: Effect;
  };
  reducers: {
    saveWeekDailyList: Reducer<WeekDailyType>;
  };
}


const Model: ModelType = {
  namespace: 'weekDaily',

  state: {
    weekDailyList: [],
    startList: [{ label: '', value: 0 }],
    endList: [{ label: '', value: 0 }],
  },

  effects: {
    // 获取所有周报的信息
    *getWeekDailyList({ payload }, { call, put }) {
      const infos = yield call(getWeekDailyList, payload);
      const startList = infos.map((info: DailyInfoType) => {
        return {
          label: info.timeInterval,
          value: info.weekNum - 1
        }
      });
      debugger;
      yield put({
        type: 'saveWeekDailyList', payload: {
          weekDailyList: infos,
          startList: startList,
          endList: startList,
          // total: data.assetInfos.count,
        }
      });
    },

    // 导入CSV文件
    *importDailyInfo({ payload }, { call, put }) {
      yield call(importDailyInfo, payload);
    }

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
