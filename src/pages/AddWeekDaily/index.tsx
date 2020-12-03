import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Image, Menu, Dropdown, Button, Select, Table, Upload, DatePicker, InputNumber, Space, Divider, Tabs } from 'antd';
import { useIntl, Link, Dispatch, connect, LoadingType, useParams, history } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import DailyDisplay from './components/DailyDisplay';
import { DailyInfoType } from '../WeekDaily/data';
import { AddWeekDailyType } from './data';

const { TabPane } = Tabs;

interface PropsType {
  dailyInfo: DailyInfoType;
  dispatch: Dispatch;
  loading: boolean;
}

const Daily: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();

  const { dispatch, dailyInfo } = props;

  // url参数
  const param: { weekNum: string } = useParams();

  // 选择了本周起止时间
  const weekRangeSelected = () => {
    console.log(dailyInfo);
  }

  // 初始化
  useEffect(() => {
    // 编辑
    if (param.weekNum) {
      dispatch({
        type: 'addWeekDaily/getWeekDailyInfo',
        payload: {
          weekNum: Number(param.weekNum)
        }
      }).then(() => {
        console.log(dailyInfo);
      });
    }
  }, [param.weekNum]);

  // 路由变化时清空State
  useEffect(() => {
    dispatch({
      type: 'addWeekDaily/clearState',
    });
  }, [history.pathname])

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <span>{formatMessage({ id: 'addWeekDaily.selectWeekRange', defaultMessage: '选择本周起止时间' })}</span>
          <DatePicker.RangePicker
            ranges={{
              '本周': [moment().startOf('week'), moment().endOf('week')], // 这个好像没法多语言？不能用变量
            }}
            defaultValue={
              param.weekNum
                ? [moment(dailyInfo?.timeInterval?.split('-')[0], 'YYYYMMDD') || moment(),
                moment(dailyInfo?.timeInterval?.split('-')[1], 'YYYYMMDD') || moment()]
                : []}
          />
          <span>{formatMessage({ id: 'addWeekDaily.selectWeekNum', defaultMessage: '选择周数' })}</span>
          <InputNumber min={1} defaultValue={Number(param.weekNum) || 1} />
        </Space>
        <Space>
          <Button type="primary" onClick={weekRangeSelected}>{formatMessage({ id: 'cmn.save', defaultMessage: '保存' })}</Button>
          <Link to="/weekDaily"><Button>{formatMessage({ id: 'cmn.back', defaultMessage: '返回' })}</Button></Link>
        </Space>
        <Divider />
        <Tabs defaultActiveKey="1" centered type="card">
          <TabPane tab={formatMessage({ id: 'addWeekDaily.detail', defaultMessage: '详情' })} key="0">
            table + Chart
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.monday', defaultMessage: '周一' })} key="1">
            <DailyDisplay data={dailyInfo?.weekData?.monday} />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.tuesday', defaultMessage: '周二' })} key="2">
            <DailyDisplay data={dailyInfo?.weekData?.tuesday} />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.wednesday', defaultMessage: '周三' })} key="3">
            <DailyDisplay data={dailyInfo?.weekData?.wednesday} />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.thursday', defaultMessage: '周四' })} key="4">
            <DailyDisplay data={dailyInfo?.weekData?.thursday} />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.friday', defaultMessage: '周五' })} key="5">
            <DailyDisplay data={dailyInfo?.weekData?.friday} />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.saturday', defaultMessage: '周六' })} key="6">
            <DailyDisplay data={dailyInfo?.weekData?.saturday} />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.sunday', defaultMessage: '周日' })} key="7">
            <DailyDisplay data={dailyInfo?.weekData?.sunday} />
          </TabPane>
        </Tabs>
      </Space>

    </PageContainer>
  );
};


export default connect(({ addWeekDaily, loading }: {
  addWeekDaily: AddWeekDailyType,
  loading: LoadingType
}) => ({
  dailyInfo: addWeekDaily.dailyInfo,
  loading: loading.models.weekDaily,
}))(Daily);
