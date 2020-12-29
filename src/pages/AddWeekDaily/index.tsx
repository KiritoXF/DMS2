import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Image, Menu, Dropdown, Button, Select, Table, Upload, DatePicker, InputNumber, Space, Divider, Tabs, message } from 'antd';
import { useIntl, Link, Dispatch, connect, LoadingType, useParams, history } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
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

  // 一周七天的日期数组
  const [weekRange, setWeekRange] = useState<string[]>([
    '', '', '', '', '', '', ''
  ]);

  // 选择的周的值
  const [weekValue, setWeekValue] = useState<Moment>();

  // 本周起止时间变化 bug:点不了删除
  const pickerChanged = (date: Moment) => {
    // 日期变更后更新state
    dispatch({
      type: 'addWeekDaily/saveDailyInfo',
      payload: {
        dailyInfo: {
          timeInterval: date
            ? `${date.startOf('week').format('YYYYMMDD')}-${date.startOf('week').add(6, 'days').format('YYYYMMDD')}`
            : '',
        }
      }
    });
    if (!date) {
      return;
    }
    // 把选择的日期置为一周的第一天
    const startDate = moment(date.startOf('week'));
    const dateList = [
      startDate.format('YYYY-MM-DD'),
      startDate.startOf('week').add(1, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(2, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(3, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(4, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(5, 'days').format('YYYY-MM-DD'),
      startDate.startOf('week').add(6, 'days').format('YYYY-MM-DD'),
    ];
    setWeekRange(dateList);
    setWeekValue(date);
    // 选了日期后给汇总table的每一项赋日期
    dispatch({
      type: 'addWeekDaily/setSummaryDate',
      payload: {
        weekRange: dateList
      }
    });
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
      }).then((info) => {
        if (!info) {
          alert('TODO');
          return;
        }
        setWeekValue(moment(info.payload.dailyInfo.timeInterval.split('-')[0], 'YYYYMMDD'));
        pickerChanged(moment(info.payload.dailyInfo.timeInterval.split('-')[0], 'YYYYMMDD'));
      });
    }
  }, [param.weekNum]);

  // 路由变化时清空State TODO: 好像可以用subscribe?
  useEffect(() => {
    return () => {
      dispatch({
        type: 'addWeekDaily/clearState',
      });
    }
  }, [history.pathname]);

  // 保存当周的周报
  const saveWeekDaily = () => {
    // 更新
    return dispatch({
      type: 'addWeekDaily/saveWeekDaily',
      payload: {
        dailyInfo,
        updateFlg: !!param.weekNum
      }
    }).then(({ status }) => {
      if (status === 400) {
        message.error({
          key: 'saveWeekDailyDuplicate',
          duration: 2,
          content: formatMessage({ id: 'addWeekDaily.duplicate', defaultMessage: `已经存在周报${dailyInfo.weekNum}，请检查` },
            { weekNum: param.weekNum })
        })
      } else {
        message.success({
          key: 'saveWeekDailySuccess',
          duration: 2,
          content: param.weekNum
            ? formatMessage({ id: 'addWeekDaily.updateSuccess', defaultMessage: `更新周报${param.weekNum}成功` },
              { weekNum: param.weekNum })
            : formatMessage({ id: 'addWeekDaily.createSuccess', defaultMessage: `新增周报${dailyInfo.weekNum}成功` },
              { weekNum: param.weekNum })
        });
        history.push('/weekDaily');
      }
    });
  }

  return (
    <>
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
          <Button type="primary" onClick={() => saveWeekDaily()}>{formatMessage({ id: 'cmn.save', defaultMessage: '保存' })}</Button>
          <Link to="/weekDaily"><Button>{formatMessage({ id: 'cmn.back', defaultMessage: '返回' })}</Button></Link>
        </Space>
        <Divider />
        <Tabs defaultActiveKey="1" centered type="card">
          <TabPane tab={formatMessage({ id: 'addWeekDaily.monday', defaultMessage: '周一' })} key="1">
            <DailyDisplay data={dailyInfo?.weekData?.monday} date={weekRange[0]} week="monday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.tuesday', defaultMessage: '周二' })} key="2">
            <DailyDisplay data={dailyInfo?.weekData?.tuesday} date={weekRange[1]} week="tuesday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.wednesday', defaultMessage: '周三' })} key="3">
            <DailyDisplay data={dailyInfo?.weekData?.wednesday} date={weekRange[2]} week="wednesday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.thursday', defaultMessage: '周四' })} key="4">
            <DailyDisplay data={dailyInfo?.weekData?.thursday} date={weekRange[3]} week="thursday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.friday', defaultMessage: '周五' })} key="5">
            <DailyDisplay data={dailyInfo?.weekData?.friday} date={weekRange[4]} week="friday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.saturday', defaultMessage: '周六' })} key="6">
            <DailyDisplay data={dailyInfo?.weekData?.saturday} date={weekRange[5]} week="saturday" />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'addWeekDaily.sunday', defaultMessage: '周日' })} key="7">
            <DailyDisplay data={dailyInfo?.weekData?.sunday} date={weekRange[6]} week="sunday" />
          </TabPane>
        </Tabs>
      </Space>
    </>
  );
};

export default connect(({ addWeekDaily, loading }: {
  addWeekDaily: AddWeekDailyType,
  loading: LoadingType
}) => ({
  dailyInfo: addWeekDaily,
  loading: loading.models.weekDaily,
}))(Daily);
