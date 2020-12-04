import { exportDailyInfo, getWeekDailyInfo, getWeekDailyList, importDailyInfo, updateWeekDaily } from '@/services/daily';
import { Effect, Reducer } from 'umi';
import { AddWeekDailyType } from './data';

export interface ModelType {
  namespace: string;
  state: AddWeekDailyType;
  effects: {
    getWeekDailyInfo: Effect;
    updateWeekDaily: Effect;
    addWeekDaily: Effect;
  };
  reducers: {
    saveDailyInfo: Reducer<AddWeekDailyType>;
    saveDayInfo: Reducer<AddWeekDailyType>;
    clearState: Reducer<AddWeekDailyType>;
  };
}


const AddWeekDailyModel: ModelType = {
  namespace: 'addWeekDaily',

  state: {
    dailyInfo: {
      timeInterval: '',
      weekNum: 0,
      coding: 0,
      testing: 0,
      documentWriting: 0,
      selfStudying: 0,
      translate: 0,
      useless: 0,
      weekWorkload: 0,
      weekday: 0,
      averageWorkload: 0,
      workSaturation: 0,
      weekData: {
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {},
      },
    }
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

    // 更新某一周的周报信息
    *updateWeekDaily({ payload }, { call, put }) {
      return yield call(updateWeekDaily, payload.dailyInfo);
    },

    // 新增一周的周报信息
    *addWeekDaily({ payload }, { call, put }) {
      const t = 1;
      debugger;
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

    // 每一天的数据更新后触发
    saveDayInfo(state, action) {
      return {
        ...state,
        dailyInfo: {
          ...state?.dailyInfo,
          [action.payload.week]: action.payload.dayInfo,
        }
      }
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
