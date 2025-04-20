<template>
  <view>
    <text class="title">{{ counter.count }}</text>
    <view class="button" @tap="onAdd">ADD </view>
    hello world  

  </view>

</template>

<script>
import { useCounterStore } from '../stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    const onAdd = () => {
      counter.count++

      // with autocompletion ✨
      // counter.$patch({count: counter.count + 1})

      // or using an action instead
      counter.increment()
    }

    return {
      counter,
      onAdd
    }
  }
}
</script>

<style>

</style>
