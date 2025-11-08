<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Card, Statistic, Table } from 'ant-design-vue';

// 统计数据
const stats = ref({
  totalLotteries: 8,
  todayPredictions: 0,
  totalPredictions: 0,
  averageAccuracy: 0,
});

// 最新开奖
const latestDraws = ref<any[]>([]);

// 最新预测
const latestPredictions = ref<any[]>([]);

onMounted(async () => {
  // 加载统计数据
  // TODO: 实现统计API
});

const drawColumns = [
  { title: '彩种', dataIndex: 'lottery_code', key: 'lottery_code' },
  { title: '期号', dataIndex: 'period', key: 'period' },
  { title: '开奖日期', dataIndex: 'draw_date', key: 'draw_date' },
  { title: '红球', dataIndex: 'red_balls', key: 'red_balls' },
];

const predictionColumns = [
  { title: '彩种', dataIndex: 'lottery_code', key: 'lottery_code' },
  { title: '目标期号', dataIndex: 'target_period', key: 'target_period' },
  { title: '置信度', dataIndex: 'confidence_score', key: 'confidence_score' },
  { title: '创建时间', dataIndex: 'created_time', key: 'created_time' },
];
</script>

<template>
  <div class="p-6">
    <h1 class="mb-6 text-2xl font-bold">彩票分析系统 - 数据总览</h1>

    <!-- 统计卡片 -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <Statistic title="支持彩种" :value="stats.totalLotteries" suffix="种" />
      </Card>
      <Card>
        <Statistic
          title="今日预测"
          :value="stats.todayPredictions"
          suffix="次"
        />
      </Card>
      <Card>
        <Statistic
          title="累计预测"
          :value="stats.totalPredictions"
          suffix="次"
        />
      </Card>
      <Card>
        <Statistic
          title="平均准确率"
          :value="stats.averageAccuracy"
          suffix="%"
          :precision="1"
        />
      </Card>
    </div>

    <!-- 最新数据 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card title="最新开奖" :bordered="false">
        <Table
          :columns="drawColumns"
          :data-source="latestDraws"
          :pagination="false"
          size="small"
        />
      </Card>

      <Card title="最新预测" :bordered="false">
        <Table
          :columns="predictionColumns"
          :data-source="latestPredictions"
          :pagination="false"
          size="small"
        />
      </Card>
    </div>
  </div>
</template>
