export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/weekDaily/add',
            hideInMenu: true,
            component: './AddWeekDaily',
          },
          {
            path: '/weekDaily/edit/:weekNum',
            hideInMenu: true,
            component: './AddWeekDaily',
          },
          {
            path: '/weekDaily/analysis',
            icon: 'chart',
            component: './DailyAnalysis',
          },
          {
            path: '/weekDaily',
            name: 'daily',
            icon: 'smile',
            routes: [
              {
                path: '/weekDaily',
                name: 'weekDaily',
                icon: 'smile',
                component: './WeekDaily',
              },
              {
                path: '/weekDaily/add',
                name: 'weekDaily add',
                icon: 'add',
                hideInMenu: true,
                component: './AddWeekDaily',
              },
              {
                path: '/weekDaily/edit/:weekNum',
                name: 'weekDaily edit',
                icon: 'edit',
                hideInMenu: true,
                component: './AddWeekDaily',
              },
              {
                path: '/weekDaily/analysis',
                name: 'chart',
                icon: 'chart',
                component: './DailyAnalysis',
              },
            ]
          },
          {
            path: '/admin',
            name: 'admin',
            icon: 'crown',
            component: './Admin',
            authority: ['admin'],
            routes: [
              {
                path: '/admin/sub-page',
                name: 'sub-page',
                icon: 'smile',
                component: './Welcome',
                authority: ['admin'],
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
