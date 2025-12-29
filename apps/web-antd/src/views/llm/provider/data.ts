import type { VbenFormSchema } from '#/adapter/form';
import type {
  OnActionClickFn,
  VxeGridProps,
} from '#/adapter/vxe-table';
import type { LlmProviderResult } from '#/api';

import { $t } from '@vben/locales';

import { updateLlmProviderApi } from '#/api';

// 供应商类型选项（决定 API 接口格式）
export const PROVIDER_TYPES = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Anthropic', value: 'anthropic' },
  { label: 'Azure OpenAI', value: 'azure' },
  { label: 'AWS Bedrock', value: 'bedrock' },
  { label: 'Google Vertex AI', value: 'vertex_ai' },
  { label: 'Google Gemini', value: 'gemini' },
  { label: 'Cohere', value: 'cohere' },
  { label: 'Mistral AI', value: 'mistral' },
  { label: 'DeepSeek', value: 'deepseek' },
  { label: '智谱 AI', value: 'zhipu' },
  { label: '通义千问', value: 'qwen' },
  { label: 'Moonshot (Kimi)', value: 'moonshot' },
  { label: '百川', value: 'baichuan' },
  { label: 'MiniMax', value: 'minimax' },
  { label: 'Ollama', value: 'ollama' },
];

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '供应商名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: PROVIDER_TYPES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'provider_type',
    label: '供应商类型',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: [
        { label: '启用', value: true },
        { label: '禁用', value: false },
      ],
      placeholder: $t('common.form.select'),
    },
    fieldName: 'enabled',
    label: '状态',
  },
];

export function useColumns(
  onActionClick?: OnActionClickFn<LlmProviderResult>,
): VxeGridProps['columns'] {
  return [
    { field: 'seq', title: '#', type: 'seq', width: 50 },
    { field: 'name', title: '供应商名称', width: 150 },
    {
      field: 'provider_type',
      title: '供应商类型',
      width: 120,
      formatter({ cellValue }) {
        const type = PROVIDER_TYPES.find((t) => t.value === cellValue);
        return type?.label || cellValue;
      },
    },
    { field: 'api_base_url', title: 'API Base URL', minWidth: 200, showOverflow: true },
    { field: 'global_rpm_limit', title: 'RPM 限制', width: 100 },
    { field: 'global_tpm_limit', title: 'TPM 限制', width: 100 },
    {
      field: 'is_domestic',
      title: '国内供应商',
      width: 110,
      cellRender: {
        name: 'CellSwitch',
        props: {
          checkedValue: true,
          unCheckedValue: false,
          checkedChildren: '是',
          unCheckedChildren: '否',
        },
        attrs: {
          beforeChange: async (newVal: boolean, row: LlmProviderResult) => {
            await updateLlmProviderApi(row.id, { is_domestic: newVal });
            return true;
          },
        },
      },
    },
    {
      field: 'has_api_key',
      title: 'API Key',
      width: 100,
      cellRender: {
        name: 'CellTag',
        props: {
          color: (row: LlmProviderResult) => (row.has_api_key ? 'green' : 'red'),
          content: (row: LlmProviderResult) => (row.has_api_key ? '已配置' : '未配置'),
        },
      },
    },
    {
      field: 'enabled',
      title: '状态',
      width: 100,
      cellRender: {
        name: 'CellSwitch',
        props: {
          checkedValue: true,
          unCheckedValue: false,
          checkedChildren: '启用',
          unCheckedChildren: '禁用',
        },
        attrs: {
          beforeChange: async (newVal: boolean, row: LlmProviderResult) => {
            await updateLlmProviderApi(row.id, { enabled: newVal });
            return true;
          },
        },
      },
    },
    { field: 'description', title: '描述', minWidth: 150, showOverflow: true },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 120,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
    },
  ];
}

export const formSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '供应商名称',
    rules: 'required',
    componentProps: {
      placeholder: '自定义名称，如：Anthropic 官方、Claude AWS',
    },
  },
  {
    component: 'Select',
    fieldName: 'provider_type',
    label: '供应商类型',
    rules: 'selectRequired',
    componentProps: {
      options: PROVIDER_TYPES,
      class: 'w-full',
      placeholder: '选择 API 接口格式',
    },
  },
  {
    component: 'Input',
    fieldName: 'api_base_url',
    label: 'API Base URL',
    componentProps: {
      placeholder: 'https://api.openai.com/v1',
    },
  },
  {
    component: 'InputPassword',
    fieldName: 'api_key',
    label: 'API Key',
    componentProps: {
      placeholder: '留空则不修改',
    },
  },
  {
    component: 'InputNumber',
    fieldName: 'global_rpm_limit',
    label: 'RPM 限制',
    componentProps: {
      min: 1,
      class: 'w-full',
    },
    defaultValue: 60,
  },
  {
    component: 'InputNumber',
    fieldName: 'global_tpm_limit',
    label: 'TPM 限制',
    componentProps: {
      min: 1,
      class: 'w-full',
    },
    defaultValue: 100000,
  },
  {
    component: 'Switch',
    fieldName: 'is_domestic',
    label: '国内供应商',
    defaultValue: false,
  },
  {
    component: 'Switch',
    fieldName: 'enabled',
    label: '启用',
    defaultValue: true,
  },
  {
    component: 'Textarea',
    fieldName: 'description',
    label: '描述',
    componentProps: {
      rows: 2,
    },
  },
];
