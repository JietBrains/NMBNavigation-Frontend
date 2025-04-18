<template>
  <view class="container">
    <view class="search-bar">
      <image src="/assets/icons/搜索/搜索.png" class="icon"/>
      <input
        class="search-input"
        v-model="keyword"
        placeholder="搜索教室、厕所、售货机"
        @confirm="onSearch"
      />
      <view class="search-btn" @tap="onSearch">搜索</view>
    </view>

    <view class="history-list" v-if="history.length">
      <view
        class="history-item"
        v-for="(item, index) in history"
        :key="index"
      >
        <view class="left" @tap="selectHistory(item)">
          <image src="/assets/icons/搜索/时钟.png" class="icon"/>
          <view class="info">
            <view class="title">{{ item.name }}</view>
          </view>
        </view>
        <image
          src="/assets/icons/搜索/右转箭头.png"
          class="icon"
          @tap="selectHistory(item)"
        />
      </view>

      <view class="clear-history" @tap="clearHistory">
        <image src="/assets/icons/搜索/删除.png" class="icon"/>
        清空历史记录
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import Taro from '@tarojs/taro'
import clock from 'src/assets/icons/搜索/时钟.png'
import find from 'src/assets/icons/搜索/搜索.png'
import right from 'src/assets/icons/搜索/右转箭头.png'
import deleteIcon from 'src/assets/icons/搜索/删除.png'

const keyword = ref('')
const history = ref([])

const STORAGE_KEY = 'search_records'

// 加载历史记录
onMounted(() => {
  const stored = Taro.getStorageSync(STORAGE_KEY) || []
  history.value = stored
})

function onSearch() {
  if (!keyword.value.trim()) return
  const newItem = {
    name: keyword.value.trim(),
  }

  // 更新历史：去重 + 限制10条
  const list = history.value.filter(i => i.name !== newItem.name)
  history.value = [newItem, ...list].slice(0, 10)
  Taro.setStorageSync(STORAGE_KEY, history.value)

  // TODO: 执行搜索行为
  Taro.showToast({title: `搜索：${newItem.name}`, icon: 'none'})
}

function selectHistory(item) {
  keyword.value = item.name
  onSearch()
}

function clearHistory() {
  Taro.removeStorageSync(STORAGE_KEY)
  history.value = []
}
</script>

<style lang="scss">
@import './index'; // 如果你写在外部文件中

</style>
