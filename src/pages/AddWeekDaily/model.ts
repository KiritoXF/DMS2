import { exportDailyInfo, getWeekDailyInfo, getWeekDailyList, importDailyInfo } from '@/services/daily';
import { Effect, Reducer } from 'umi';
import { AddWeekDailyType } from './data';

export interface ModelType {
  namespace: string;
  state: AddWeekDailyType;
  effects: {
    getWeekDailyInfo: Effect;
  };
  reducers: {
    saveDailyInfo: Reducer<AddWeekDailyType>;
    clearState: Reducer<AddWeekDailyType>;
  };
}


const AddWeekDailyModel: ModelType = {
  namespace: 'addWeekDaily',

  state: {
    dailyInfo: {}
  },

  effects: {
    // 获取某一周的周报信息
    *getWeekDailyInfo({ payload }, { call, put }) {
      const info = yield call(getWeekDailyInfo, payload);
      yield put({
        type: 'saveDailyInfo', payload: {
          dailyInfo: info
        },
      })
      return info;
    },

  },

  reducers: {
    saveDailyInfo(state, action) {
      return {
        ...state,
        ...action.payload,
        dailyInfo: { ...action.payload.dailyInfo },
      };
    },

    // 清除数据
    clearState(state, action) {
      return {
        dailyInfo: {}
      }
    }
  },
}

export default AddWeekDailyModel;
