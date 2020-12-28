import React, { useEffect, useState } from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import ProField from '@ant-design/pro-field';
import { ProFormRadio } from '@ant-design/pro-form';
import { connect, Dispatch, formatMessage, LoadingType, useIntl } from 'umi';
import { Button, InputNumber, Row, Col, Select, Table, Card, Progress } from 'antd';
import { DailyInfoType, DayInfoType, WorkInfoType } from '@/pages/WeekDaily/data';
import moment from 'moment';

// 入参类型
interface PropsType {
  dispatch: Dispatch;
}

const TimeProgress = (props: PropsType) => {

  const currentDate = new Date();

  const { formatMessage } = useIntl();

  // 将进度转换为进度条控件需要的格式
  const transProgress = (progress: number) => {
    return parseFloat((progress * 100).toFixed(2));
  }

  // 当天过去的小时数
  const getCurrentDayPastHours = () => {
    return (
      currentDate.getHours() +
      currentDate.getMinutes() / 60 +
      currentDate.getSeconds() / 3600
    );
  }

  // 天 的进度
  const getDayProgress = () => {
    return getCurrentDayPastHours() / 24;
  }

  // 距离这天结束还剩多少小时
  const getDayRestHours = () => {
    return 23 - currentDate.getHours();
  }

  // 周 的进度
  const getWeekProgress = () => {
    return (
      (currentDate.getDay() - 1) / 7 +
      getCurrentDayPastHours() / (7 * 24)
    );
  }

  // 距离这周结束还剩多少天
  const getWeekRestDays = () => {
    return 7 - currentDate.getDay();
  }

  // 当前月份有多少天
  const getDayCount = () => {
    return moment().endOf('month').get('date');
  }

  // 月 的进度
  const getMonthProgress = () => {
    return (
      ((currentDate.getDate() - 1) * 24 +
        getCurrentDayPastHours()) /
      (getDayCount() * 24)
    );
  }

  // 距离这月结束还剩多少天
  const getMonthRestDays = () => {
    return getDayCount() - currentDate.getDate();
  }

  // 年 的进度
  const getYearProgress = () => {
    const dayCount =
      moment().endOf('year').diff(moment().startOf('year'), 'days') + 1;
    return (
      ((dayCount - getYearRestDays() + 1) * 24 +
        getCurrentDayPastHours()) /
      (dayCount * 24)
    );
  }

  // 距离这年结束还剩多少天
  const getYearRestDays = () => {
    return moment().endOf('year').diff(moment(), 'days');
  }

  return (
    <>
      <Row>
        <Col span={6}>
          <Card>
            <h2>{formatMessage({ id: 'timeProgress.year', defaultMessage: '年' })}</h2>
            <div><Progress percent={transProgress(getYearProgress())} type="dashboard" /></div>
            <label>
              {formatMessage({
                id: 'timeProgress.beforeEndYear',
                defaultMessage: `${currentDate.getFullYear()}年还有${getYearRestDays()}天结束`
              }, { target: currentDate.getFullYear(), count: getYearRestDays() })}
            </label>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <h2>{formatMessage({ id: 'timeProgress.month', defaultMessage: '月' })}</h2>
            <div><Progress percent={transProgress(getMonthProgress())} type="dashboard" /></div>
            <label>
              {formatMessage({
                id: 'timeProgress.beforeEndMonth',
                defaultMessage: `距离本月结束还有${getMonthRestDays()}天`
              }, { count: getMonthRestDays() })}
            </label>
          </Card>
        </Col>
        <Col span={6}>
          <Card >
            <h2>{formatMessage({ id: 'timeProgress.week', defaultMessage: '周' })}</h2>
            <div><Progress percent={transProgress(getWeekProgress())} type="dashboard" /></div>
            <label>
              {formatMessage({
                id: 'timeProgress.beforeEndWeek',
                defaultMessage: `距离本周结束还有${getWeekRestDays()}天`
              }, { count: getWeekRestDays() })}
            </label>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <h2>{formatMessage({ id: 'timeProgress.day', defaultMessage: '天' })}</h2>
            <div><Progress percent={transProgress(getDayProgress())} type="dashboard" /></div>
            <label>
              {formatMessage({
                id: 'timeProgress.beforeEndDay',
                defaultMessage: `距离今天结束还有大约${getDayRestHours()}小时`
              }, { count: getDayRestHours() })}
            </label>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default connect(({ }) => ({}))(TimeProgress);
