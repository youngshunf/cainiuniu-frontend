<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { ref } from 'vue';

import { ColPage, useVbenModal, VbenButton } from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { lotteryApi } from '#/api/lottery';

import { columns, createPredictionSchema, searchFormSchema } from './data';

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
        return await lotteryApi.getPredictionList({
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
  switch (type) {
    case 'verify': {
      await handleVerify(record);
      break;
    }
    case 'view': {
      await handleViewArticle(record);
      break;
    }
  }
}

/**
 * 创建预测
 */
const [CreateModal, createModalApi] = useVbenModal({
  connectedComponent: useVbenForm,
});

const formApi = ref();

async function handleCreate() {
  const [formInstance] = await createModalApi.open({
    title: $t('lottery.prediction.create'),
    width: 600,
    footer: true,
    onConfirm: async () => {
      try {
        const values = await formApi.value?.form.validate();
        const loading = message.loading('正在生成预测...', 0);

        await lotteryApi.createPrediction({
          lottery_code: values.lottery_code,
          combination_id: values.combination_id
            ? Number(values.combination_id)
            : undefined,
          history_periods: values.history_periods,
        });

        loading();
        message.success('预测生成成功！');
        gridApi.query();
        createModalApi.close();
      } catch (error: any) {
        message.error(error.message || '预测失败');
      }
    },
    onCancel: () => {
      createModalApi.close();
    },
    connectedComponentOptions: {
      schema: createPredictionSchema,
    },
  });
  formApi.value = formInstance;
}

/**
 * 查看分析文章
 */
const [ArticleModal, articleModalApi] = useVbenModal();
const articleContent = ref('');

async function handleViewArticle(record: any) {
  articleContent.value = record.analysis_article;
  await articleModalApi.open({
    title: `${record.lottery_code} ${record.target_period}期 分析文章`,
    width: 900,
    footer: false,
  });
}

/**
 * 验证预测
 */
async function handleVerify(record: any) {
  if (record.is_verified) {
    message.info('该预测已验证');
    return;
  }

  Modal.confirm({
    title: '验证预测结果',
    content: `确认验证 ${record.lottery_code} ${record.target_period}期的预测结果？`,
    onOk: async () => {
      try {
        const result = await lotteryApi.verifyPrediction(record.id);
        if (result.success) {
          message.success(`验证成功！命中 ${result.total_hits} 个号码`);
          gridApi.query();
        } else {
          message.warning(result.msg || '实际开奖结果尚未公布');
        }
      } catch (error: any) {
        message.error(error.message || '验证失败');
      }
    },
  });
}
</script>

<template>
  <ColPage class="h-full" content-class="flex flex-col" :content-padding="16">
    <Grid>
      <template #toolbar-actions>
        <VbenButton type="primary" @click="handleCreate">
          <MaterialSymbolsAdd class="size-5" />
          {{ $t('lottery.prediction.create') }}
        </VbenButton>
      </template>

      <template #action="{ row }">
        <VbenButton
          size="small"
          @click="onActionClick({ type: 'view', record: row })"
        >
          {{ $t('lottery.prediction.viewArticle') }}
        </VbenButton>
        <VbenButton
          v-if="!row.is_verified"
          class="ml-2"
          size="small"
          type="primary"
          @click="onActionClick({ type: 'verify', record: row })"
        >
          {{ $t('lottery.prediction.verify') }}
        </VbenButton>
      </template>
    </Grid>

    <CreateModal />

    <!-- 分析文章对话框 -->
    <ArticleModal>
      <div class="prose max-w-none p-6">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="articleContent"></div>
      </div>
    </ArticleModal>
  </ColPage>
</template>

<style scoped>
:deep(.prose) {
  max-width: none;
}

:deep(.prose h1) {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}

:deep(.prose h2) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
}

:deep(.prose h3) {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

:deep(.prose ul) {
  padding-left: 1.5rem;
  list-style-type: disc;
}

:deep(.prose li) {
  margin-bottom: 0.25rem;
}
</style>
