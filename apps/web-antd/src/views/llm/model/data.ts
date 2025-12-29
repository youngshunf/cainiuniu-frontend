import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { LlmModelConfigResult, LlmProviderResult } from '#/api';

import { $t } from '@vben/locales';

import { getLlmProviderListApi, updateLlmModelApi } from '#/api';

export const MODEL_TYPES = [
  { label: '文本生成', value: 'TEXT' },
  { label: '推理', value: 'REASONING' },
  { label: '视觉', value: 'VISION' },
  { label: '图像生成', value: 'IMAGE' },
  { label: '视频生成', value: 'VIDEO' },
  { label: '嵌入', value: 'EMBEDDING' },
  { label: '语音合成', value: 'TTS' },
  { label: '语音识别', value: 'STT' },
];

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'model_name',
    label: '模型名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: MODEL_TYPES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'model_type',
    label: '模型类型',
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
  onActionClick?: OnActionClickFn<LlmModelConfigResult>,
): VxeGridProps['columns'] {
  return [
    { field: 'seq', title: '#', type: 'seq', width: 50 },
    { field: 'model_name', title: '模型名称', width: 180 },
    { field: 'display_name', title: '显示名称', width: 150 },
    { field: 'provider_name', title: '供应商', width: 100 },
    {
      field: 'model_type',
      title: '类型',
      width: 100,
      formatter({ cellValue }) {
        const type = MODEL_TYPES.find((t) => t.value === cellValue);
        return type?.label || cellValue;
      },
    },
    { field: 'max_tokens', title: '最大输出', width: 90 },
    { field: 'max_context_length', title: '上下文', width: 90 },
    {
      field: 'input_cost_per_1k',
      title: '输入成本',
      width: 90,
      formatter({ cellValue }) {
        return `$${cellValue}`;
      },
    },
    {
      field: 'output_cost_per_1k',
      title: '输出成本',
      width: 90,
      formatter({ cellValue }) {
        return `$${cellValue}`;
      },
    },
    { field: 'priority', title: '优先级', width: 80 },
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
          beforeChange: async (newVal: boolean, row: LlmModelConfigResult) => {
            await updateLlmModelApi(row.id, { enabled: newVal });
            return true;
          },
        },
      },
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 120,
      cellRender: {
        attrs: {
          nameField: 'model_name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'ApiSelect',
      fieldName: 'provider_id',
      label: '供应商',
      rules: 'selectRequired',
      componentProps: {
        api: () => getLlmProviderListApi({ enabled: true }),
        afterFetch: (data: { items: LlmProviderResult[] }) => data.items,
        labelField: 'name',
        valueField: 'id',
        class: 'w-full',
      },
    },
    {
      component: 'Input',
      fieldName: 'model_name',
      label: '模型名称',
      rules: 'required',
      componentProps: {
        placeholder: 'gpt-4o',
      },
    },
    {
      component: 'Input',
      fieldName: 'display_name',
      label: '显示名称',
      componentProps: {
        placeholder: 'GPT-4o',
      },
    },
    {
      component: 'Select',
      fieldName: 'model_type',
      label: '模型类型',
      rules: 'selectRequired',
      componentProps: {
        options: MODEL_TYPES,
        class: 'w-full',
      },
      defaultValue: 'TEXT',
    },
    {
      component: 'InputNumber',
      fieldName: 'max_tokens',
      label: '最大输出 Tokens',
      componentProps: { min: 1, class: 'w-full' },
      defaultValue: 4096,
    },
    {
      component: 'InputNumber',
      fieldName: 'max_context_length',
      label: '最大上下文',
      componentProps: { min: 1, class: 'w-full' },
      defaultValue: 8192,
    },
    {
      component: 'InputNumber',
      fieldName: 'input_cost_per_1k',
      label: '输入成本/1K',
      componentProps: { min: 0, step: 0.0001, class: 'w-full' },
      defaultValue: 0,
    },
    {
      component: 'InputNumber',
      fieldName: 'output_cost_per_1k',
      label: '输出成本/1K',
      componentProps: { min: 0, step: 0.0001, class: 'w-full' },
      defaultValue: 0,
    },
    {
      component: 'InputNumber',
      fieldName: 'priority',
      label: '优先级',
      componentProps: { min: 0, class: 'w-full' },
      defaultValue: 0,
    },
    {
      component: 'Switch',
      fieldName: 'supports_streaming',
      label: '支持流式',
      defaultValue: true,
    },
    {
      component: 'Switch',
      fieldName: 'supports_tools',
      label: '支持工具',
      defaultValue: false,
    },
    {
      component: 'Switch',
      fieldName: 'supports_vision',
      label: '支持视觉',
      defaultValue: false,
    },
    {
      component: 'Switch',
      fieldName: 'enabled',
      label: '启用',
      defaultValue: true,
    },
  ];
}
