import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Image, Menu, Dropdown, Button, Select, Table, Upload } from 'antd';
import { useIntl, Link, Dispatch, connect, LoadingType } from 'umi';
import { DailyInfoType, WeekDailyType } from './data';
import './index.less';
import { UploadOutlined } from '@ant-design/icons';

interface PropsType {
  dispatch: Dispatch;
  loading: boolean;
  weekDaily: WeekDailyType;
}

const PersonalWeekDaily: React.FC<PropsType> = (props) => {
  const { formatMessage } = useIntl();

  const { weekDaily, dispatch, loading } = props;

  // 导入的CSV文件
  const [fileList, setFileList] = useState([]);

  // 周报表头
  const tableColumns = [
    {
      title: formatMessage({ id: 'weekDaily.timeInterval', defaultMessage: '时间段' }),
      dataIndex: 'timeInterval', width: 200
    },
    {
      title: formatMessage({ id: 'weekDaily.weekNum', defaultMessage: '周数' }),
      dataIndex: 'weekNum', width: 65,
    },
    {
      title: formatMessage({ id: 'weekDaily.workContent', defaultMessage: '工作内容' }),
      minWidth: 65,
      children: [
        { title: formatMessage({ id: 'weekDaily.coding', defaultMessage: '编码' }), dataIndex: "coding" },
        { title: formatMessage({ id: 'weekDaily.testing', defaultMessage: '测试' }), dataIndex: "testing" },
        { title: formatMessage({ id: 'weekDaily.documentWriting', defaultMessage: '文档编写' }), dataIndex: "documentWriting" },
        { title: formatMessage({ id: 'weekDaily.selfStudying', defaultMessage: '自学' }), dataIndex: "selfStudying" },
        { title: formatMessage({ id: 'weekDaily.translate', defaultMessage: '翻译' }), dataIndex: "translate" },
        { title: formatMessage({ id: 'weekDaily.useless', defaultMessage: '准备工作' }), dataIndex: "useless" },
      ],
    },
    { title: formatMessage({ id: 'weekDaily.weekWorkload', defaultMessage: '本周工作量' }), dataIndex: 'weekWorkload' },
    { title: formatMessage({ id: 'weekDaily.weekday', defaultMessage: '工作日' }), dataIndex: 'weekday' },
    { title: formatMessage({ id: 'weekDaily.averageWorkload', defaultMessage: '日均工作量' }), dataIndex: 'averageWorkload' },
    { title: formatMessage({ id: 'weekDaily.workSaturation', defaultMessage: '工作饱和度' }), dataIndex: 'workSaturation' },
    {
      title: formatMessage({ id: 'weekDaily.operation', defaultMessage: '操作' }),
      dataIndex: '', width: 120,
      render: () => <>
        <Button type="primary" size="small">{formatMessage({ id: 'cmn.edit', defaultMessage: '编辑' })}</Button>
        <Button danger size="small">{formatMessage({ id: 'cmn.delete', defaultMessage: '删除' })}</Button>
      </>,
    },
  ];

  const uploadProps = {
    onRemove: file => {
      setFileList([]);
      return {
        fileList: [],
      }
    },
    beforeUpload: file => {
      setFileList([file]);
      // todo: deal with csv
      dispatch({
        type: 'weekDaily/importDailyInfo',
        payload: {
          file,
        }
      });
      return false;
    },
    fileList,
  };

  // 初始化
  useEffect(() => {
    dispatch({
      type: 'weekDaily/getWeekDailyList',
    });
  }, []);

  return (
    <PageContainer>
      <h2>{formatMessage({ id: 'weekDaily.title', defaultMessage: '我的周报' })}</h2>
      <div>
        <Button type="primary">{formatMessage({ id: 'weekDaily.add', defaultMessage: '新增周报' })}</Button>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>{formatMessage({ id: 'weekDaily.selectFile', defaultMessage: '选择文件' })}</Button>
        </Upload>
        {/* <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={loading}
          style={{ marginTop: 16 }}
        >
          {loading ? 'Uploading' : formatMessage({ id: 'weekDaily.import', defaultMessage: '导入周报' })}
        </Button> */}
        <Button>{formatMessage({ id: 'weekDaily.reverse', defaultMessage: '倒序' })}</Button>
      </div>
      <div>
        <Select placeholder={formatMessage({ id: 'weekDaily.start', defaultMessage: '开始区间' })} style={{ width: '200px' }}>
          {weekDaily.startList.map(item => {
            return <Select.Option value={item.value}>{item.label}</Select.Option>
          })}
        </Select>
            ~
            <Select placeholder={formatMessage({ id: 'weekDaily.end', defaultMessage: '结束区间' })} style={{ width: '200px' }}>
          {weekDaily.endList.map(item => {
            return <Select.Option value={item.value}>{item.label}</Select.Option>
          })}
        </Select>
        <Button>{formatMessage({ id: 'weekDaily.export', defaultMessage: '导出周报' })}</Button>
      </div>
      <Table
        columns={tableColumns}
        dataSource={weekDaily.weekDailyList}
        bordered
        size="middle"
        // scroll={{ x: 'calc(700px + 50%)', y: 240 }}
        loading={loading}
      />
    </PageContainer>
  );
};


export default connect(({ weekDaily, loading }: {
  weekDaily: WeekDailyType,
  loading: LoadingType
}) => ({
  weekDaily,
  loading: loading.models.weekDaily,
}))(PersonalWeekDaily);
