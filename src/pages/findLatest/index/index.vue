<template>
  <view class="search-bar-container">
    <view class="search-bar">
      <image src="/assets/icons/搜索/搜索.png" class="icon" mode="aspectFit" />
      <input class="search-input" v-model="keyword" placeholder="搜索" @confirm="onSearch" />
      <view class="search-btn" @tap="onSearch">搜索</view>
    </view>
  </view>
  <view class="pic_container">
    <image src="../../../assets/C1.png" class="pic" mode="aspectFit" />
  </view>
  <view class="latest-choose">
    <view class="choose-label">寻找最近</view>
    <view class="choose-items-wrapper">
      <view class="choose-item" @tap="toggleImageSelection('toilet')">
        <image src="../../../assets/icons/寻找最近/厕所.png" class="choose-image" mode="aspectFit"
          :class="{ 'selected': selectedImage === 'toilet' }" />
        <view class="choose-text">厕所</view>
      </view>
      <view class="choose-item" @tap="toggleImageSelection('vendingMachine')">
        <image src="../../../assets/icons/寻找最近/售货机.png" class="choose-image" mode="aspectFit"
          :class="{ 'selected': selectedImage === 'vendingMachine' }" />
        <view class="choose-text">售货机</view>
      </view>
    </view>
    <view class="confirm-button" @tap="onConfirm" :style="{ backgroundColor: selectedImage ? '#007aff' : '#ccc' }"
      :disabled="!selectedImage">确认</view>
  </view>
  <view>
    <nut-cascader v-model:visible="visible" v-model="value" title="请选择您的当前位置" :options="options"></nut-cascader>
  </view>
</template>

<script setup>
import './index.scss'
import { ref, onMounted } from 'vue'
import building from 'src/assets/building.json'


const keyword = ref('')
const selectedImage = ref('')
const showDialog = ref(false)
const visible = ref(false)
const value = ref([])
const options = ref(building)

const onSearch = () => {
  console.log('搜索关键词:', keyword.value)
}

const onButtonTapToilet = () => {
  console.log('厕所按钮被点击')
}

const onButtonTapVendingMachine = () => {
  console.log('售货机按钮被点击')
}

const onConfirm = () => {
  console.log('确认按钮被点击')
  showDialog.value = true
  visible.value = true
}

const toggleImageSelection = (imageType) => {
  if (selectedImage.value === imageType) {
    selectedImage.value = ''
  } else {
    selectedImage.value = imageType
  }
}
</script>