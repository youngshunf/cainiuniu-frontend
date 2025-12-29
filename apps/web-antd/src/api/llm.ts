import { requestClient } from '#/api/request';

// ==================== 类型定义 ====================

// 供应商
export interface LlmProviderResult {
  id: number;
  name: string;
  api_base_url: string | null;
  global_rpm_limit: number;
  global_tpm_limit: number;
  enabled: boolean;
  is_domestic: boolean;
  has_api_key: boolean;
  description: string | null;
}

export interface LlmProviderParams {
  name?: string;
  enabled?: boolean;
  page?: number;
  size?: number;
}

export interface LlmProviderCreateParams {
  name: string;
  api_base_url?: string;
  api_key?: string;
  global_rpm_limit?: number;
  global_tpm_limit?: number;
  enabled?: boolean;
  is_domestic?: boolean;
  description?: string;
}

export interface LlmProviderUpdateParams {
  name?: string;
  api_base_url?: string;
  api_key?: string;
  global_rpm_limit?: number;
  global_tpm_limit?: number;
  enabled?: boolean;
  is_domestic?: boolean;
  description?: string;
}

// 模型配置
export interface LlmModelConfigResult {
  id: number;
  provider_id: number;
  provider_name: string | null;
  model_name: string;
  display_name: string | null;
  model_type: string;
  max_tokens: number;
  max_context_length: number;
  supports_streaming: boolean;
  supports_tools: boolean;
  supports_vision: boolean;
  input_cost_per_1k: number;
  output_cost_per_1k: number;
  rpm_limit: number | null;
  tpm_limit: number | null;
  priority: number;
  enabled: boolean;
}

export interface LlmModelConfigParams {
  provider_id?: number;
  model_type?: string;
  model_name?: string;
  enabled?: boolean;
  page?: number;
  size?: number;
}

export interface LlmModelConfigCreateParams {
  provider_id: number;
  model_name: string;
  display_name?: string;
  model_type: string;
  max_tokens?: number;
  max_context_length?: number;
  supports_streaming?: boolean;
  supports_tools?: boolean;
  supports_vision?: boolean;
  input_cost_per_1k?: number;
  output_cost_per_1k?: number;
  rpm_limit?: number;
  tpm_limit?: number;
  priority?: number;
  enabled?: boolean;
}

// 模型组
export interface LlmModelGroupResult {
  id: number;
  name: string;
  model_type: string;
  model_ids: number[];
  fallback_enabled: boolean;
  retry_count: number;
  timeout_seconds: number;
  enabled: boolean;
  description: string | null;
}

export interface LlmModelGroupParams {
  name?: string;
  model_type?: string;
  enabled?: boolean;
  page?: number;
  size?: number;
}

export interface LlmModelGroupCreateParams {
  name: string;
  model_type: string;
  model_ids?: number[];
  fallback_enabled?: boolean;
  retry_count?: number;
  timeout_seconds?: number;
  enabled?: boolean;
  description?: string;
}

// 速率限制配置
export interface LlmRateLimitResult {
  id: number;
  name: string;
  daily_token_limit: number;
  weekly_token_limit: number | null;
  monthly_token_limit: number;
  rpm_limit: number;
  tpm_limit: number;
  enabled: boolean;
  description: string | null;
}

export interface LlmRateLimitParams {
  name?: string;
  enabled?: boolean;
  page?: number;
  size?: number;
}

export interface LlmRateLimitCreateParams {
  name: string;
  daily_token_limit?: number;
  weekly_token_limit?: number;
  monthly_token_limit?: number;
  rpm_limit?: number;
  tpm_limit?: number;
  enabled?: boolean;
  description?: string;
}

// API Key
export interface LlmApiKeyResult {
  id: number;
  user_id: number;
  name: string;
  key_prefix: string;
  status: string;
  expires_at: string | null;
  rate_limit_config_id: number | null;
  custom_daily_tokens: number | null;
  custom_monthly_tokens: number | null;
  custom_rpm_limit: number | null;
  allowed_models: number[] | null;
  last_used_at: string | null;
  created_time: string;
}

export interface LlmApiKeyCreateParams {
  name: string;
  expires_at?: string;
  rate_limit_config_id?: number;
  custom_daily_tokens?: number;
  custom_monthly_tokens?: number;
  custom_rpm_limit?: number;
  allowed_models?: number[];
}

export interface LlmApiKeyCreateResponse {
  id: number;
  name: string;
  key_prefix: string;
  api_key: string;
  expires_at: string | null;
}

// 用量统计
export interface LlmUsageSummary {
  total_requests: number;
  success_requests: number;
  error_requests: number;
  total_tokens: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost: number;
  avg_latency_ms: number;
}

export interface LlmDailyUsage {
  date: string;
  requests: number;
  tokens: number;
  cost: number;
}

export interface LlmUsageLogResult {
  id: number;
  model_name: string;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  total_cost: number;
  latency_ms: number;
  status: string;
  is_streaming: boolean;
  created_time: string;
}

// ==================== 供应商 API ====================

export async function getLlmProviderListApi(params: LlmProviderParams) {
  return requestClient.get<LlmProviderResult[]>('/api/v1/llm/providers', {
    params,
  });
}

export async function getLlmProviderApi(pk: number) {
  return requestClient.get<LlmProviderResult>(`/api/v1/llm/providers/${pk}`);
}

export async function createLlmProviderApi(data: LlmProviderCreateParams) {
  return requestClient.post('/api/v1/llm/providers', data);
}

export async function updateLlmProviderApi(
  pk: number,
  data: LlmProviderUpdateParams,
) {
  return requestClient.put(`/api/v1/llm/providers/${pk}`, data);
}

export async function deleteLlmProviderApi(pk: number) {
  return requestClient.delete(`/api/v1/llm/providers/${pk}`);
}

// ==================== 模型配置 API ====================

export async function getLlmModelListApi(params: LlmModelConfigParams) {
  return requestClient.get<LlmModelConfigResult[]>('/api/v1/llm/models', {
    params,
  });
}

export async function getLlmModelApi(pk: number) {
  return requestClient.get<LlmModelConfigResult>(`/api/v1/llm/models/${pk}`);
}

export async function createLlmModelApi(data: LlmModelConfigCreateParams) {
  return requestClient.post('/api/v1/llm/models', data);
}

export async function updateLlmModelApi(
  pk: number,
  data: Partial<LlmModelConfigCreateParams>,
) {
  return requestClient.put(`/api/v1/llm/models/${pk}`, data);
}

export async function deleteLlmModelApi(pk: number) {
  return requestClient.delete(`/api/v1/llm/models/${pk}`);
}

export async function getAvailableModelsApi() {
  return requestClient.get<LlmModelConfigResult[]>('/api/v1/llm/models/available');
}

// ==================== 模型组 API ====================

export async function getLlmModelGroupListApi(params: LlmModelGroupParams) {
  return requestClient.get<LlmModelGroupResult[]>('/api/v1/llm/model-groups', {
    params,
  });
}

export async function createLlmModelGroupApi(data: LlmModelGroupCreateParams) {
  return requestClient.post('/api/v1/llm/model-groups', data);
}

export async function updateLlmModelGroupApi(
  pk: number,
  data: Partial<LlmModelGroupCreateParams>,
) {
  return requestClient.put(`/api/v1/llm/model-groups/${pk}`, data);
}

export async function deleteLlmModelGroupApi(pk: number) {
  return requestClient.delete(`/api/v1/llm/model-groups/${pk}`);
}

// ==================== 速率限制配置 API ====================

export async function getLlmRateLimitListApi(params: LlmRateLimitParams) {
  return requestClient.get<LlmRateLimitResult[]>('/api/v1/llm/rate-limits', {
    params,
  });
}

export async function createLlmRateLimitApi(data: LlmRateLimitCreateParams) {
  return requestClient.post('/api/v1/llm/rate-limits', data);
}

export async function updateLlmRateLimitApi(
  pk: number,
  data: Partial<LlmRateLimitCreateParams>,
) {
  return requestClient.put(`/api/v1/llm/rate-limits/${pk}`, data);
}

export async function deleteLlmRateLimitApi(pk: number) {
  return requestClient.delete(`/api/v1/llm/rate-limits/${pk}`);
}

// ==================== API Key API ====================

export interface LlmApiKeyParams {
  user_id?: number;
  name?: string;
  status?: string;
  page?: number;
  size?: number;
}

export async function getLlmApiKeyListApi(params?: LlmApiKeyParams) {
  return requestClient.get<LlmApiKeyResult[]>('/api/v1/llm/api-keys/admin', {
    params,
  });
}

export async function getLlmApiKeyApi(pk: number) {
  return requestClient.get<LlmApiKeyResult>(`/api/v1/llm/api-keys/${pk}`);
}

export async function createLlmApiKeyApi(data: LlmApiKeyCreateParams) {
  return requestClient.post<LlmApiKeyCreateResponse>(
    '/api/v1/llm/api-keys',
    data,
  );
}

export async function updateLlmApiKeyApi(
  pk: number,
  data: Partial<LlmApiKeyCreateParams & { status?: string }>,
) {
  return requestClient.put(`/api/v1/llm/api-keys/${pk}`, data);
}

export async function deleteLlmApiKeyApi(pk: number) {
  return requestClient.delete(`/api/v1/llm/api-keys/${pk}`);
}

// ==================== 用量统计 API ====================

export async function getLlmUsageSummaryApi(params?: {
  start_date?: string;
  end_date?: string;
}) {
  return requestClient.get<LlmUsageSummary>('/api/v1/llm/usage/summary', {
    params,
  });
}

export async function getLlmDailyUsageApi(days?: number) {
  return requestClient.get<LlmDailyUsage[]>('/api/v1/llm/usage/daily', {
    params: { days },
  });
}

export async function getLlmUsageLogsApi(params?: {
  api_key_id?: number;
  model_name?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  size?: number;
}) {
  return requestClient.get<LlmUsageLogResult[]>('/api/v1/llm/usage/logs', {
    params,
  });
}

export async function getLlmQuotaInfoApi() {
  return requestClient.get('/api/v1/llm/usage/quota');
}
