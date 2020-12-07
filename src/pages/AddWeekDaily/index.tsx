import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Image, Menu, Dropdown, Button, Select, Table, Upload, DatePicker, InputNumber, Space, Divider, Tabs } from 'antd';
import { useIntl, Link, Dispatch, connect, LoadingType, useParams, history } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import DailyDisplay from './components/DailyDisplay';
import { DailyInfoType } from '../WeekDaily/data';
import { AddWeekDailyType, SummaryDataType } from './data';

const { TabPane } = Tabs;

interface PropsType {
  dailyInfo: DailyInfoType;
  summaryData: SummaryDataType[];
  dispatch: Dispatch;
  loading: boolean;
}

const Daily: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();

  const { dispatch, dailyInfo, summaryData } = props;

  // url参数
  const param: { weekNum: string } = useParams();

  // 一周七天的日期数组
  const [weekRange, setWeekRange] = useState<string[]>([
    '', '', '', '', '', '', ''
  ]);

  // 选择的周的值
  const [weekValue, setWeekValue] = useState<Moment>();

  // 汇总页的table的表头 TODO: 类别读配置
  const summaryTableColumns = [
    {
      title: formatMessage({ id: 'weekDaily.timeInterval', defaultMessage: '星期' }),
      dataIndex: 'weekday', key: 'weekday', width: 60,
    },
    {
      title: formatMessage({ id: 'weekDaily.timeInterval', defaultMessage: '日期' }),
      dataIndex: 'date', key: 'date', width: 60,
    },
    {
      title: formatMessage({ id: 'weekDaily.timeInterval', defaultMessage: '编码' }),
      dataIndex: 'coding', key: 'coding', width: 60,
    },
    {
      title: formatMessage({ id: 'weekDaily.timeInterval', defaultMessage: '测试' }),
      dataIndex: 'testing', key: 'testing', width: 60,
    },
    {
      title: formatMessage({ id: 'weekDaily.documentWriting', defaultMessage: '文档编写' }),
      dataIndex: 'documentWriting', key: 'documentWriting', width: 60,
    },
    {
      title: formatMessage({ id: 'weekDaily.documentWriting', defaultMessage: '自学' }),
      dataIndex: 'selfStudying', key: 'selfStudying', width: 60,
    },
    {
      title: formatMessage({ id: 'weekDaily.documentWriting', defaultMessage: '翻译' }),
      dataIndex: 'translate', key: 'translate', width: 60,
    },
    {
      title: formatMessage({ id: 'weekDaily.documentWriting', defaultMessage: '准备工作' }),
      dataIndex: 'useless', key: 'useless', width: 60,
    },
  ];

  // 本周起止时间变化 bug:点不了删除
  const pickerChanged = (date: Moment) => {
    // 把选择的日期置为一周的第一天
    const startDate = moment(date.startOf('week'));
    // 日期变更后更新state
    dispatch({
      type: 'addWeekDaily/saveDailyInfo',
      payload: {
        dailyInfo: {
          ...props.dailyInfo,
          timeInterval: date ?
            `${date.format('YYYYMMDD')}-${date.startOf('week').add(6, 'days').format('YYYYMMDD')}`
            : '',
        }
      }
    });
    if (!date) {
      return;
    }
    setWeekRange([
      startDate.format('YYYY-MM-DD'),
      startDate.startOf('week').add(1, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(2, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(3, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(4, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(5, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(6, 'days').format('YYYY-MM-DD'),
    ]);
    setWeekValue(date);
  }

  // 周数变更后
  const weekNumChanged = (weekNum: number) => {
    dispatch({
      type: 'addWeekDaily/saveDailyInfo',
      payload: {
        dailyInfo: {
          ...props.dailyInfo,
          weekNum
        }
      }
    });
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
      }).then((info: DailyInfoType) => {
        if (!info) {
          alert('TODO');
          return;
        }
        setWeekValue(moment(info.timeInterval.split('-')[0], 'YYYYMMDD'));
        pickerChanged(moment(info.timeInterval.split('-')[0], 'YYYYMMDD'));
      });
    }
  }, [param.weekNum]);

  // 路由变化时清空State TODO: 好像可以用subscribe?
  useEffect(() => {
    dispatch({
      type: 'addWeekDaily/clearState',
    });
  }, [history.pathname]);

  // 保存当周的周报
  const saveWeekDaily = () => {
    // 更新
    if (param.weekNum) {
      return dispatch({
        type: 'addWeekDaily/updateWeekDaily',
        payload: {
          dailyInfo,
        }
      });
    }
    debugger;
    // 新建
    return dispatch({
      type: 'addWeekDaily/addWeekDaily',
      payload: {
        dailyInfo,
      }
    });
  }

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <span>{formatMessage({ id: 'addWeekDaily.selectWeekRange', defaultMessage: '选择本周' })}</span>
          <DatePicker
            picker="week"
            format="YYYY-MM-DD(wo)"
            value={weekValue}
            onChange={pickerChanged}
          />
          <span>{formatMessage({ id: 'addWeekDaily.selectWeekNum', defaultMessage: '选择周数' })}</span>
          <InputNumber min={1} defaultValue={Number(param.weekNum) || 1} onChange={(value: number) => weekNumChanged(value)} />
        </Space>
        {
          weekRange[0] !== ''
          && <Space>
            <span>{formatMessage({ id: 'addWeekDaily.weekRange', defaultMessage: '本周起止时间' })}</span>
            <span>{weekRange[0]}~{weekRange[6]}</span>
          </Space>
        }
        <Space>
          <Button type="primary" onClick={saveWeekDaily}>{formatMessage({ id: 'cmn.save', defaultMessage: '保存' })}</Button>
          <Link to="/weekDaily"><Button>{formatMessage({ id: 'cmn.back', defaultMessage: '返回' })}</Button></Link>
        </Space>
        <Divider />
        <Tabs defaultActiveKey="1" centered type="card">
          <TabPane tab={formatMessage({ id: 'addWeekDaily.detail', defaultMessage: '详情' })} key="0">
            <Table columns={summaryTableColumns} dataSource={summaryData}></Table>
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.monday', defaultMessage: '周一' })} key="1">
            <DailyDisplay data={dailyInfo?.weekData?.monday} date={weekRange[0]} dailyInfo={dailyInfo}
              dispatch={dispatch} week="monday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.tuesday', defaultMessage: '周二' })} key="2">
            <DailyDisplay data={dailyInfo?.weekData?.tuesday} date={weekRange[1]} dailyInfo={dailyInfo}
              dispatch={dispatch} week="tuesday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.wednesday', defaultMessage: '周三' })} key="3">
            <DailyDisplay data={dailyInfo?.weekData?.wednesday} date={weekRange[2]} dailyInfo={dailyInfo}
              dispatch={dispatch} week="wednesday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.thursday', defaultMessage: '周四' })} key="4">
            <DailyDisplay data={dailyInfo?.weekData?.thursday} date={weekRange[3]} dailyInfo={dailyInfo}
              dispatch={dispatch} week="thursday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.friday', defaultMessage: '周五' })} key="5">
            <DailyDisplay data={dailyInfo?.weekData?.friday} date={weekRange[4]} dailyInfo={dailyInfo}
              dispatch={dispatch} week="friday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.saturday', defaultMessage: '周六' })} key="6">
            <DailyDisplay data={dailyInfo?.weekData?.saturday} date={weekRange[5]} dailyInfo={dailyInfo}
              dispatch={dispatch} week="saturday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.sunday', defaultMessage: '周日' })} key="7">
            <DailyDisplay data={dailyInfo?.weekData?.sunday} date={weekRange[6]} dailyInfo={dailyInfo}
              dispatch={dispatch} week="sunday" />
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
  summaryData: addWeekDaily.summaryData,
  loading: loading.models.weekDaily,
}))(Daily);
