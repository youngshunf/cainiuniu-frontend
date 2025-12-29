/**
 * 速率限制配置页面数据配置
 * @author Ysf
 */
import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { LlmRateLimitResult } from '#/api';

import { $t } from '@vben/locales';

import { updateLlmRateLimitApi } from '#/api';

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '配置名称',
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
  onActionClick?: OnActionClickFn<LlmRateLimitResult>,
): VxeGridProps['columns'] {
  return [
    { field: 'seq', title: '#', type: 'seq', width: 50 },
    { field: 'name', title: '配置名称', width: 150 },
    {
      field: 'daily_token_limit',
      title: '日 Token 限制',
      width: 120,
      formatter({ cellValue }) {
        return cellValue?.toLocaleString() || '-';
      },
    },
    {
      field: 'weekly_token_limit',
      title: '周 Token 限制',
      width: 120,
      formatter({ cellValue }) {
        return cellValue?.toLocaleString() || '-';
      },
    },
    {
      field: 'monthly_token_limit',
      title: '月 Token 限制',
      width: 120,
      formatter({ cellValue }) {
        return cellValue?.toLocaleString() || '-';
      },
    },
    { field: 'rpm_limit', title: 'RPM 限制', width: 100 },
    { field: 'tpm_limit', title: 'TPM 限制', width: 100 },
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
          beforeChange: async (newVal: boolean, row: LlmRateLimitResult) => {
            await updateLlmRateLimitApi(row.id, { enabled: newVal });
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
    label: '配置名称',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    fieldName: 'daily_token_limit',
    label: '日 Token 限制',
    componentProps: { min: 0, class: 'w-full' },
    defaultValue: 100000,
  },
  {
    component: 'InputNumber',
    fieldName: 'weekly_token_limit',
    label: '周 Token 限制',
    componentProps: { min: 0, class: 'w-full' },
  },
  {
    component: 'InputNumber',
    fieldName: 'monthly_token_limit',
    label: '月 Token 限制',
    componentProps: { min: 0, class: 'w-full' },
    defaultValue: 1000000,
  },
  {
    component: 'InputNumber',
    fieldName: 'rpm_limit',
    label: 'RPM 限制',
    componentProps: { min: 1, class: 'w-full' },
    defaultValue: 60,
  },
  {
    component: 'InputNumber',
    fieldName: 'tpm_limit',
    label: 'TPM 限制',
    componentProps: { min: 1, class: 'w-full' },
    defaultValue: 100000,
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
