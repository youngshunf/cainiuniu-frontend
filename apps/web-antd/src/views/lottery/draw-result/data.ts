import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { $t } from '#/locales';

export const columns: VxeGridProps['columns'] = [
  { type: 'seq', width: 70, fixed: 'left', title: '序号' },
  {
    field: 'lottery_code',
    title: $t('lottery.drawResult.lotteryCode'),
    width: 100,
    fixed: 'left',
  },
  {
    field: 'period',
    title: $t('lottery.drawResult.period'),
    width: 120,
    fixed: 'left',
  },
  {
    field: 'draw_date',
    title: $t('lottery.drawResult.drawDate'),
    width: 120,
    sortable: true,
  },
  {
    field: 'red_balls',
    title: $t('lottery.drawResult.redBalls'),
    width: 200,
    slots: {
      default: ({ row }) => {
        try {
          const balls = JSON.parse(row.red_balls);
          return h(
            'div',
            { class: 'flex gap-1' },
            balls.map((ball: string) =>
              h(
                'span',
                {
                  class:
                    'inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white text-sm font-bold',
                },
                ball,
              ),
            ),
          );
        } catch {
          return row.red_balls;
        }
      },
    },
  },
  {
    field: 'blue_balls',
    title: $t('lottery.drawResult.blueBalls'),
    width: 150,
    slots: {
      default: ({ row }) => {
        if (!row.blue_balls) return '-';
        try {
          const balls = JSON.parse(row.blue_balls);
          return h(
            'div',
            { class: 'flex gap-1' },
            balls.map((ball: string) =>
              h(
                'span',
                {
                  class:
                    'inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold',
                },
                ball,
              ),
            ),
          );
        } catch {
          return row.blue_balls;
        }
      },
    },
  },
  {
    field: 'sync_source',
    title: $t('lottery.drawResult.syncSource'),
    width: 100,
    slots: {
      default: ({ row }) => {
        const colorMap: Record<string, string> = {
          api: 'success',
          web: 'warning',
        };
        return h(
          Tag,
          { color: colorMap[row.sync_source] || 'default' },
          () => row.sync_source,
        );
      },
    },
  },
  {
    field: 'sync_time',
    title: $t('lottery.drawResult.syncTime'),
    width: 170,
    sortable: true,
  },
  {
    title: $t('lottery.common.action'),
    width: 120,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export const searchFormSchema = [
  {
    fieldName: 'lottery_code',
    label: $t('lottery.drawResult.lotteryCode'),
    component: 'Input',
    componentProps: {
      placeholder: '如: ssq',
    },
  },
  {
    fieldName: 'period',
    label: $t('lottery.drawResult.period'),
    component: 'Input',
    componentProps: {
      placeholder: '期号',
    },
  },
  {
    fieldName: 'start_date',
    label: '开始日期',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    fieldName: 'end_date',
    label: '结束日期',
    component: 'DatePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
  },
];
