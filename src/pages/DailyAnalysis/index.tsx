import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Spin, Tabs } from 'antd';
import { useIntl, Dispatch, connect, LoadingType } from 'umi';
import WorkloadCategoryChart from './components/WorkloadCategoryChart';
import SumWorkloadChart from './components/SumWorkloadChart';
import EveryCategoryChart from './components/EveryCategoryChart';
import SaturationChart from './components/SaturationChart';

interface PropsType {
  dispatch: Dispatch;
  loading: boolean;
}

const DailyAnalysis: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();
  const { dispatch, loading } = props;

  // 获取周报列表
  const getWeekDailyList = () => {
    dispatch({
      type: 'dailyAnalysis/getWeekDailyList',
    });
  }

  // 初始化
  useEffect(() => {
    getWeekDailyList();
  }, []);

  return (
    <>
      <h2>{formatMessage({ id: 'dailyAnalysis.title', defaultMessage: '周报分析' })}</h2>
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1" centered>
          <Tabs.TabPane tab="各种类工作时长" key="1">
            <WorkloadCategoryChart />
          </Tabs.TabPane>
          <Tabs.TabPane tab="总工作量" key="2">
            <SumWorkloadChart />
          </Tabs.TabPane>
          <Tabs.TabPane tab="各工作类型时间变化" key="3">
            <EveryCategoryChart />
          </Tabs.TabPane>
          <Tabs.TabPane tab="工作饱和度" key="4">
            <SaturationChart />
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </>
  );
};

export default connect(({ loading }: {
  loading: LoadingType
}) => ({
  loading: loading.models.dailyAnalysis,
}))(DailyAnalysis);
