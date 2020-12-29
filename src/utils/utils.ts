import { parse } from 'querystring';
import { formatMessage } from 'umi';
import dmsConfig from '../../dms.config.json';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

// DMS配置文件

// 处理工作类别列表
const dealWithCategoryList = (categoryList: { label: string, defaultMessage: string, value: string, effective?: boolean }[]) => {
  return categoryList.map(category => {
    return { label: formatMessage({ id: category.label, defaultMessage: category.defaultMessage }), value: category.value };
  });
}

// 获取工作类别
export const getWorkCategoryList = () => {
  return dealWithCategoryList(dmsConfig.workCategoryList);
}

// 获取有效工作类别
export const getEffectiveCategoryList = () => {
  return dealWithCategoryList(dmsConfig.workCategoryList.filter(category => category.effective));
}

// 获取个人导航
export const getPersonalNavigation = () => {
  return dmsConfig.navigationList;
}
