import React from 'react';
import { connect, Dispatch, LoadingType, useIntl } from 'umi';
import { Column } from '@ant-design/charts';
import { ColumnConfig } from '@ant-design/charts/es/column';
import { DailyAnalysisStateType } from '../data';

// 入参类型
interface PropsType {
  dispatch: Dispatch;
  dailyAnalysis: DailyAnalysisStateType;
}

const WorkloadCategoryChart: React.FC<PropsType> = (props: PropsType) => {

  const config: ColumnConfig & React.RefAttributes<unknown> = {
    data: props.dailyAnalysis?.categoryChartData || [],
    xField: 'category',
    yField: 'value',
    color: '#3398DB',
    meta: {
      category: { alias: '类别' },
      value: { alias: '销售额' }
    },
    autoFit: true,
  };

  return (
    <Column {...config} style={{ height: '450px' }} />
  );
};

export default connect(({ dailyAnalysis, loading }: {
  dailyAnalysis: DailyAnalysisStateType,
  loading: LoadingType
}) => ({
  dailyAnalysis,
  loading: loading.models.dailyAnalysis,
}))(WorkloadCategoryChart);
