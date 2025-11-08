import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:trophy',
      order: 3,
      title: $t('page.lottery.title'),
    },
    name: 'Lottery',
    path: '/lottery',
    children: [
      {
        name: 'LotteryDashboard',
        path: '/lottery/dashboard',
        component: () => import('#/views/lottery/dashboard/index.vue'),
        meta: {
          icon: 'lucide:layout-dashboard',
          title: '数据总览',
        },
      },
      {
        name: 'LotteryType',
        path: '/lottery/lottery-type',
        component: () => import('#/views/lottery/lottery-type/index.vue'),
        meta: {
          icon: 'lucide:list',
          title: $t('page.lottery.lotteryType'),
        },
      },
      {
        name: 'DrawResult',
        path: '/lottery/draw-result',
        component: () => import('#/views/lottery/draw-result/index.vue'),
        meta: {
          icon: 'lucide:calendar-check',
          title: $t('page.lottery.drawResult'),
        },
      },
      {
        name: 'AnalysisMethod',
        path: '/lottery/analysis-method',
        component: () => import('#/views/lottery/analysis-method/index.vue'),
        meta: {
          icon: 'lucide:brain',
          title: $t('page.lottery.analysisMethod'),
        },
      },
      {
        name: 'Combination',
        path: '/lottery/combination',
        component: () => import('#/views/lottery/combination/index.vue'),
        meta: {
          icon: 'lucide:layers',
          title: $t('page.lottery.combination'),
        },
      },
      {
        name: 'Prediction',
        path: '/lottery/prediction',
        component: () => import('#/views/lottery/prediction/index.vue'),
        meta: {
          icon: 'lucide:sparkles',
          title: $t('page.lottery.prediction'),
        },
      },
      {
        name: 'Membership',
        path: '/lottery/membership',
        component: () => import('#/views/lottery/membership/index.vue'),
        meta: {
          icon: 'lucide:crown',
          title: $t('page.lottery.membership'),
        },
      },
    ],
  },
];

export default routes;
