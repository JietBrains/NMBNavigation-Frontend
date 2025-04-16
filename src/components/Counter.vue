<template>
  <view>
    <view class="button" @tap="onAdd">ADD</view>

  </view>
</template>

<script>
import { useCounterStore } from '../stores/counter'
import Taro from "@tarojs/taro";

export default {
  setup() {
    const counter = useCounterStore()

    const onAdd = () => {
      Taro.navigateTo({
        url:'/pages/feedback/index/index',
      })
    }

    return {
      counter,
      onAdd
    }
  }
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
