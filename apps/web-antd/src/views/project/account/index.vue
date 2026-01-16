<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';
import type { OnActionClickParams, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PlatformAccount } from '#/api/project/account';

import { ColPage, VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { message, Tag, Avatar } from 'ant-design-vue';
import { useRoute } from 'vue-router';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAccountsApi, deleteAccountApi } from '#/api/project/account';
import { querySchema, useColumns } from './data';

const route = useRoute();
const projectId = Number(route.params.id || 1); // 暂时硬编码或从路由获取

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

const gridOptions: VxeTableGridOptions<PlatformAccount> = {
  rowConfig: {
    keyField: 'id',
  },
  height: 'auto',
  toolbarConfig: {
    refresh: true,
    custom: true,
    zoom: true,
  },
  columns: useColumns(onActionClick),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        // API 暂不支持分页，后续优化
        const data = await getAccountsApi(projectId);
        return {
            items: data,
            total: data.length
        };
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

function onRefresh() {
  gridApi.query();
}

function onActionClick({ code, row }: OnActionClickParams<PlatformAccount>) {
  switch (code) {
    case 'delete': {
      deleteAccountApi(projectId, row.id).then(() => {
        message.success('解绑成功');
        onRefresh();
      });
      break;
    }
  }
}

// 平台配置映射
const platformMap: Record<string, { color: string; text: string }> = {
  xiaohongshu: { color: 'red', text: '小红书' },
  wechat: { color: 'green', text: '微信公众号' },
  douyin: { color: 'black', text: '抖音' },
};
</script>

<template>
  <ColPage auto-content-height>
    <Grid>
      <template #platform="{ row }">
        <Tag :color="platformMap[row.platform]?.color || 'blue'">
          {{ platformMap[row.platform]?.text || row.platform }}
        </Tag>
      </template>
      <template #avatar="{ row }">
        <Avatar :src="row.avatar_url" />
      </template>
      <template #status="{ row }">
        <Tag :color="row.session_valid ? 'success' : 'warning'">
          {{ row.session_valid ? '有效' : '需重新授权' }}
        </Tag>
      </template>
    </Grid>
  </ColPage>
</template>
