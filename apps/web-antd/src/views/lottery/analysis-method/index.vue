<script setup lang="ts">
import { h } from 'vue';

import { ColPage } from '@vben/common-ui';

import { Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { lotteryApi } from '#/api/lottery';

const gridOptions = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    { field: 'code', title: '方法代码', width: 150 },
    { field: 'name', title: '方法名称', width: 150 },
    {
      field: 'category',
      title: '分类',
      width: 120,
      slots: {
        default: ({ row }: any) => {
          const colorMap: Record<string, string> = {
            traditional: 'blue',
            machine_learning: 'purple',
            statistics: 'green',
            optimization: 'orange',
          };
          return h(Tag, { color: colorMap[row.category] }, () => row.category);
        },
      },
    },
    {
      field: 'description',
      title: '描述',
      width: 300,
      showOverflow: 'tooltip',
    },
    { field: 'required_history_count', title: '所需历史期数', width: 120 },
    {
      field: 'is_premium',
      title: '高级功能',
      width: 90,
      slots: {
        default: ({ row }: any) => {
          return h(Tag, { color: row.is_premium ? 'gold' : 'default' }, () =>
            row.is_premium ? '高级' : '基础',
          );
        },
      },
    },
    { field: 'status', title: '状态', width: 80 },
  ],
  proxyConfig: {
    ajax: {
      query: async () => {
        const data = await lotteryApi.getAnalysisMethods();
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
  <ColPage class="h-full" content-class="flex flex-col">
    <Grid />
  </ColPage>
</template>
