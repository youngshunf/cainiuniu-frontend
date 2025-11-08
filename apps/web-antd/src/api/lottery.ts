/**
 * 彩票分析API接口
 */
import { requestClient } from '#/api/request';

export namespace LotteryApi {
  /** 彩种类型 */
  export interface LotteryType {
    id: number;
    code: string;
    name: string;
    category: string;
    red_ball_count: number;
    blue_ball_count: number;
    red_ball_range: string;
    blue_ball_range?: string;
    draw_time: string;
    status: number;
    created_time: string;
    updated_time: string;
  }

  /** 开奖结果 */
  export interface DrawResult {
    id: number;
    lottery_code: string;
    period: string;
    draw_date: string;
    red_balls: string;
    blue_balls?: string;
    extra_info?: string;
    sync_source: string;
    is_verified: boolean;
    sync_time: string;
  }

  /** 分析方法 */
  export interface AnalysisMethod {
    id: number;
    code: string;
    name: string;
    category: string;
    description: string;
    applicable_lotteries: string;
    is_premium: boolean;
    required_history_count: number;
    status: number;
  }

  /** 分析组合 */
  export interface AnalysisCombination {
    id: number;
    user_id: number;
    name: string;
    lottery_code: string;
    method_configs: string;
    history_periods: number;
    is_auto: boolean;
    accuracy_rate?: number;
    use_count: number;
    status: number;
    created_time: string;
  }

  /** 预测结果 */
  export interface PredictionResult {
    id: number;
    lottery_code: string;
    target_period: string;
    combination_id?: number;
    predicted_numbers: string;
    analysis_article: string;
    confidence_score: number;
    actual_result?: string;
    hit_count?: number;
    is_verified: boolean;
    created_time: string;
  }

  /** 会员套餐 */
  export interface MembershipPlan {
    id: number;
    name: string;
    price: number;
    duration_days: number;
    features: string;
    max_predictions_per_day: number;
    max_custom_combinations: number;
    can_use_ml_methods: boolean;
    status: number;
  }
}

class LotteryApiClient {
  // ========== 彩种管理 ==========

  /**
   * 单个方法分析
   */
  async analyzeSingleMethod(data: {
    history_periods: number;
    lottery_code: string;
    method_code: string;
    params?: any;
  }) {
    return requestClient.post('/api/v1/lottery/analysis/analyze', data.params, {
      params: {
        lottery_code: data.lottery_code,
        method_code: data.method_code,
        history_periods: data.history_periods,
      },
    });
  }

  /**
   * 创建组合
   */
  async createCombination(data: Partial<LotteryApi.AnalysisCombination>) {
    return requestClient.post('/api/v1/lottery/combination/create', data);
  }

  /**
   * 创建彩种
   */
  async createLotteryType(data: Partial<LotteryApi.LotteryType>) {
    return requestClient.post('/api/v1/lottery/lottery-type/create', data);
  }

  /**
   * 创建预测
   */
  async createPrediction(data: {
    combination_id?: number;
    history_periods: number;
    lottery_code: string;
  }) {
    return requestClient.post('/api/v1/lottery/prediction/create', null, {
      params: data,
    });
  }

  /**
   * 删除组合
   */
  async deleteCombination(id: number) {
    return requestClient.delete(`/lottery/combination/${id}`);
  }

  // ========== 开奖数据 ==========

  /**
   * 删除彩种
   */
  async deleteLotteryType(id: number) {
    return requestClient.delete(`/lottery/lottery-type/${id}`);
  }

  /**
   * 获取分析方法列表
   */
  async getAnalysisMethods() {
    return requestClient.get<LotteryApi.AnalysisMethod[]>(
      '/api/v1/lottery/analysis/methods',
    );
  }

  /**
   * 获取组合列表
   */
  async getCombinationList(params?: any) {
    return requestClient.get<any>('/api/v1/lottery/combination/list', {
      params,
    });
  }

  /**
   * 获取单期开奖详情
   */
  async getDrawResult(lottery_code: string, period: string) {
    return requestClient.get<LotteryApi.DrawResult>(
      `/lottery/draw/${lottery_code}/${period}`,
    );
  }

  /**
   * 获取开奖列表
   */
  async getDrawResultList(params?: any) {
    return requestClient.get<any>('/api/v1/lottery/draw/list', { params });
  }

  /**
   * 获取历史开奖
   */
  async getHistoryDrawResults(lottery_code: string, limit: number = 100) {
    return requestClient.get<LotteryApi.DrawResult[]>(
      `/lottery/draw/${lottery_code}/history`,
      {
        params: { limit },
      },
    );
  }

  /**
   * 获取最新开奖
   */
  async getLatestDrawResult(lottery_code: string) {
    return requestClient.get<LotteryApi.DrawResult>(
      `/lottery/draw/${lottery_code}/latest`,
    );
  }

  // ========== 分析方法 ==========

  /**
   * 获取彩种详情
   */
  async getLotteryType(id: number) {
    return requestClient.get<LotteryApi.LotteryType>(
      `/lottery/lottery-type/${id}`,
    );
  }

  /**
   * 获取彩种列表
   */
  async getLotteryTypeList(params?: any) {
    return requestClient.get<any>('/api/v1/lottery/lottery-type/list', {
      params,
    });
  }

  // ========== 组合管理 ==========

  /**
   * 获取会员套餐列表
   */
  async getMembershipPlans() {
    return requestClient.get<LotteryApi.MembershipPlan[]>(
      '/api/v1/lottery/membership/plans',
    );
  }

  /**
   * 获取下期期号
   */
  async getNextPeriod(lottery_code: string) {
    return requestClient.get(`/lottery/draw/${lottery_code}/next-period`);
  }

  /**
   * 获取预测列表
   */
  async getPredictionList(params?: any) {
    return requestClient.get<any>('/api/v1/lottery/prediction/list', {
      params,
    });
  }

  /**
   * 获取用户会员信息
   */
  async getUserMembership(user_id: number) {
    return requestClient.get(`/lottery/membership/user/${user_id}`);
  }

  // ========== 预测管理 ==========

  /**
   * 手动同步开奖数据
   */
  async syncDrawData(lottery_code: string, page_size: number = 30) {
    return requestClient.post(`/lottery/draw/sync/${lottery_code}`, null, {
      params: { page_size },
    });
  }

  /**
   * 全量同步历史数据
   */
  async syncHistoryData(lottery_code: string) {
    return requestClient.post(`/lottery/draw/sync/${lottery_code}/history`);
  }

  /**
   * 更新组合
   */
  async updateCombination(
    id: number,
    data: Partial<LotteryApi.AnalysisCombination>,
  ) {
    return requestClient.put(`/lottery/combination/${id}`, data);
  }

  // ========== 会员管理 ==========

  /**
   * 更新彩种
   */
  async updateLotteryType(id: number, data: Partial<LotteryApi.LotteryType>) {
    return requestClient.put(`/lottery/lottery-type/${id}`, data);
  }

  /**
   * 验证预测结果
   */
  async verifyPrediction(id: number) {
    return requestClient.post(`/lottery/prediction/${id}/verify`);
  }
}

export const lotteryApi = new LotteryApiClient();
