<template>
  <view class="latest-choose">
    <view class="choose-label">寻找最近设施</view>
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
    <nut-button type="primary" @click="showInput = true" :disabled="!selectedImage">确认</nut-button>
  </view>
  <nut-cascader v-model:visible="cascaderVisible" v-model="cascaderValue" title="请选择您的当前位置"
    :options="options"></nut-cascader>
  <view v-if="showInput" class="modal-mask">
    <view class="modal-content">
      <nut-cell title="请选择您的当前地址" :desc="cascaderValue.toString() || '当前地址'" @click="cascaderVisible = true" />
      <view class="modal-buttons">
        <nut-button @click="cancel">取消</nut-button>
        <nut-button type="primary" @click="confirm">确认</nut-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import './index.scss'
import { ref, onMounted } from 'vue'
import building from 'src/assets/building.json'


const keyword = ref('')
const selectedImage = ref('')
const options = ref(building)
const showInput = ref(false)
const cascaderVisible = ref(false)
const cascaderValue = ref([])

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
  visible.value = true
}

const toggleImageSelection = (imageType) => {
  if (selectedImage.value === imageType) {
    selectedImage.value = ''
  } else {
    selectedImage.value = imageType
  }
}

const cancel = () => {
  showInput.value = false
  cascaderVisible.value = false
}

const confirm = () => {
  showInput.value = false
  cascaderVisible.value = false
  console.log('当前地址:', cascaderValue.value)
}
</script>