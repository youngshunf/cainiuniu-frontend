<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { lotteryApi } from '#/api/lottery';

import { columns, searchFormSchema } from './data';

/**
 * 表格配置
 */
const searchFormOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('lottery.common.search'),
  },
  resetButtonOptions: {
    content: $t('lottery.common.reset'),
  },
  schema: searchFormSchema,
};

const gridOptions: VxeTableGridOptions<any> = {
  rowConfig: {
    keyField: 'id',
  },
  height: 'auto',
  exportConfig: {},
  printConfig: {},
  toolbarConfig: {
    export: true,
    print: true,
    refresh: true,
    refreshOptions: {
      code: 'query',
    },
    custom: true,
    zoom: true,
  },
  columns,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await lotteryApi.getDrawResultList({
          page: page.currentPage,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions,
});

/**
 * 操作按钮
 */
async function onActionClick({ type, record }: OnActionClickParams) {
  if (type === 'view') {
    await handleViewDetail(record);
  }
}

/**
 * 同步数据
 */
const syncLotteryCode = ref('');
const [SyncModal, syncModalApi] = useVbenModal({
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      syncLotteryCode.value = '';
    }
  },
});

async function handleSync() {
  await syncModalApi.open({
    title: $t('lottery.drawResult.sync'),
    width: 400,
    footer: true,
    onConfirm: async () => {
      if (!syncLotteryCode.value) {
        message.warning('请输入彩种代码');
        return;
      }
      try {
        await lotteryApi.syncDrawData(syncLotteryCode.value, 30);
        message.success('同步任务已启动');
        gridApi.query();
        syncModalApi.close();
      } catch (error: any) {
        message.error(error.message || '同步失败');
      }
    },
    onCancel: () => {
      syncModalApi.close();
    },
  });
}

/**
 * 全量同步历史
 */
async function handleSyncHistory() {
  await syncModalApi.open({
    title: $t('lottery.drawResult.syncHistory'),
    width: 400,
    footer: true,
    onConfirm: async () => {
      if (!syncLotteryCode.value) {
        message.warning('请输入彩种代码');
        return;
      }

      Modal.confirm({
        title: '确认全量同步',
        content: '全量同步可能需要较长时间，确认继续？',
        onOk: async () => {
          try {
            await lotteryApi.syncHistoryData(syncLotteryCode.value);
            message.success('全量同步任务已启动，请稍后查看结果');
            syncModalApi.close();
          } catch (error: any) {
            message.error(error.message || '同步失败');
          }
        },
      });
    },
    onCancel: () => {
      syncModalApi.close();
    },
  });
}

/**
 * 查看详情
 */
const detailData = ref<any>(null);
const [DetailModal, detailModalApi] = useVbenModal({
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      detailData.value = null;
    }
  },
});

async function handleViewDetail(record: any) {
  detailData.value = record;
  await detailModalApi.open({
    title: `${record.lottery_code} ${record.period}期 开奖详情`,
    width: 600,
    footer: false,
  });
}
</script>

<template>
  <Page
    auto-content-height
    class="h-full"
    content-class="flex flex-col"
    :content-padding="16"
  >
    <Grid>
      <template #toolbar-actions>
        <VbenButton type="primary" @click="handleSync">
          {{ $t('lottery.drawResult.sync') }}
        </VbenButton>
        <VbenButton @click="handleSyncHistory">
          {{ $t('lottery.drawResult.syncHistory') }}
        </VbenButton>
      </template>

      <template #action="{ row }">
        <VbenButton
          size="small"
          @click="onActionClick({ type: 'view', record: row })"
        >
          {{ $t('lottery.drawResult.viewDetail') }}
        </VbenButton>
      </template>
    </Grid>

    <!-- 同步对话框 -->
    <SyncModal>
      <div class="p-4">
        <label class="mb-2 block">彩种代码:</label>
        <input
          v-model="syncLotteryCode"
          class="w-full rounded border px-3 py-2"
          placeholder="请输入彩种代码，如: ssq, dlt"
        />
      </div>
    </SyncModal>

    <!-- 详情对话框 -->
    <DetailModal>
      <div v-if="detailData" class="p-4">
        <div class="mb-4">
          <div class="text-gray-600">期号:</div>
          <div class="text-lg font-bold">{{ detailData.period }}</div>
        </div>
        <div class="mb-4">
          <div class="text-gray-600">开奖日期:</div>
          <div>{{ detailData.draw_date }}</div>
        </div>
        <div class="mb-4">
          <div class="text-gray-600">红球:</div>
          <div class="mt-2 flex gap-2">
            <span
              v-for="ball in JSON.parse(detailData.red_balls)"
              :key="ball"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-base font-bold text-white"
            >
              {{ ball }}
            </span>
          </div>
        </div>
        <div v-if="detailData.blue_balls" class="mb-4">
          <div class="text-gray-600">蓝球:</div>
          <div class="mt-2 flex gap-2">
            <span
              v-for="ball in JSON.parse(detailData.blue_balls)"
              :key="ball"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-base font-bold text-white"
            >
              {{ ball }}
            </span>
          </div>
        </div>
        <div class="mb-4">
          <div class="text-gray-600">数据来源:</div>
          <div>{{ detailData.sync_source }}</div>
        </div>
        <div>
          <div class="text-gray-600">同步时间:</div>
          <div>{{ detailData.sync_time }}</div>
        </div>
      </div>
    </DetailModal>
  </Page>
</template>
