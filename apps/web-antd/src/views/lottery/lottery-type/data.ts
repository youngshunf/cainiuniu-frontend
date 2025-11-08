import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { $t } from '#/locales';

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 50, fixed: 'left' },
  { type: 'seq', width: 70, fixed: 'left', title: '序号' },
  {
    field: 'code',
    title: $t('lottery.lotteryType.code'),
    width: 100,
    fixed: 'left',
  },
  {
    field: 'name',
    title: $t('lottery.lotteryType.name'),
    width: 120,
  },
  {
    field: 'category',
    title: $t('lottery.lotteryType.category'),
    width: 80,
    slots: {
      default: ({ row }) => {
        const color = row.category === '福彩' ? 'red' : 'blue';
        return h(Tag, { color }, () => row.category);
      },
    },
  },
  {
    field: 'red_ball_count',
    title: $t('lottery.lotteryType.redBallCount'),
    width: 100,
  },
  {
    field: 'blue_ball_count',
    title: $t('lottery.lotteryType.blueBallCount'),
    width: 100,
  },
  {
    field: 'red_ball_range',
    title: $t('lottery.lotteryType.redBallRange'),
    width: 100,
  },
  {
    field: 'blue_ball_range',
    title: $t('lottery.lotteryType.blueBallRange'),
    width: 100,
  },
  {
    field: 'draw_time',
    title: $t('lottery.lotteryType.drawTime'),
    width: 200,
  },
  {
    field: 'status',
    title: $t('lottery.lotteryType.status'),
    width: 80,
    slots: {
      default: ({ row }) => {
        const color = row.status === 1 ? 'success' : 'default';
        const text = row.status === 1 ? '启用' : '停用';
        return h(Tag, { color }, () => text);
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
    fieldName: 'category',
    label: $t('lottery.lotteryType.category'),
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '福彩', value: '福彩' },
        { label: '体彩', value: '体彩' },
      ],
    },
  },
  {
    fieldName: 'status',
    label: $t('lottery.lotteryType.status'),
    component: 'Select',
    componentProps: {
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
  },
];

export const formSchema = [
  {
    fieldName: 'code',
    label: $t('lottery.lotteryType.code'),
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '如: ssq, dlt',
    },
  },
  {
    fieldName: 'name',
    label: $t('lottery.lotteryType.name'),
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '如: 双色球',
    },
  },
  {
    fieldName: 'category',
    label: $t('lottery.lotteryType.category'),
    component: 'Select',
    required: true,
    componentProps: {
      options: [
        { label: '福彩', value: '福彩' },
        { label: '体彩', value: '体彩' },
      ],
    },
  },
  {
    fieldName: 'red_ball_count',
    label: $t('lottery.lotteryType.redBallCount'),
    component: 'InputNumber',
    required: true,
    componentProps: {
      min: 1,
      max: 20,
    },
  },
  {
    fieldName: 'blue_ball_count',
    label: $t('lottery.lotteryType.blueBallCount'),
    component: 'InputNumber',
    componentProps: {
      min: 0,
      max: 10,
    },
  },
  {
    fieldName: 'red_ball_range',
    label: $t('lottery.lotteryType.redBallRange'),
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '如: 1-33',
    },
  },
  {
    fieldName: 'blue_ball_range',
    label: $t('lottery.lotteryType.blueBallRange'),
    component: 'Input',
    componentProps: {
      placeholder: '如: 1-16',
    },
  },
  {
    fieldName: 'draw_time',
    label: $t('lottery.lotteryType.drawTime'),
    component: 'Input',
    required: true,
    componentProps: {
      placeholder: '如: 每周二、四、日21:15',
    },
  },
  {
    fieldName: 'api_url',
    label: 'API地址',
    component: 'Textarea',
    required: true,
    componentProps: {
      rows: 2,
      placeholder: '官方API地址',
    },
  },
  {
    fieldName: 'web_url',
    label: '网页地址',
    component: 'Textarea',
    required: true,
    componentProps: {
      rows: 2,
      placeholder: '官方网页地址',
    },
  },
  {
    fieldName: 'game_no',
    label: '游戏编号',
    component: 'Input',
    componentProps: {
      placeholder: '体彩游戏编号（如:85）',
    },
  },
  {
    fieldName: 'status',
    label: $t('lottery.lotteryType.status'),
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
  },
];
