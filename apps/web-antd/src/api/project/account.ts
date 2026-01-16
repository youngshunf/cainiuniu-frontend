import { requestClient } from '#/api/request';

/**
 * 平台账号 API 接口定义
 */

export interface PlatformAccount {
  id: number;
  project_id: number;
  platform: string;
  account_id: string;
  account_name: string;
  avatar_url?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_active: boolean;
  session_valid: boolean;
  metadata_info?: Record<string, any>;
  last_sync_at?: string;
  server_version: number;
  created_time: string;
}

export interface PlatformAccountCreate {
  platform: string;
  account_id: string;
  account_name?: string;
  avatar_url?: string;
  followers_count?: number;
}

export interface PlatformAccountUpdate {
  account_name?: string;
  avatar_url?: string;
  followers_count?: number;
  is_active?: boolean;
}

/**
 * 获取项目下的账号列表
 */
export async function getAccountsApi(projectId: number) {
  return requestClient.get<PlatformAccount[]>(`/api/v1/projects/${projectId}/accounts`);
}

/**
 * 创建平台账号
 */
export async function createAccountApi(projectId: number, data: PlatformAccountCreate) {
  return requestClient.post<PlatformAccount>(`/api/v1/projects/${projectId}/accounts`, data);
}

/**
 * 更新平台账号
 */
export async function updateAccountApi(projectId: number, accountId: number, data: PlatformAccountUpdate) {
  return requestClient.put(`/api/v1/projects/${projectId}/accounts/${accountId}`, data);
}

/**
 * 删除平台账号
 */
export async function deleteAccountApi(projectId: number, accountId: number) {
  return requestClient.delete(`/api/v1/projects/${projectId}/accounts/${accountId}`);
}
