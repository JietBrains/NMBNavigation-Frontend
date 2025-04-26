<template>
  <view class="container">
    <web-view
      id="webview"
      :src="webviewSrc"
    />
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Taro from '@tarojs/taro'
import './index.scss'


const start = ref()
const end = ref()

onMounted(() => {
  const instance = Taro.getCurrentInstance()
  const params = instance?.router?.params || {}
  start.value = params.start || ''
  end.value = params.end || ''
  fullUrl.value=base+"?start="+start.value+"&end="+end.value
  webviewSrc.value=encodeURI(fullUrl.value);
})

// 拼接完整 URL
// const base = "http://localhost:5173"
const base = "http://8.140.200.27:8088"
const fullUrl = ref()

// ✅ 注意使用 encodeURIComponent 包装整个 URL
const webviewSrc = ref()

</script>

<style scoped>
.container {
  height: 100vh;
}
</style>
