<template>
  <view class="container">
    <view class="search-bar" @tap="onSearch">
      <image src="/assets/icons/搜索/搜索.png" class="icon" />
      <input class="search-input" placeholder="搜索教室、厕所、售货机" />
      <view class="search-btn">搜索</view>
    </view>

    <scroll-view scroll-y="true" class="scroll-area">
      <view class="banner-container">
        <swiper class="banner-swiper" indicator-dots="true" indicator-color="grey" indicator-active-color="#ff6600"
          autoplay circular interval="3000" duration="500">
          <swiper-item v-for="(img, index) in images" :key="index">
            <image :src="img" class="banner-image" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>

      <view class=comment-section>
        <nut-cell-group title="用户评论">
          <nut-cell v-for="(comment, index) in comments" :key="index" :title="comment.user" :sub-title="comment.content"
            size="large" :desc="comment.time">
            <template #icon>
              <nut-avatar size="normal">
                <image :src = "comment.avatar" />
              </nut-avatar>
            </template>
          </nut-cell>
        </nut-cell-group>
      </view>

    </scroll-view>



    <view v-if="showInput" class="modal-mask">
      <view class="modal-content">
        <view class="modal-title">请输入起点</view>
        <input type="text" v-model="inputValue" placeholder="例如：F301" class="modal-input" />
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
        <image src = "/assets/icons/聊天.png" class="icon"/>
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
import { ref } from "vue";
import photo from '/src/assets/A1.jpg'
import collectIcon from 'src/assets/icons/收藏.png'
import wayIcon from 'src/assets/icons/导航.png'
import message from 'src/assets/icons/聊天.png'


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

const selectedPlace = { name: '咖啡店', description: '提供咖啡、甜点和休闲环境。' }

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

const comments = ref([
  {
    user: '用户A',
    content: '这个产品太棒了，非常实用啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊asas萨达啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊纳斯哦闹i断奶的弄i那是都i爱上你都sand iOS难道i当年都欧纳塞哦对你扫i的你扫i的那丝哦对你是',
    time: '2025-04-24',
    avatar: 'https://picsum.photos/200/200'
  },
  {
    user: '用户B',
    content: '体验还不错，希望能增加更多功能阿三顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶。',
    time: '2025-04-24',
    avatar: 'https://picsum.photos/200/201'
  },
  {
    user: '用户C',
    content: '物流速度很快，好评！',
    time: '2025-04-24',
    avatar: 'https://picsum.photos/200/202'
  },
  {
    user: '用户C',
    content: '物流速度很快，好评！',
    time: '2025-04-24',
    avatar: 'https://picsum.photos/200/202'
  },
  {
    user: '用户C',
    content: '物流速度很快，好评！',
    time: '2025-04-24',
    avatar: 'https://picsum.photos/200/202'
  },
  {
    user: '用户C',
    content: '物流速度很快，好评！',
    time: '2025-04-24',
    avatar: 'https://picsum.photos/200/202'
  }
]);

</script>


<style lang="scss">
@import './index'; // 如果你写在外部文件中</style>
