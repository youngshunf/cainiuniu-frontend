<script setup lang="ts">
import { h } from 'vue';

import { ColPage } from '@vben/common-ui';

import { Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { lotteryApi } from '#/api/lottery';

const gridOptions = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    { field: 'name', title: '套餐名称', width: 120 },
    { field: 'price', title: '价格(元)', width: 100 },
    { field: 'duration_days', title: '有效天数', width: 100 },
    { field: 'max_predictions_per_day', title: '每日预测次数', width: 120 },
    { field: 'max_custom_combinations', title: '自定义组合数', width: 120 },
    {
      field: 'can_use_ml_methods',
      title: '机器学习',
      width: 100,
      slots: {
        default: ({ row }: any) => {
          return h(
            Tag,
            { color: row.can_use_ml_methods ? 'success' : 'default' },
            () => (row.can_use_ml_methods ? '支持' : '不支持'),
          );
        },
      },
    },
    { field: 'sort_order', title: '排序', width: 80 },
    { field: 'status', title: '状态', width: 80 },
  ],
  proxyConfig: {
    ajax: {
      query: async () => {
        const data = await lotteryApi.getMembershipPlans();
        return {
          result: data,
          page: { total: data.length },
        };
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <ColPage class="h-full" content-class="flex flex-col" :content-padding="16">
    <Grid />
  </ColPage>
</template>
