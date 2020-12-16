import React from 'react';
import { connect, Dispatch, LoadingType, useIntl } from 'umi';
import { Line } from '@ant-design/charts';
import { DailyAnalysisStateType } from '../data';
import { AreaConfig } from '@ant-design/charts/es/area';

// 入参类型
interface PropsType {
  dispatch: Dispatch;
  dailyAnalysis: DailyAnalysisStateType;
}

const SumWorkloadChart: React.FC<PropsType> = (props: PropsType) => {
  var config: AreaConfig & React.RefAttributes<unknown> = {
    data: props.dailyAnalysis?.saturationChartData || [],
    xField: 'weekNum',
    yField: 'value',
    xAxis: { tickCount: 5 },
    meta: {
      value: { alias: '工作饱和度' }
    },
    areaStyle: function areaStyle() {
      return { fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff' };
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
