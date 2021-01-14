import React from 'react';
import { connect, Dispatch, LoadingType, useIntl, useParams } from 'umi';
import { Pie } from '@ant-design/charts';
import { AddWeekDailyType } from '../data';
import { PieConfig } from '@ant-design/charts/es/pie';
import { getWorkCategoryList } from '@/utils/utils';
import { Result } from 'antd';
import { EditOutlined } from '@ant-design/icons';

// 入参类型
interface PropsType {
  dispatch: Dispatch;
  addWeekDaily: AddWeekDailyType;
}

const SummaryChart: React.FC<PropsType> = (props: PropsType) => {

  const { formatMessage } = useIntl();

  const param: { weekNum: string } = useParams();

  // 工作类别列表
  const categoryOptions = getWorkCategoryList();

  // // 图表用的数据
  const chartData = categoryOptions.map(option => {
    return {
      type: formatMessage({ id: option.label }),
      value: props.addWeekDaily[option.value]
    }
  });

  var config: PieConfig & React.RefAttributes<unknown> = {
    appendPadding: 10,
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };
  return (
    <>
      {param.weekNum && <Pie {...config} style={{ height: '450px' }} />}
      {
        !param.weekNum &&
        <Result
          icon={<EditOutlined />}
          title={formatMessage({ id: 'addWeekDaily.temp', defaultMessage: '保存后查看图表' })}
        />
      }
    </>
  );
};

export default connect(({ addWeekDaily, loading }: {
  addWeekDaily: AddWeekDailyType,
  loading: LoadingType
}) => ({
  addWeekDaily,
  loading: loading.models.addWeekDaily,
}))(SummaryChart);
