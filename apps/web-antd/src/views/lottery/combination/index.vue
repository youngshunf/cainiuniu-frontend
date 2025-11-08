<script setup lang="ts">
import { ColPage, VbenButton } from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { lotteryApi } from '#/api/lottery';

// 简化版组合管理页面
const gridOptions = {
  columns: [
    { type: 'seq', width: 70, title: '序号' },
    { field: 'name', title: '组合名称', width: 150 },
    { field: 'lottery_code', title: '适用彩种', width: 100 },
    { field: 'history_periods', title: '历史期数', width: 100 },
    { field: 'is_auto', title: '自动预测', width: 100 },
    { field: 'accuracy_rate', title: '准确率', width: 100 },
    { field: 'use_count', title: '使用次数', width: 100 },
    { field: 'created_time', title: '创建时间', width: 170 },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }: any, formValues: any) => {
        return await lotteryApi.getCombinationList({
          page: page.currentPage,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <ColPage class="h-full" content-class="flex flex-col" :content-padding="16">
    <Grid>
      <template #toolbar-actions>
        <VbenButton type="primary">
          <MaterialSymbolsAdd class="size-5" />
          创建组合
        </VbenButton>
      </template>
    </Grid>
  </ColPage>
</template>
