<template>
  <view class="latest-choose">
    <view class="choose-label">寻找最近设施</view>
    <view class="choose-items-wrapper">
      <view class="choose-item" @tap="showInput = true">
        <image src="../../../assets/icons/寻找最近/厕所.png" class="choose-image" mode="aspectFit"
               :class="{ 'selected': selectedImage === 'toilet' }"/>
        <view class="choose-text">厕所</view>
      </view>
      <view class="choose-item" @tap="showInput = true">
        <image src="../../../assets/icons/寻找最近/售货机.png" class="choose-image" mode="aspectFit"
               :class="{ 'selected': selectedImage === 'vendingMachine' }"/>
        <view class="choose-text">售货机</view>
      </view>
    </view>
  </view>
  <nut-cascader v-model:visible="cascaderVisible" v-model="cascaderValue" title="请选择您的当前位置"
                :options="options"></nut-cascader>
  <view v-if="showInput" class="modal-mask">
    <view class="modal-content">
      <nut-cell title="请选择您的当前地址" :desc="cascaderValue.toString() || '当前地址'"
                @click="cascaderVisible = true"/>
      <view class="modal-buttons">
        <nut-button @click="cancel">取消</nut-button>
        <nut-button type="primary" @click="confirm">确认</nut-button>
      </view>
    </view>
  </view>
  <Tabbar :count="1"></Tabbar>
</template>

<script setup>
import './index.scss'
import {ref, onMounted, computed} from 'vue'
import building from 'src/assets/building.json'
import Taro from "@tarojs/taro";
import Tabbar from '../../../components/Tabbar.vue'

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
  cascaderValue.value = []
  cascaderVisible.value = false
}

const status = computed(() =>{
     if(selectedImage.value === 'toilet'){
       return 0
     }else if(selectedImage.value === 'vendingMachine'){
       return 1
     }else {
       return 2
     }
  }
)
const confirm = () => {
  if (cascaderValue.value.length === 0) {
    Taro.showToast({
      title: '请选择您的当前位置',
      icon: 'none',
      duration: 2000
    })
    return
  }
  showInput.value = false
  cascaderVisible.value = false
  console.log('当前地址:', cascaderValue.value)
  Taro.navigateTo({
    url: `/pages/navigation/index/index?start=${cascaderValue.value[2]}&status=${status.value}`,
  })
}
</script>
