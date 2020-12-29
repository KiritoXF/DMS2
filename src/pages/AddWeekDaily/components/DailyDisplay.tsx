import React, { useEffect, useState } from 'react';
import { EditableProTable, ProColumns } from '@ant-design/pro-table';
import { connect, Dispatch, useIntl } from 'umi';
import { InputNumber, Select, Table } from 'antd';
import { DayInfoType, WorkInfoType } from '@/pages/WeekDaily/data';
import { getWorkCategoryList } from '@/utils/utils';

// 入参类型
interface PropsType {
  // 这一天的数据
  data?: DayInfoType;
  // 用来显示的日期
  date: string;
  // 标识是星期几
  week: string;
  dispatch: Dispatch;
}

const DailyDisplay = (props: PropsType) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<WorkInfoType[]>([]);

  const { formatMessage } = useIntl();

  const columns: ProColumns<WorkInfoType>[] = [
    {
      title: '事项', dataIndex: 'title', width: '30%',
      formItemProps: { rules: [{ required: true, message: '此项为必填项', }] },
    },
    {
      title: '花费时间', dataIndex: 'cost', width: '10%',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (<InputNumber min={0} max={24} />)
      },
    },
    {
      title: '工作类别', dataIndex: 'category', width: '30%',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        return (<Select options={getWorkCategoryList()} />)
      },
    },
    {
      title: '操作', valueType: 'option', width: 200,
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => { action.startEditable?.(record.id); }}>
          {formatMessage({ id: 'cmn.edit', defaultMessage: '编辑' })}
        </a>,
      ],
    },
  ];

  // 更新天的变化数据
  const updateDayInfo = (value: WorkInfoType[]) => {
    props.dispatch({
      type: 'addWeekDaily/saveDayInfo',
      payload: {
        week: props.week,
        weekData: {
          [props.week]: {
            workInfos: value,
            ps: '', // TODO
          },
        },
      }
    });
  }

  useEffect(() => {
    setDataSource(props.data?.workInfos || []);
  }, []);

  return (
    <>
      <h3>
        {formatMessage({ id: 'addWeekDaily.date', defaultMessage: '日期:' })}
        {props.date || formatMessage({ id: 'addWeekDaily.unSelected', defaultMessage: '未选择' })}
      </h3>
      <EditableProTable<WorkInfoType>
        rowKey="id"
        recordCreatorProps={{
          position: 'end',
          record: {
            id: (Math.random() * 1000000),
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
        onChange={((value: WorkInfoType[]) => { setDataSource(value); updateDayInfo(value); })}
        editable={{
          editableKeys,
          onChange: setEditableRowKeys,
        }}
        summary={pageData => {
          if (!pageData.length) {
            return;
          }
          const sum = pageData?.reduce((accumulator, current: WorkInfoType) => {
            return accumulator + current?.cost
          }, 0);
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>{formatMessage({ id: 'cmn.sum', defaultMessage: '总计' })}</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>{sum}</Table.Summary.Cell>
            </Table.Summary.Row>
          )
        }}
      />
    </>
  );
};

export default connect(({ }) => ({}))(DailyDisplay);
