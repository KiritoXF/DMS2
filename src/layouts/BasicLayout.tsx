/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, useIntl, connect, Dispatch, history } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';
import Dexie from 'dexie';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} Github:@kiritoXF`}
    links={[
      {
        key: 'Daily Management System',
        title: '日报管理系统',
        href: 'https://github.com/KiritoXF/Daily_Management_System/wiki',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/KiritoXF/Daily_Management_System/wiki',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  const menuDataRef = useRef<MenuDataItem[]>([]);

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };
  // get children authority
  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  const { formatMessage } = useIntl();

  // Dexie: indexedDB start
  Dexie.exists('daily').then((exists) => {
    // 首次加载，不存在的情况下才插入测试数据
    if (!exists) {
      const db = new Dexie('daily');
      db.version(1).stores({
        originInfo: `++id,timeInterval,weeks,coding,testing,documentWriting,
          selfStudying,translate,useless,weekWorkload,weekday,averageWorkload,workSaturation,weekData` });
      db.open();

      const drops = [];
      drops.push({
        timeInterval: '20201102-20201108', weekNum: 117, coding: 12, testing: 4, documentWriting: 3, selfStudying: 0,
        translate: 10, useless: 12, weekWorkload: 40, weekday: 5, averageWorkload: 8, workSaturation: 0.9,
        weekData: {
          "monday": { "date": "2020-11-15T16:00:00.000Z", "workInfos": [{ "title": "后台api", "cost": 8, "category": "编码", "id": 1 }], "ps": "", "sumCost": 8 },
          "tuesday": { "date": "2020-11-16T16:00:00.000Z", "workInfos": [{ "title": "api开发", "cost": 4, "category": "编码", "id": 1 }, { "title": "整理多语言文档", "cost": 1, "category": "文档编写", "id": 2 }, { "title": "摸鱼", "cost": 3, "category": "准备工作", "id": 3 }], "ps": "", "sumCost": 8 },
          "wednesday": { "date": "2020-11-17T16:00:00.000Z", "workInfos": [{ "title": "摸鱼", "cost": 5, "category": "准备工作", "id": 1 }, { "title": "测api", "cost": 3, "category": "编码", "id": 2 }], "ps": "", "sumCost": 8 },
          "thursday": { "date": "2020-11-18T16:00:00.000Z", "workInfos": [{ "title": "改api", "cost": 4, "category": "编码", "id": 1 }, { "title": "测试准备", "cost": 4, "category": "准备工作", "id": 2 }], "ps": "", "sumCost": 8 },
          "friday": { "date": "2020-11-19T16:00:00.000Z", "workInfos": [{ "title": "数据对比测试", "cost": 2, "category": "编码", "id": 1 }, { "title": "数据对比测试", "cost": 4, "category": "测试", "id": 2 }, { "title": "数据对比测试", "cost": 2, "category": "文档编写", "id": 3 }], "ps": "", "sumCost": 8 },
          "saturday": { "date": "2020-11-20T16:00:00.000Z", "workInfos": [], "ps": "", "sumCost": 0 },
          "sunday": { "date": "2020-11-21T16:00:00.000Z", "workInfos": [], "ps": "", "sumCost": 0 }
        }
      });
      drops.push({
        timeInterval: '20201109-20201115', weekNum: 118, coding: 12, testing: 14, documentWriting: 3, selfStudying: 0,
        translate: 0, useless: 12, weekWorkload: 40, weekday: 5, averageWorkload: 8, workSaturation: 0.9,
        weekData: {
          "monday": { "date": "2020-11-15T16:00:00.000Z", "workInfos": [{ "title": "后台api", "cost": 8, "category": "编码", "id": 1 }], "ps": "", "sumCost": 8 },
          "tuesday": { "date": "2020-11-16T16:00:00.000Z", "workInfos": [{ "title": "api开发", "cost": 4, "category": "编码", "id": 1 }, { "title": "整理多语言文档", "cost": 1, "category": "文档编写", "id": 2 }, { "title": "摸鱼", "cost": 3, "category": "准备工作", "id": 3 }], "ps": "", "sumCost": 8 },
          "wednesday": { "date": "2020-11-17T16:00:00.000Z", "workInfos": [{ "title": "摸鱼", "cost": 5, "category": "准备工作", "id": 1 }, { "title": "测api", "cost": 3, "category": "编码", "id": 2 }], "ps": "", "sumCost": 8 },
          "thursday": { "date": "2020-11-18T16:00:00.000Z", "workInfos": [{ "title": "改api", "cost": 4, "category": "编码", "id": 1 }, { "title": "测试准备", "cost": 4, "category": "准备工作", "id": 2 }], "ps": "", "sumCost": 8 },
          "friday": { "date": "2020-11-19T16:00:00.000Z", "workInfos": [{ "title": "数据对比测试", "cost": 2, "category": "编码", "id": 1 }, { "title": "数据对比测试", "cost": 4, "category": "测试", "id": 2 }, { "title": "数据对比测试", "cost": 2, "category": "文档编写", "id": 3 }], "ps": "", "sumCost": 8 },
          "saturday": { "date": "2020-11-20T16:00:00.000Z", "workInfos": [], "ps": "", "sumCost": 0 },
          "sunday": { "date": "2020-11-21T16:00:00.000Z", "workInfos": [], "ps": "", "sumCost": 0 }
        }
      });
      drops.push({
        timeInterval: '20201116-20201122', weekNum: 119, coding: 21, testing: 4, documentWriting: 3, selfStudying: 0,
        translate: 0, useless: 12, weekWorkload: 40, weekday: 5, averageWorkload: 8, workSaturation: 0.7,
        weekData: {
          "monday": { "date": "2020-11-15T16:00:00.000Z", "workInfos": [{ "title": "后台api", "cost": 8, "category": "编码", "id": 1 }], "ps": "", "sumCost": 8 },
          "tuesday": { "date": "2020-11-16T16:00:00.000Z", "workInfos": [{ "title": "api开发", "cost": 4, "category": "编码", "id": 1 }, { "title": "整理多语言文档", "cost": 1, "category": "文档编写", "id": 2 }, { "title": "摸鱼", "cost": 3, "category": "准备工作", "id": 3 }], "ps": "", "sumCost": 8 },
          "wednesday": { "date": "2020-11-17T16:00:00.000Z", "workInfos": [{ "title": "摸鱼", "cost": 5, "category": "准备工作", "id": 1 }, { "title": "测api", "cost": 3, "category": "编码", "id": 2 }], "ps": "", "sumCost": 8 },
          "thursday": { "date": "2020-11-18T16:00:00.000Z", "workInfos": [{ "title": "改api", "cost": 4, "category": "编码", "id": 1 }, { "title": "测试准备", "cost": 4, "category": "准备工作", "id": 2 }], "ps": "", "sumCost": 8 },
          "friday": { "date": "2020-11-19T16:00:00.000Z", "workInfos": [{ "title": "数据对比测试", "cost": 2, "category": "编码", "id": 1 }, { "title": "数据对比测试", "cost": 4, "category": "测试", "id": 2 }, { "title": "数据对比测试", "cost": 2, "category": "文档编写", "id": 3 }], "ps": "", "sumCost": 8 },
          "saturday": { "date": "2020-11-20T16:00:00.000Z", "workInfos": [], "ps": "", "sumCost": 0 },
          "sunday": { "date": "2020-11-21T16:00:00.000Z", "workInfos": [], "ps": "", "sumCost": 0 }
        }
      });

      db.originInfo.bulkAdd(drops).then((lastKey: number) => {
        console.log("Last raindrop's id was: " + lastKey);
      });
    }
  });

  // Dexie: indexedDB end

  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      {...props}
      {...settings}
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({ id: 'menu.home' }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || [];
        return menuData || [];
      }}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
