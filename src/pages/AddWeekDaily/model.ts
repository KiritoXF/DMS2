import { addWeekDaily, getWeekDailyInfo, updateWeekDaily } from '@/services/daily';
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
    },
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
      const weekDailyInfoObj = {};
      // 类别 TODO:稍后抽作共通 TOTODO:读配置
      const categoryOptions = [
        { label: '编码', value: 'coding', },
        { label: '测试', value: 'testing' },
        { label: '文档编写', value: 'documentWriting' },
        { label: '自学', value: 'selfStudying' },
        { label: '翻译', value: 'translate' },
        { label: '准备工作', value: 'useless' },
      ];
      // 有效的工作类别 TODO:工作效率weekWorkload的结果最好不往db存吧？直接在前台计算显示就行，这样可拓展性更高一点
      const effectiveCategory = ['coding', 'testing', 'documentWriting'];

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
              if (current.category === category.value) {
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
        return acc + weekDailyInfoObj[effective];
      }, 0);

      weekDailyInfoObj['weekNum'] = payload.dailyInfo.weekNum;
      weekDailyInfoObj['timeInterval'] = payload.dailyInfo.timeInterval;
      weekDailyInfoObj['weekData'] = weekData;
      weekDailyInfoObj['weekWorkload'] = sumWeekWorkload;
      weekDailyInfoObj['weekday'] = weekDayCount;
      weekDailyInfoObj['averageWorkload'] = weekDayCount === 0 ? 0 : Number((sumWeekWorkload / weekDayCount).toFixed(1));
      weekDailyInfoObj['workSaturation'] = Number((effectiveWorkload / sumWeekWorkload).toFixed(1));

      return yield call(addWeekDaily, weekDailyInfoObj);
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
            ...action.payload.dailyInfo.weekData,
          }
        },
      }
    },

    // 清除数据
    clearState(state, action) {
      return {
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
      }
    }
  },
}

export default AddWeekDailyModel;
