import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Upload, Space, Divider, message, Popconfirm } from 'antd';
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

  // 选择的开始日期和结束日期，导出用
  const [startIndex, setStartIndex] = useState<number>(0);
  const [endIndex, setEndIndex] = useState<number>(weekDaily.weekDailyList.length);

  // 导入的CSV文件
  const [fileList, setFileList] = useState([]);

  // 删除某一周的周报 
  const deleteWeekDaily = (weekNum: number) => {
    dispatch({
      type: 'weekDaily/deleteWeekDaily',
      payload: {
        weekNum,
      }
    }).then(() => {
      message.success({
        key: 'deleteWeekDailySuccess',
        duration: 2,
        content: formatMessage({ id: 'weekDaily.deleteSuccess', defaultMessage: `成功删除了第${weekNum}周的周报` },
          { weekNum }),
      });
      getWeekDailyList();
    });
  }

  // 周报表头
  const tableColumns = [
    {
      title: formatMessage({ id: 'weekDaily.timeInterval', defaultMessage: '时间段' }),
      dataIndex: 'timeInterval', key: 'timeInterval', width: 200
    },
    {
      title: formatMessage({ id: 'weekDaily.weekNum', defaultMessage: '周数' }),
      dataIndex: 'weekNum', key: 'weekNum', width: 65,
      sorter: (a: DailyInfoType, b: DailyInfoType) => a.weekNum - b.weekNum,
      sortDirections: ['ascend'],
    },
    {
      title: formatMessage({ id: 'weekDaily.workContent', defaultMessage: '工作内容' }),
      minWidth: 65,
      children: [
        { title: formatMessage({ id: 'weekDaily.coding', defaultMessage: '编码' }), dataIndex: 'coding', key: 'coding', },
        { title: formatMessage({ id: 'weekDaily.testing', defaultMessage: '测试' }), dataIndex: 'testing', key: 'testing', },
        { title: formatMessage({ id: 'weekDaily.documentWriting', defaultMessage: '文档编写' }), dataIndex: 'documentWriting', key: 'documentWriting', },
        { title: formatMessage({ id: 'weekDaily.selfStudying', defaultMessage: '自学' }), dataIndex: 'selfStudying', key: 'selfStudying', },
        { title: formatMessage({ id: 'weekDaily.translate', defaultMessage: '翻译' }), dataIndex: 'translate', key: 'translate', },
        { title: formatMessage({ id: 'weekDaily.useless', defaultMessage: '准备工作' }), dataIndex: 'useless', key: 'useless', },
      ],
    },
    {
      title: formatMessage({ id: 'weekDaily.weekWorkload', defaultMessage: '本周工作量' }), dataIndex: 'weekWorkload', key: 'weekWorkload',
      onCell: (record: DailyInfoType) => {
        return { className: record.weekWorkload <= 40 ? 'ok-work' : 'over-work' }
      }
    },
    {
      title: formatMessage({ id: 'weekDaily.weekday', defaultMessage: '工作日' }), dataIndex: 'weekday', key: 'weekday',
      onCell: (record: DailyInfoType) => {
        return { className: record.weekday <= 5 ? 'ok-work' : 'over-work' }
      }
    },
    {
      title: formatMessage({ id: 'weekDaily.averageWorkload', defaultMessage: '日均工作量' }), dataIndex: 'averageWorkload', key: 'averageWorkload',
      onCell: (record: DailyInfoType) => {
        return { className: record.averageWorkload <= 8 ? 'ok-work' : 'over-work' }
      }
    },
    {
      title: formatMessage({ id: 'weekDaily.workSaturation', defaultMessage: '工作饱和度' }), dataIndex: 'workSaturation', key: 'workSaturation',
      render: (workSaturation: number) => {
        return `${workSaturation * 100}%`
      }
    },
    {
      title: formatMessage({ id: 'weekDaily.operation', defaultMessage: '操作' }),
      dataIndex: '', key: '', width: 120,
      render: (record: DailyInfoType) => <>
        <Space>
          <Link to={`/weekDaily/edit/${record.weekNum}`}>
            <Button type="primary">{formatMessage({ id: 'cmn.edit', defaultMessage: '编辑' })}</Button></Link>
          <Popconfirm
            title={formatMessage({ id: 'weekDaily.deleteConfirmMessage', defaultMessage: `你确定要删除第${record.weekNum}周的周报吗？` },
              { weekNum: record.weekNum })}
            onConfirm={() => deleteWeekDaily(record.weekNum)}
            okText={formatMessage({ id: 'cmn.yes', defaultMessage: '是' })}
            cancelText={formatMessage({ id: 'cmn.no', defaultMessage: '否' })}
          >
            <Button danger>{formatMessage({ id: 'cmn.delete', defaultMessage: '删除' })}</Button>
          </Popconfirm>
        </Space>
      </>,
    },
  ];

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
      return {
        fileList: [],
      }
    },
    beforeUpload: (file: any) => {
      setFileList([file]);
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

  // 获取周报列表
  const getWeekDailyList = () => {
    dispatch({
      type: 'weekDaily/getWeekDailyList',
    }).then((length: number) => {
      setEndIndex(length - 1);
    });
  }

  // 初始化
  useEffect(() => {
    getWeekDailyList();
  }, []);

  const exportDailyInfo = () => {
    debugger;
    dispatch({
      type: 'weekDaily/exportDailyInfo',
      payload: {
        weekDailyList: weekDaily.weekDailyList.slice(startIndex, endIndex + 1)
          .map(info => { return { ...info, weekData: JSON.stringify(info.weekData) } }),
        header: tableColumns,
        fileName: `${weekDaily.startList[startIndex].label.split('-')[0]}`
          + `-${weekDaily.endList[endIndex].label.split('-')[1]}`
          + `${formatMessage({ id: 'weekDaily.weekDaily', defaultMessage: '周报.xlsx' })}`,
      }
    });
  }

  return (
    <>
      <h2>{formatMessage({ id: 'weekDaily.title', defaultMessage: '我的周报' })}</h2>
      <Space direction="vertical">
        <Space>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>{formatMessage({ id: 'weekDaily.import', defaultMessage: '导入周报' })}</Button>
          </Upload>
          <Link to='/weekDaily/add' style={{ marginTop: '10px' }}>
            <Button type="primary">{formatMessage({ id: 'weekDaily.add', defaultMessage: '新增周报' })}</Button>
          </Link>
        </Space>
        <Space size={5}>
          <Select placeholder={formatMessage({ id: 'weekDaily.start', defaultMessage: '开始区间' })}
            onChange={(value: number) => { setStartIndex(value) }} style={{ width: '200px' }}>
            {weekDaily.startList.map(item => {
              return <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
            })}
          </Select>
          ~
        <Select placeholder={formatMessage({ id: 'weekDaily.end', defaultMessage: '结束区间' })}
            onChange={(value: number) => { setEndIndex(value) }} style={{ width: '200px' }}>
            {weekDaily.endList.map(item => {
              return <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
            })}
          </Select>
          <Button onClick={exportDailyInfo}>{formatMessage({ id: 'weekDaily.export', defaultMessage: '导出周报' })}</Button>
        </Space>
      </Space>
      <Divider />
      <Table
        columns={tableColumns}
        dataSource={weekDaily.weekDailyList}
        bordered
        size="middle"
        loading={loading}
      />
    </>
  );
};


export default connect(({ weekDaily, loading }: {
  weekDaily: WeekDailyType,
  loading: LoadingType
}) => ({
  weekDaily,
  loading: loading.models.weekDaily,
}))(PersonalWeekDaily);
