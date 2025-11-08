<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenModal, VbenButton } from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { Modal as AntModal, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { lotteryApi } from '#/api/lottery';

import { columns, formSchema, searchFormSchema } from './data';

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
  checkboxConfig: {
    highlight: true,
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
        return await lotteryApi.getLotteryTypeList({
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
    case 'delete': {
      await handleDelete(record);
      break;
    }
    case 'edit': {
      await handleEdit(record);
      break;
    }
  }
}

/**
 * 新增/编辑
 */
const [Modal, modalApi] = useVbenModal({
  connectedComponent: useVbenForm,
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      formApi.value.form.resetFields();
    }
  },
});

const formApi = ref();

async function handleAdd() {
  const [formInstance] = await modalApi.open({
    title: $t('lottery.common.create'),
    width: 700,
    footer: true,
    onConfirm: async () => {
      try {
        const values = await formApi.value?.form.validate();
        await lotteryApi.createLotteryType(values);
        message.success($t('lottery.common.createSuccess'));
        gridApi.query();
        modalApi.close();
      } catch (error: any) {
        message.error(error.message || $t('lottery.common.error'));
      }
    },
    onCancel: () => {
      modalApi.close();
    },
    connectedComponentOptions: {
      schema: formSchema,
    },
  });
  formApi.value = formInstance;
}

async function handleEdit(record: any) {
  const [formInstance] = await modalApi.open({
    title: $t('lottery.common.edit'),
    width: 700,
    footer: true,
    onConfirm: async () => {
      try {
        const values = await formApi.value?.form.validate();
        await lotteryApi.updateLotteryType(record.id, values);
        message.success($t('lottery.common.updateSuccess'));
        gridApi.query();
        modalApi.close();
      } catch (error: any) {
        message.error(error.message || $t('lottery.common.error'));
      }
    },
    onCancel: () => {
      modalApi.close();
    },
    connectedComponentOptions: {
      schema: formSchema,
    },
  });
  formApi.value = formInstance;

  // 填充表单数据
  setTimeout(() => {
    formApi.value?.form.setFieldsValue(record);
  }, 100);
}

/**
 * 删除
 */
async function handleDelete(record: any) {
  AntModal.confirm({
    title: $t('lottery.common.confirmDelete'),
    content: `确认删除彩种: ${record.name}?`,
    onOk: async () => {
      try {
        await lotteryApi.deleteLotteryType(record.id);
        message.success($t('lottery.common.deleteSuccess'));
        gridApi.query();
      } catch (error: any) {
        message.error(error.message || $t('lottery.common.error'));
      }
    },
  });
}

/**
 * 批量删除
 */
async function handleBatchDelete() {
  const selectRecords = gridApi.grid.getCheckboxRecords();
  if (selectRecords.length === 0) {
    message.warning('请选择要删除的数据');
    return;
  }

  AntModal.confirm({
    title: $t('lottery.common.confirmDelete'),
    content: `确认删除选中的 ${selectRecords.length} 条数据?`,
    onOk: async () => {
      try {
        for (const record of selectRecords) {
          await lotteryApi.deleteLotteryType(record.id);
        }
        message.success($t('lottery.common.deleteSuccess'));
        gridApi.query();
      } catch (error: any) {
        message.error(error.message || $t('lottery.common.error'));
      }
    },
  });
}
</script>

<template>
  <ColPage class="h-full" content-class="flex flex-col" :content-padding="16">
    <Grid>
      <template #toolbar-actions>
        <VbenButton @click="handleAdd">
          <MaterialSymbolsAdd class="size-5" />
          {{ $t('lottery.common.create') }}
        </VbenButton>
        <VbenButton class="ml-2" danger @click="handleBatchDelete">
          {{ $t('lottery.common.delete') }}
        </VbenButton>
      </template>

      <template #action="{ row }">
        <VbenButton
          size="small"
          @click="onActionClick({ type: 'edit', record: row })"
        >
          {{ $t('lottery.common.edit') }}
        </VbenButton>
        <VbenButton
          class="ml-2"
          danger
          size="small"
          @click="onActionClick({ type: 'delete', record: row })"
        >
          {{ $t('lottery.common.delete') }}
        </VbenButton>
      </template>
    </Grid>
    <Modal />
  </ColPage>
</template>
