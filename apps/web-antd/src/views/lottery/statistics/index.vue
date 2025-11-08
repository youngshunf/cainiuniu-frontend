<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { $t } from '@vben/locales';

import { Card, Statistic } from 'ant-design-vue';

// 统计数据
const stats = ref({
  totalLotteries: 0,
  totalDraws: 0,
  totalPredictions: 0,
  averageAccuracy: 0,
});

onMounted(async () => {
  try {
    // TODO: 实现统计API
    // const data = await lotteryApi.getStatistics();
    // stats.value = data;
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
});
</script>

<template>
  <div class="flex h-full flex-col p-4">
    <h1 class="mb-6 text-2xl font-bold">
      {{ $t('lottery.statistics.title') }}
    </h1>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <Statistic
          :title="$t('lottery.statistics.totalLotteries')"
          :value="stats.totalLotteries"
          :suffix="$t('lottery.statistics.unit')"
        />
      </Card>
      <Card>
        <Statistic
          :title="$t('lottery.statistics.totalDraws')"
          :value="stats.totalDraws"
          :suffix="$t('lottery.statistics.unit')"
        />
      </Card>
      <Card>
        <Statistic
          :title="$t('lottery.statistics.totalPredictions')"
          :value="stats.totalPredictions"
          :suffix="$t('lottery.statistics.unit')"
        />
      </Card>
      <Card>
        <Statistic
          :title="$t('lottery.statistics.averageAccuracy')"
          :value="stats.averageAccuracy"
          suffix="%"
          :precision="1"
        />
      </Card>
    </div>
  </div>
</template>
