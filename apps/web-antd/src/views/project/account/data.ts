import type { VbenFormSchema } from '#/adapter/form';
import type {
  OnActionClickFn,
  VxeGridProps,
} from '#/adapter/vxe-table';
import type { PlatformAccount } from '#/api/project/account';

import { $t } from '@vben/locales';

import { h } from 'vue';
import { Tag, Avatar } from 'ant-design-vue';

// 平台配置映射
const platformMap: Record<string, { color: string; text: string }> = {
  xiaohongshu: { color: 'red', text: '小红书' },
  wechat: { color: 'green', text: '微信公众号' },
  douyin: { color: 'black', text: '抖音' },
};

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'account_name',
    label: '账号名称',
  },
  {
    component: 'Select',
    fieldName: 'platform',
    label: '平台',
    componentProps: {
      options: [
        { label: '小红书', value: 'xiaohongshu' },
        { label: '微信公众号', value: 'wechat' },
        { label: '抖音', value: 'douyin' },
      ],
    },
  },
];

export function useColumns(
  onActionClick?: OnActionClickFn<PlatformAccount>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      fixed: 'left',
      width: 50,
    },
    {
      field: 'platform',
      title: '平台',
      width: 120,
      slots: { default: 'platform' },
    },
    {
      field: 'avatar_url',
      title: '头像',
      width: 80,
      slots: { default: 'avatar' },
    },
    {
      field: 'account_name',
      title: '账号名称',
      minWidth: 150,
    },
    {
      field: 'account_id',
      title: '平台ID',
      width: 150,
    },
    {
      field: 'followers_count',
      title: '粉丝数',
      width: 100,
      formatter: ({ cellValue }) => {
        if (cellValue >= 10000) {
          return `${(cellValue / 10000).toFixed(1)}w`;
        }
        return cellValue;
      },
    },
    {
      field: 'session_valid',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    {
      field: 'last_sync_at',
      title: '最近同步',
      width: 180,
      formatter: ({ cellValue }) => cellValue ? new Date(cellValue).toLocaleString() : '-',
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 100,
      cellRender: {
        attrs: {
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'delete',
            text: '解绑',
            status: 'danger',
          },
        ],
      },
    },
  ];
}
