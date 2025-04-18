<template>
  <view>
    <view class="button" @tap="onAdd1">反馈</view>
    <view class="button" @tap="onAdd2">首页</view>
    <view class="button" @tap="onAdd3">搜索页</view>
    <view class="button" @tap="onAdd4">收藏</view>
  </view>
</template>

<script setup>
import {useCounterStore} from '../stores/counter'
import Taro from "@tarojs/taro";
import {onMounted} from "vue";

const counter = useCounterStore()

const onAdd1 = () => {
  Taro.navigateTo({
    url: '/pages/feedback/index/index',
  })
}

const onAdd2 = () => {
  Taro.navigateTo({
    url: '/pages/map/index/index',
  })
}

const onAdd3 = () => {
  Taro.navigateTo({
    url: '/pages/history/index/index',
  })
}

const onAdd4 = () => {
  Taro.navigateTo({
    url: '/pages/collect/index/index',
  })
}

</script>

<style>
.title {
  font-size: 32px;
}

.button {
  border: 1px solid lightgray;
  padding: 5px 10px;
}
</style>
