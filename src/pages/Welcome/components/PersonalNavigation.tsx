import React from 'react';
import { connect, useIntl } from 'umi';
import { Card } from 'antd';
import { getPersonalNavigation } from '@/utils/utils';

const PersonalNavigation = () => {

  const { formatMessage } = useIntl();

  // 网格型内嵌卡片的样式
  const gridStyle: React.CSSProperties = {
    width: '25%',
    textAlign: 'center',
  };

  return (
    <Card title={formatMessage({ id: 'welcome.navigation', defaultMessage: '导航' })}>
      {getPersonalNavigation().map(navigation => {
        return <a href={navigation.href} target="_blank" key={navigation.title}>
          <Card.Grid style={gridStyle}>{navigation.title}</Card.Grid></a>
      })}
    </Card>
  );
};

export default connect(({ }) => ({}))(PersonalNavigation);
