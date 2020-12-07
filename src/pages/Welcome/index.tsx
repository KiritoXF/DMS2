import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Image, Menu, Dropdown } from 'antd';
import { useIntl, Link } from 'umi';

// Card右上角的额外操作，目前未实装具体的功能
const cardExtra = (
  <Dropdown trigger={['click']} overlay={
    <><Menu>
      <Menu.Item><a href="#">operate1</a></Menu.Item>
      <Menu.Item><a href="#">operate2</a></Menu.Item>
    </Menu></>
  }>
    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>extra</a>
  </Dropdown>
);

export default (): React.ReactNode => {
  const { formatMessage } = useIntl();
  return (
    <PageContainer>
      <h2>{formatMessage({ id: 'welcome.title', defaultMessage: '欢迎界面' })}</h2>
      <Row>
        <Col span={12} style={{ padding: '0 10px' }}>
          <Card title={formatMessage({ id: 'welcome.introduce', defaultMessage: '介绍' })}
            extra={cardExtra}>
            <p>{formatMessage({ id: 'welcome.welcomeMessage', defaultMessage: '欢迎使用日报管理系统' })}</p>
            <p>
              {formatMessage({ id: 'welcome.welcomeMessage2', defaultMessage: '第一次使用？请查看' })}
              <a href="https://github.com/KiritoXF/Daily_Management_System/wiki" target="_blank">
                {formatMessage({ id: 'welcome.guide', defaultMessage: '指南' })}</a>
            </p>
          </Card>
        </Col>
        <Col span={12} style={{ padding: '0 0 10px 0' }}>
          <Card title={formatMessage({ id: 'welcome.weekDaily', defaultMessage: '周报信息' })}>
            <p><Link to='/weekDaily'>{formatMessage({ id: 'welcome.myDaily', defaultMessage: '我的周报' })}</Link></p>
            <p><Link to='/teamDaily'>{formatMessage({ id: 'welcome.teamDaily', defaultMessage: '团队周报' })}</Link></p>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={12} style={{ padding: '0 10px' }}>
          {/* TODO: read from config file */}
          <Card title={formatMessage({ id: 'welcome.navigation', defaultMessage: '导航' })}>
            <Image width={200} src="../../assets/sifou.png" onClick={() => window.open("https://segmentfault.com/")} />
            <Image width={200} src="../../assets/juejin.png" onClick={() => window.open("https://juejin.im/")} />
            <Image width={200} src="../../assets/v2ex.png" onClick={() => window.open("https://www.v2ex.com/")} />
            <Image width={200} src="../../assets/github.png" onClick={() => window.open("https://https://github.com/")} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={formatMessage({ id: 'welcome.todo', defaultMessage: '待处理' })} >
            <p>{formatMessage({ id: 'welcome.nothing.todo', defaultMessage: '目前没有待处理的任务' })}</p>
          </Card>
        </Col>
      </Row>

    </PageContainer>
  );
};
