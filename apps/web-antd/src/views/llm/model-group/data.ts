/**
 * 模型组管理页面数据配置
 * @author Ysf
 */
import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { LlmModelGroupResult, LlmModelConfigResult } from '#/api';

import type { Ref } from 'vue';

import { $t } from '@vben/locales';

import { updateLlmModelGroupApi } from '#/api';

import { MODEL_TYPES } from '../model/data';

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '组名称',
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
  onActionClick?: OnActionClickFn<LlmModelGroupResult>,
): VxeGridProps['columns'] {
  return [
    { field: 'seq', title: '#', type: 'seq', width: 50 },
    { field: 'name', title: '组名称', width: 150 },
    {
      field: 'model_type',
      title: '模型类型',
      width: 100,
      formatter({ cellValue }) {
        const type = MODEL_TYPES.find((t) => t.value === cellValue);
        return type?.label || cellValue;
      },
    },
    {
      field: 'model_ids',
      title: '模型数量',
      width: 90,
      formatter({ cellValue }) {
        return cellValue?.length || 0;
      },
    },
    {
      field: 'fallback_enabled',
      title: '故障转移',
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
          beforeChange: async (newVal: boolean, row: LlmModelGroupResult) => {
            await updateLlmModelGroupApi(row.id, { fallback_enabled: newVal });
            return true;
          },
        },
      },
    },
    { field: 'retry_count', title: '重试次数', width: 90 },
    { field: 'timeout_seconds', title: '超时(秒)', width: 90 },
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
          beforeChange: async (newVal: boolean, row: LlmModelGroupResult) => {
            await updateLlmModelGroupApi(row.id, { enabled: newVal });
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

export function useFormSchema(
  modelOptions: Ref<LlmModelConfigResult[]>,
): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '组名称',
      rules: 'required',
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
      component: 'Select',
      fieldName: 'model_ids',
      label: '关联模型',
      componentProps: {
        mode: 'multiple',
        options: modelOptions,
        fieldNames: { label: 'model_name', value: 'id' },
        class: 'w-full',
        placeholder: '选择关联的模型',
      },
    },
    {
      component: 'Switch',
      fieldName: 'fallback_enabled',
      label: '故障转移',
      defaultValue: true,
    },
    {
      component: 'InputNumber',
      fieldName: 'retry_count',
      label: '重试次数',
      componentProps: { min: 0, max: 10, class: 'w-full' },
      defaultValue: 3,
    },
    {
      component: 'InputNumber',
      fieldName: 'timeout_seconds',
      label: '超时时间(秒)',
      componentProps: { min: 1, max: 300, class: 'w-full' },
      defaultValue: 60,
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
      componentProps: { rows: 2 },
    },
  ];
}
