<template>
  <view class="container">
    <view class="search-bar">
      <image src="/assets/icons/搜索/搜索.png" class="icon" />
      <input class="search-input" v-model="keyword" placeholder="搜索教室、厕所、售货机" @confirm="onSearch" disabled="true"
        @tap="cascaderVisible = true" />
      <view class="search-btn" @tap="onSearch">搜索</view>
    </view>

    <view class="history-list" v-if="history.length">
      <view class="history-item" v-for="(item, index) in history" :key="index">
        <view class="left" @tap="selectHistory(item)">
          <image src="/assets/icons/搜索/时钟.png" class="icon" />
          <view class="info">
            <view class="title">{{ item }}</view>
          </view>
        </view>
        <image src="/assets/icons/搜索/右转箭头.png" class="icon" @tap="selectHistory(item)" />
      </view>

      <view class="clear-history" @tap="clearHistory">
        <image src="/assets/icons/搜索/删除.png" class="icon" />
        清空历史记录
      </view>
    </view>
    <nut-cascader v-model:visible="cascaderVisible" v-model="cascaderValue" title="请选择您的当前位置" :options="options"
      @change="onCascaderChange"></nut-cascader>
  </view>
    <Tabbar></Tabbar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import clock from 'src/assets/icons/搜索/时钟.png'
import find from 'src/assets/icons/搜索/搜索.png'
import right from 'src/assets/icons/搜索/右转箭头.png'
import deleteIcon from 'src/assets/icons/搜索/删除.png'
import building from 'src/assets/building.json'
import { loadSearchHistory, saveSearchHistory, clearSearchHistory } from 'src/utils/api.ts'
import Tabbar from '../../../components/Tabbar.vue'

const keyword = ref('')
const history = ref([])
const options = ref(building)
const cascaderVisible = ref(false)
const cascaderValue = ref([])
const hasLogin = ref(false)

const STORAGE_KEY = 'search_records'

// 加载历史记录
onMounted(() => {
  hasLogin.value = Taro.getStorageSync('token') ? true : false
  console.log('hasLogin', hasLogin.value)
  if (hasLogin.value) {
    loadSearchHistory().then(res => {
      if (res.code === 200) {
        console.log('loadSearchHistory', res.data)
        history.value = res.data
      } else {
        Taro.showToast({
          title: '加载历史记录失败',
          icon: 'none',
        })
      }
    }).catch(err => {
      console.error('Error loading search history:', err)
    })
  } else {
    const stored = Taro.getStorageSync(STORAGE_KEY) || []
    history.value = stored
  }
  console.log('hasLogin', hasLogin.value)
})

function onSearch() {
  if (!keyword.value.trim()) return
  const newItem = keyword.value.trim()
  // 更新历史：去重 + 限制10条
  const list = history.value.filter(i => i!== newItem)
  history.value = [newItem, ...list].slice(0, 10)
  hasLogin.value = Taro.getStorageSync('token') ? true : false
  if (hasLogin.value) {
    console.log('newItem', newItem)
    saveSearchHistory({ 'name': newItem }).then(res => {
      if (res.code === 200) {
        console.log('搜索历史保存成功')
      } else {
        console.error('保存搜索历史失败:', res.message)
      }
    }).catch(err => {
      console.error('Error saving search history:', err)
    })
  } else {
    Taro.setStorageSync(STORAGE_KEY, history.value)
  }
  Taro.navigateTo({
    url: `/pages/place/index/index?name=${keyword.value}`,
  })
}

function selectHistory(item) {
  keyword.value = item
  onSearch()
}

function clearHistory() {
  hasLogin.value = Taro.getStorageSync('token') ? true : false
  if (hasLogin.value) {
    Taro.showModal({
      title: '提示',
      content: '确定要清空历史记录吗？',
      success(res) {
        if (res.confirm) {
          clearSearchHistory().then(res => {
            if (res.code === 200) {
              history.value = []
              console.log('清空成功')
            }
          }).catch(err => {
            console.error('Error clearing search history:', err)
          })
        }
      },
    })
  } else {
    Taro.showModal({
      title: '提示',
      content: '确定要清空历史记录吗？',
      success(res) {
        if (res.confirm) {
          Taro.removeStorageSync(STORAGE_KEY)
          history.value = []
        }
      },
    })
  }

}

function onCascaderChange(value) {
  if (value.length > 2) {
    keyword.value = value[2]
  }
}
</script>

<style lang="scss">
@import './index'; // 如果你写在外部文件中</style>
