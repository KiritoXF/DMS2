import React from 'react';
import { connect, Dispatch, LoadingType, useIntl } from 'umi';
import { Line } from '@ant-design/charts';
import { DailyAnalysisStateType } from '../data';
import { LineConfig } from '@ant-design/charts/es/line';

// 入参类型
interface PropsType {
  dispatch: Dispatch;
  dailyAnalysis: DailyAnalysisStateType;
}

const SumWorkloadChart: React.FC<PropsType> = (props: PropsType) => {
  var config: LineConfig & React.RefAttributes<unknown> = {
    data: props.dailyAnalysis?.sumChartData || [],
    xField: 'weekNum',
    yField: 'value',
    meta: {
      weekNum: { alias: '类别' },
      value: { alias: '工作时长' }
    },
  };
  return (
    <Line {...config} style={{ height: '450px' }} />
  );
};

export default connect(({ dailyAnalysis, loading }: {
  dailyAnalysis: DailyAnalysisStateType,
  loading: LoadingType
}) => ({
  dailyAnalysis,
  loading: loading.models.dailyAnalysis,
}))(SumWorkloadChart);
