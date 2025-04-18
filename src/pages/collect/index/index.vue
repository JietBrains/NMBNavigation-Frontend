<template>
  <view class="container">
    <!-- 顶部分类 tab -->
    <view class="tab-bar">
      <view
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-item', currentTab === tab ? 'active' : '']"
        @tap="selectTab(tab)"
      >
        {{ tab }}
      </view>
    </view>

    <!-- 收藏列表 -->
    <view class="fav-list">
      <view
        v-for="item in filteredList"
        :key="item.id"
        class="fav-item"
        @tap="goToLocation(item)"
      >
       <image src="/assets/icons/收藏.png" class="icon"/>
        <view class="info">
          <view class="line">
            {{ item.floor }}　{{ item.building }}　{{ item.name }}
          </view>
        </view>
        <view class="icon">➡️</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import collectIcon from 'src/assets/icons/收藏.png'

const tabs = ['教室', '零食柜', '厕所']
const currentTab = ref('教室')

// 收藏数据
const allItems = ref([
  { id: 1, type: '教室', floor: '几层', building: 'A座', name: 'xxx教室' },
  { id: 2, type: '零食柜', floor: '几层', building: 'A座', name: '零食柜1' },
  // 可以继续添加
])

// 当前分类下的收藏项
const filteredList = computed(() => {
  return allItems.value.filter(item => item.type === currentTab.value)
})

function selectTab(tab) {
  currentTab.value = tab
}

function goToLocation(item) {
  Taro.navigateTo({
    url: `/pages/location/index?id=${item.id}`
  })
}
</script>

<style lang="scss">
@import './index'; // 如果你写在外部文件中

</style>
