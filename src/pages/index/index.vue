<template>
  <view class="home">
    <text>这是首页</text>
    <button @tap="toHome">Home</button>
    <TabBar />
  </view>
</template>

<script lang="ts" setup>

import TabBar from "../../components/TabBar.vue";
import Taro from '@tarojs/taro'
function toHome() {
  Taro.navigateTo({
        url: '/pages/home/index',
    })
}

</script>

<style scoped>
.home {
  padding-bottom: 60px;
}
</style>