import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:folder',
      order: 10,
      title: '项目管理',
    },
    name: 'Project',
    path: '/project',
    children: [
      {
        name: 'ProjectAccount',
        path: ':id/accounts',
        component: () => import('#/views/project/account/index.vue'),
        meta: {
          icon: 'lucide:users',
          title: '账号管理',
          // hideInMenu: true, // 如果需要隐藏菜单，可以在这里配置
        },
      },
    ],
  },
];

export default routes;
