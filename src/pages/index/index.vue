<template>
  <view class="home">
    <text>这是首页</text>
    <button @tap="tap"> TAP</button>
    <TabBar />
  </view>
</template>

<script lang="ts" setup>
import TabBar from "../../components/TabBar.vue";
function tap() {
  console.log('TAP');
}
</script>

<style scoped>
.home {
  padding-bottom: 60px; /* 为底部导航栏留出空间 */
}
</style>