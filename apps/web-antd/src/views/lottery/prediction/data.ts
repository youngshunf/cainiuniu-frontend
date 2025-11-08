import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { $t } from '#/locales';

export const columns: VxeGridProps['columns'] = [
  { type: 'seq', width: 70, fixed: 'left', title: '序号' },
  {
    field: 'lottery_code',
    title: '彩种',
    width: 100,
    fixed: 'left',
  },
  {
    field: 'target_period',
    title: $t('lottery.prediction.targetPeriod'),
    width: 120,
  },
  {
    field: 'confidence_score',
    title: $t('lottery.prediction.confidenceScore'),
    width: 100,
    slots: {
      default: ({ row }) => {
        const score = (row.confidence_score * 100).toFixed(1);
        let color: string;
        if (row.confidence_score > 0.7) {
          color = 'success';
        } else if (row.confidence_score > 0.5) {
          color = 'warning';
        } else {
          color = 'default';
        }
        return h(Tag, { color }, () => `${score}%`);
      },
    },
  },
  {
    field: 'predicted_numbers',
    title: $t('lottery.prediction.predictedNumbers'),
    width: 300,
    slots: {
      default: ({ row }) => {
        try {
          const data = JSON.parse(row.predicted_numbers);
          const firstBet = data.formatted_numbers?.[0];
          if (!firstBet) return '-';

          const redBalls = firstBet.red_balls || firstBet.numbers || [];
          return h(
            'div',
            { class: 'flex gap-1 flex-wrap' },
            redBalls.slice(0, 6).map((ball: string) =>
              h(
                'span',
                {
                  class:
                    'inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-400 text-white text-xs',
                },
                ball,
              ),
            ),
          );
        } catch {
          return '-';
        }
      },
    },
  },
  {
    field: 'is_verified',
    title: $t('lottery.prediction.isVerified'),
    width: 90,
    slots: {
      default: ({ row }) => {
        const color = row.is_verified ? 'success' : 'default';
        const text = row.is_verified ? '已验证' : '未验证';
        return h(Tag, { color }, () => text);
      },
    },
  },
  {
    field: 'hit_count',
    title: $t('lottery.prediction.hitCount'),
    width: 100,
    slots: {
      default: ({ row }) => {
        if (!row.is_verified || row.hit_count === null) return '-';
        let color: string;
        if (row.hit_count >= 5) {
          color = 'red';
        } else if (row.hit_count >= 3) {
          color = 'orange';
        } else {
          color = 'default';
        }
        return h(Tag, { color }, () => `${row.hit_count}个`);
      },
    },
  },
  {
    field: 'created_time',
    title: $t('lottery.common.createdTime'),
    width: 170,
    sortable: true,
  },
  {
    title: $t('lottery.common.action'),
    width: 200,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export const searchFormSchema = [
  {
    fieldName: 'lottery_code',
    label: '彩种',
    component: 'Input',
    componentProps: {
      placeholder: '彩种代码',
    },
  },
  {
    fieldName: 'is_verified',
    label: '验证状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '已验证', value: true },
        { label: '未验证', value: false },
      ],
    },
  },
];

export const createPredictionSchema = [
  {
    fieldName: 'lottery_code',
    label: '彩种代码',
    component: 'Select',
    required: true,
    componentProps: {
      options: [
        { label: '双色球(ssq)', value: 'ssq' },
        { label: '大乐透(dlt)', value: 'dlt' },
        { label: '福彩3D(3d)', value: '3d' },
        { label: '排列三(pls)', value: 'pls' },
        { label: '排列五(plw)', value: 'plw' },
        { label: '七乐彩(qlc)', value: 'qlc' },
        { label: '快乐8(kl8)', value: 'kl8' },
        { label: '七星彩(qxc)', value: 'qxc' },
      ],
    },
  },
  {
    fieldName: 'history_periods',
    label: '历史期数',
    component: 'InputNumber',
    required: true,
    defaultValue: 100,
    componentProps: {
      min: 10,
      max: 1000,
      placeholder: '用于分析的历史期数',
    },
  },
  {
    fieldName: 'combination_id',
    label: '使用组合',
    component: 'Input',
    componentProps: {
      placeholder: '可选，留空使用默认配置',
    },
  },
];
