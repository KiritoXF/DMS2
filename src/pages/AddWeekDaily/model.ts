import { addWeekDaily, exportDailyInfo, getWeekDailyInfo, getWeekDailyList, importDailyInfo, updateWeekDaily } from '@/services/daily';
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
    saveSummaryData: Reducer<AddWeekDailyType>;
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
    },
    summaryData: [
      { weekday: 'monday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
      { weekday: 'tuesday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
      { weekday: 'wednesday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
      { weekday: 'thursday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
      { weekday: 'friday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
      { weekday: 'saturday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
      { weekday: 'sunday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
    ],
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
      debugger;
      return yield call(addWeekDaily, payload.dailyInfo);
    },

  },

  reducers: {
    saveDailyInfo(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    // 每一天的数据更新后触发
    saveDayInfo(state, action) {
      return {
        ...state,
        dailyInfo: {
          ...state?.dailyInfo,
          weekData: {
            ...state?.dailyInfo.weekData,
            ...action.payload.dailyInfo,
          }
        },
        summaryData: [
          { weekday: 'monday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
          { weekday: 'tuesday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
          { weekday: 'wednesday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
          { weekday: 'thursday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
          { weekday: 'friday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
          { weekday: 'saturday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
          { weekday: 'sunday', coding: 0, testing: 0, documentWriting: 0, selfStudying: 0, translate: 0, useless: 0 },
        ],
      }
    },

    // 更新汇总table的数据
    saveSummaryData(state, action) {
      return {
        ...state,
        dailyInfo: {
          ...state?.dailyInfo
        },
        summaryData: action.payload.summaryData,
      }
    },

    // 清除数据
    clearState(state, action) {
      return {
        dailyInfo: {},
        summaryData: [],
      }
    }
  },
}

export default AddWeekDailyModel;
