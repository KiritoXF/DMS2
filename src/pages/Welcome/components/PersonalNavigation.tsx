import React from 'react';
import { connect, useIntl } from 'umi';
import { Card } from 'antd';
import fishingJson from '../../../../dms.config.json';

const PersonalNavigation = () => {

  const { formatMessage } = useIntl();

  // 网格型内嵌卡片的样式
  const gridStyle: React.CSSProperties = {
    width: '25%',
    textAlign: 'center',
  };

  return (
    <Card title={formatMessage({ id: 'welcome.navigation', defaultMessage: '导航' })}>
      {fishingJson.navigationList.map(navigation => {
        return <a href={navigation.href} target="_blank"><Card.Grid style={gridStyle}>{navigation.title}</Card.Grid></a>
      })}
    </Card>
  );
};

export default connect(({ }) => ({}))(PersonalNavigation);
