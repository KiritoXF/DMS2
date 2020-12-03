import React, { useState } from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import ProField from '@ant-design/pro-field';
import { ProFormRadio } from '@ant-design/pro-form';
import { formatMessage, useIntl } from 'umi';
import moment from 'moment';
import { Button, InputNumber, Select, Table } from 'antd';
import { DayInfoType, WorkInfoType } from '@/pages/WeekDaily/data';


interface DataSourceType {
  id: React.Key;
  title: string;
  cost: number;
  category: string;
}

// 工作类别 TODO: 从配置中获取
const categoryOptions = [
  { label: '编码', value: 'coding', },
  { label: '测试', value: 'testing' },
  { label: '文档编写', value: 'documentWriting' },
  { label: '自学', value: 'selfStudying' },
  { label: '翻译', value: 'translate' },
  { label: '准备工作', value: 'useless' },
];

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '事项',
    dataIndex: 'title',
    formItemProps: {
      rules: [{ required: true, message: '此项为必填项', }],
    },
    width: '30%',
  },
  {
    title: '花费时间', dataIndex: 'cost',
    renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
      return (
        <InputNumber min={0} max={24} />
      )
    },
    width: '10%',
  },
  {
    title: '工作类别', dataIndex: 'category',
    renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
      return (
        <Select options={categoryOptions} />
      )
    },
    width: '30%',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 200,
    render: (text, record, _, action) => [
      <a key="editable" onClick={() => { action.startEditable?.(record.id); }}>
        {formatMessage({ id: 'cmn.edit', defaultMessage: '编辑' })}
      </a>,
    ],
  },
];

export default (props: { data?: DayInfoType }) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

  return (
    <>
      <Button onClick={() => { console.log(props) }}>XXXXXXXXXX</Button>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle={props.data?.date} // TODO: date is not right
        recordCreatorProps={{
          position: 'end',
          record: {
            id: (Math.random() * 1000000).toFixed(0),
            title: '',
            cost: 0,
            category: '',
          },
        }}
        columns={columns}
        request={async () => ({
          data: props?.data?.workInfos || [],
          total: 3,
          success: true,
        })}
        value={dataSource}
        onChange={setDataSource}
        editable={{
          editableKeys,
          onChange: setEditableRowKeys,
        }}
        summary={pageData => {
          debugger;
          // const sum = pageData.reduce((accumulator: WorkInfoType, current: WorkInfoType) => { return accumulator.cost + current.cost })
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>{formatMessage({ id: 'cmn.sum', defaultMessage: '总计' })}</Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
    </>
  );
};
