import { addWeekDaily, getWeekDailyInfo, updateWeekDaily } from '@/services/daily';
import { getEffectiveCategoryList, getWorkCategoryList } from '@/utils/utils';
import { Effect, Reducer } from 'umi';
import { AddWeekDailyType } from './data';

export interface ModelType {
  namespace: string;
  state: AddWeekDailyType;
  effects: {
    getWeekDailyInfo: Effect;
    saveWeekDaily: Effect;
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
      monday: { date: '', sumCost: 0, workInfos: [] },
      tuesday: { date: '', sumCost: 0, workInfos: [] },
      wednesday: { date: '', sumCost: 0, workInfos: [] },
      thursday: { date: '', sumCost: 0, workInfos: [] },
      friday: { date: '', sumCost: 0, workInfos: [] },
      saturday: { date: '', sumCost: 0, workInfos: [] },
      sunday: { date: '', sumCost: 0, workInfos: [] },
    },
  },

  effects: {
    // 获取某一周的周报信息
    *getWeekDailyInfo({ payload }, { call, put }) {
      const info = yield call(getWeekDailyInfo, payload);
      return yield put({
        type: 'saveDailyInfo', payload: {
          dailyInfo: info
        },
      })
    },

    // 新增或更新一周的周报信息
    *saveWeekDaily({ payload }, { call, put }) {
      const weekDailyInfoObj = {};
      // 工作类别
      const categoryOptions = getWorkCategoryList();
      // 有效的工作类别 TODO:工作效率weekWorkload的结果最好不往db存吧？直接在前台计算显示就行，这样可拓展性更高一点
      const effectiveCategory = getEffectiveCategoryList();

      const weekData = {};
      // 该周的总工作量
      let sumWeekWorkload = 0;
      // 工作日
      let weekDayCount = 0;
      Object.getOwnPropertyNames(payload.dailyInfo.weekData).forEach(weekDay => {
        // 如果没点过该日的Tab页，生成个都为0的
        if (!payload.dailyInfo.weekData[weekDay].workInfos) {
          const emptyObj = {};
          categoryOptions.forEach(category => {
            emptyObj[category.value] = 0;
          });
          weekData[weekDay] = {
            workInfos: [],
            ps: '',
          };
        } else {
          // 计算工作日
          if (payload.dailyInfo.weekData[weekDay].workInfos.length !== 0) {
            weekDayCount++;
          }
          // 分类别计算工作时长
          categoryOptions.forEach(category => {
            // 初始化类别总计的值为0
            if (!weekDailyInfoObj[category.value]) {
              weekDailyInfoObj[category.value] = 0;
            }
            payload.dailyInfo.weekData[weekDay].workInfos.forEach((current: { category: string; cost: number; }) => {
              if (current.category === category.label) {
                sumWeekWorkload += current.cost;
                weekDailyInfoObj[category.value] += current.cost;
              }
            });
          });
          weekData[weekDay] = {
            ...payload.dailyInfo.weekData[weekDay],
          };
        }
      });
      // 有效工作时长
      const effectiveWorkload = effectiveCategory.reduce((acc, effective) => {
        return acc + weekDailyInfoObj[effective.value];
      }, 0);

      weekDailyInfoObj['weekNum'] = payload.dailyInfo.weekNum;
      weekDailyInfoObj['timeInterval'] = payload.dailyInfo.timeInterval;
      weekDailyInfoObj['weekData'] = weekData;
      weekDailyInfoObj['weekWorkload'] = sumWeekWorkload;
      weekDailyInfoObj['weekday'] = weekDayCount;
      weekDailyInfoObj['averageWorkload'] = weekDayCount === 0 ? 0 : Number((sumWeekWorkload / weekDayCount).toFixed(1));
      weekDailyInfoObj['workSaturation'] = Number((effectiveWorkload / sumWeekWorkload).toFixed(1));

      // 新建的情况
      if (!payload.updateFlg) {
        return yield call(addWeekDaily, weekDailyInfoObj);
      }
      return yield call(updateWeekDaily, weekDailyInfoObj);
    },
  },

  reducers: {
    saveDailyInfo(state, action) {
      const temp = {
        ...state,
        ...action.payload.dailyInfo
      };
      return temp;
    },

    // 每一天的数据更新后触发
    saveDayInfo(state, action) {
      return {
        ...state,
        weekData: {
          ...state?.weekData,
          ...action.payload.weekData,
        }
      }
    },

    // 清除数据
    clearState(state, action) {
      return {
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
          monday: { date: '', sumCost: 0, workInfos: [] },
          tuesday: { date: '', sumCost: 0, workInfos: [] },
          wednesday: { date: '', sumCost: 0, workInfos: [] },
          thursday: { date: '', sumCost: 0, workInfos: [] },
          friday: { date: '', sumCost: 0, workInfos: [] },
          saturday: { date: '', sumCost: 0, workInfos: [] },
          sunday: { date: '', sumCost: 0, workInfos: [] },
        },
      }
    }
  },
}

export default AddWeekDailyModel;