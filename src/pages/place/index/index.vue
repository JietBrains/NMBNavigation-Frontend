<template>
  <view class="container">
    <view class="search-bar" @tap="onSearch">
      <image src="/assets/icons/搜索/搜索.png" class="icon"/>
      <input
        class="search-input"
        placeholder="搜索教室、厕所、售货机"
      />
      <view class="search-btn">搜索</view>
    </view>

    <scroll-view scroll-y="true" class="scroll-area">
      <view class="banner-container">
        <swiper
          class="banner-swiper"
          indicator-dots="true"
          indicator-color="grey"
          indicator-active-color="#ff6600"
          autoplay
          circular
          interval="3000"
          duration="500"
        >
          <swiper-item v-for="(img, index) in images" :key="index">
            <image :src="img" class="banner-image" mode="aspectFill"/>
          </swiper-item>
        </swiper>
      </view>


    </scroll-view>

    <view v-if="showInput" class="modal-mask">
      <view class="modal-content">
        <view class="modal-title">请输入起点</view>
        <input
          type="text"
          v-model="inputValue"
          placeholder="例如：F301"
          class="modal-input"
        />
        <view class="modal-buttons">
          <button @tap="cancel">取消</button>
          <button @tap="confirm">确认</button>
        </view>
      </view>
    </view>

    <view v-if="selectedPlace" class="place-card">
      <view class="place-name">{{ selectedPlace.name }}</view>
      <view class="place-desc">{{ selectedPlace.description }}</view>
      <view class="actions">
        <button class="action-button" open-type="collect">
          <image src="/assets/icons/收藏.png" class="icon"/>
          收藏
        </button>
        <button class="action-button" bindtap="navigateToLocation" @tap="navigateToPlace">
          <image src="/assets/icons/导航.png" class="icon"/>
          去这里
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import './index.scss'
import Taro from "@tarojs/taro";
import {ref} from "vue";
import photo from '/src/assets/A1.jpg'
import collectIcon from 'src/assets/icons/收藏.png'
import wayIcon from 'src/assets/icons/导航.png'


const params = Taro.getCurrentInstance().router?.params
console.log(params?.name)

const onSearch = () => {
  Taro.navigateTo({
    url: '/pages/history/index/index',
  })
}

const images = ref([
  '/assets/A1.jpg',
  '/assets/icons/导航.png',
  '/assets/icons/收藏.png',
])

const selectedPlace = {name: '咖啡店', description: '提供咖啡、甜点和休闲环境。'}

const navigateToPlace = () => {
  showInput.value = true
}


const showInput = ref(false)
const inputValue = ref('')

const cancel = () => {
  showInput.value = false
  inputValue.value = ''
}

const confirm = () => {
  showInput.value = false
  Taro.navigateTo({
    url: `/pages/navigation/index/index?name=${keyword.value}&start=${inputValue.value}`,
  })
}

</script>


<style lang="scss">
@import './index'; // 如果你写在外部文件中

</style>
