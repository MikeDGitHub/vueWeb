/* eslint-disable */
// 工具
import UtilIce from '@/libs/util-ice.js'; // 页面和布局

import Index from './pages/Index';
import Login from './pages/Login';
import Error404 from './pages/Error404';
import Drainage from './pages/Drainage';
import Exhaust from './pages/Exhaust';
import Fire from './pages/Fire';
import PipeLine from './pages/PipeLine';
import Sludge from './pages/Sludge';
import Valve from './pages/Valve';
import WaterMeter from './pages/WaterMeter';
import Type from './pages/Type';
import Genre from './pages/Genre';
import User from './pages/User';
import Department from './pages/Department';
import HeaderAside from './layouts/HeaderAside'; // 变量名 routerConfig 为 iceworks 检测关键字
// ice 会自动在这个变量下添加路由数据
// 请不要修改名称
// 备注 ice 自动添加的路由记录是以下格式
// {
//   path: '/page4',
//   layout: d2LayoutMain,
//   component: 4
// }
// 如果不指定 name 字段，会根据 path 生成 name = page-demo1
// 转换规则见 UtilIce.recursiveRouterConfig 中 path2name 方法
// meta 字段会和默认值使用 Object.assign 合并
// 如果不指定 meta.name 的话，name 字段会使用和上面路由 name 一样的取值逻辑
// 下面两个页面就是对比 你可以分别观察两个页面上显示的路由数据差异

const routerConfig = [
  {
    path: '/',
    name: 'index',
    layout: HeaderAside,
    component: Index,
  },
  {
    path: '/Drainage',
    layout: HeaderAside,
    component: Drainage,
    meta: {
      requiresAuth: true,
      title: '排水',
    },
  },
  {
    path: '/Exhaust',
    layout: HeaderAside,
    component: Exhaust,
    meta: {
      requiresAuth: true,
      title: '排气',
    },
  },
  {
    path: '/Fire',
    layout: HeaderAside,
    component: Fire,
    meta: {
      requiresAuth: true,
      title: '消防',
    },
  },
  {
    path: '/PipeLine',
    layout: HeaderAside,
    component: PipeLine,
    meta: {
      requiresAuth: true,
      title: '管线',
    },
  },
  {
    path: '/Sludge',
    layout: HeaderAside,
    component: Sludge,
    meta: {
      requiresAuth: true,
      title: '排泥',
    },
  },
  {
    path: '/Valve',
    layout: HeaderAside,
    component: Valve,
    meta: {
      requiresAuth: true,
      title: '阀门',
    },
  },
  {
    path: '/WaterMeter',
    layout: HeaderAside,
    component: WaterMeter,
    meta: {
      requiresAuth: true,
      title: '水表',
    },
  },
  {
    path: '/Type',
    layout: HeaderAside,
    component: Type,
    meta: {
      requiresAuth: true,
      title: '类别',
    },
  },
  {
    path: '/Genre',
    layout: HeaderAside,
    component: Genre,
    meta: {
      requiresAuth: true,
      title: '类型',
    },
    
  },
  {
    path: '/User',
    layout: HeaderAside,
    component: User,
    meta: {
      requiresAuth: true,
      title: '账户',
    },
    
  },,
  {
    path: '/Department',
    layout: HeaderAside,
    component: Department,
    meta: {
      requiresAuth: true,
      title: '部门',
    },
    
  },
]; // 不参与菜单显示的
// ice 不会处理这部分
// 但是这部分路由也会被注册
// 处理规则同 routerConfig

const routerConfigMenuOut = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '*',
    component: Error404,
  },
]; // 导出全部路由设置
// 这个数据会在 router.js 中被扁平处理

export default UtilIce.recursiveRouterConfig([
  ...routerConfig,
  ...routerConfigMenuOut,
]); // 导出参与多标签页处理的路由设置
// 这个数据会在 mian.js 中使用

export const frameInRoutes = UtilIce.recursiveRouterConfig(routerConfig).map(
  e => {
    const route = e.children ? e.children[0] : e;
    return {
      path: e.path,
      name: route.name,
      meta: route.meta,
    };
  }
);
