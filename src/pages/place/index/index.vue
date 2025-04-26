<template>
  <nut-image-preview :show="showPreview" :images="swiperList" :init-no="currentIndex" @close="hideFn" />
  <view class="container">
    <nut-searchbar disabled="true" @click="onSearch">
      <template #rightin>
        <Search2 />
      </template>
    </nut-searchbar>

    <scroll-view :style="{ height: scrollViewHeight + 'px' }" scroll-y="true" class="scroll-area">
      <view class="swiper-demo">
        <nut-swiper ref="swiperRef" pagination-visible pagination-color="#FF0000" @change="swiperOnChange"
          @click="showFn">
          <nut-swiper-item v-for="(item, index) in imgList" :key="index" style="height: 200px">
            <img :src="item" alt="" style="height: 100%; width: 100%" draggable="false" />
          </nut-swiper-item>
        </nut-swiper>
        <view class="swiper-btns">
          <view class="swiper-btn" @click="handlePrev">
            <Left></Left>
          </view>
          <view class="swiper-btn" @click="handleNext">
            <Right></Right>
          </view>
        </view>
      </view>

      <view class="comment-section">
        <nut-cell-group title="用户评论">
          <nut-cell v-for="(comment, index) in comments" :key="index" :title="comment.user" :sub-title="comment.content"
            size="large" :desc="comment.time">
            <template #icon>
              <nut-avatar size="small">
                <image :src="comment.avatar" />
              </nut-avatar>
            </template>
          </nut-cell>
        </nut-cell-group>
      </view>

    </scroll-view>

    <view v-if="showInput" class="modal-mask">
      <view class="modal-content">
        <nut-cell title="选择地址" :desc="cascaderValue.toString() || '请选择地址'" @click="cascaderVisible = true" />
        <view class="modal-buttons">
          <nut-button @click="cancel">取消</nut-button>
          <nut-button type="primary" @click="confirm">确认</nut-button>
        </view>
      </view>
    </view>

    <view class="place-card">
      <view class="place-name">{{ end }}</view>
      <view class="actions">
        <nut-button shape="round" type="default" size="normal" @click="onClickComment">
          <template #icon>
            <Message />
          </template>
          评论
        </nut-button>
        <nut-button shape="round" type="default" size="normal" @click="onCollect">
          <template #icon>
            <view v-if="isCollect">
              <image src="/assets/icons/收藏 (已收藏).png" class="icon" />
            </view>
            <view v-else>
              <image src="/assets/icons/收藏.png" class="icon" />
            </view>
          </template>
          收藏
        </nut-button>
        <nut-button shape="round" type="primary" size="normal" @click="navigateToPlace">
          <template #icon>
            <image src="/assets/icons/导航.png" class="icon" />
          </template>
          去这里
        </nut-button>
      </view>
    </view>
    <nut-popup v-model:visible="showPopup" position="bottom">
      <nut-textarea v-model="textareaValue" :limit-show="true" :max-length="25" placeholder="请输入评论" />
      <view class="popup-buttons">
        <nut-button type="primary" size='normal' @click="OnCommitComment">提交</nut-button>
      </view>
    </nut-popup>
    <nut-cascader v-model:visible="cascaderVisible" v-model="cascaderValue" title="请选择您的当前位置"
      :options="options"></nut-cascader>
  </view>
</template>

<script setup>
import './index.scss'
import Taro, { useRouter } from "@tarojs/taro";
import { onMounted, ref } from "vue";
import photo from '/src/assets/A1.jpg'
import collectIcon from 'src/assets/icons/收藏.png'
import hasCollectIcon from 'src/assets/icons/收藏 (已收藏).png'
import wayIcon from 'src/assets/icons/导航.png'
import message from 'src/assets/icons/聊天.png'
import { Message, Left, Right, Search2 } from '@nutui/icons-vue-taro'
import building from 'src/assets/building.json'
import { collectJudgement, uploadCollection, deleteCollection, getComment, uploadComment } from 'src/utils/api.ts'
import { comment } from 'postcss';

const params = Taro.getCurrentInstance().router?.params
console.log(params?.name)

const imgList = ref([
  '/assets/A1.jpg',
  '/assets/icons/导航.png',
  '/assets/icons/收藏.png',
])
const swiperList = ref(imgList.value.map(url => ({ src: url })))
const showInput = ref(false)
const showPopup = ref(false)
const textareaValue = ref('')
const cascaderVisible = ref(false)
const swiperRef = ref()
const options = ref(building)
const cascaderValue = ref([])
const showPreview = ref(false)
const currentIndex = ref(0)
const isCollect = ref(false)
const notLogin = ref(false)
const comments = ref([
  {
    user: '用户A',
    content: '这个产品太棒了，非常实用啊啊啊啊',
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

const scrollViewHeight = ref(0)

const navigateToPlace = () => {
  showInput.value = true
}

const OnCommitComment = () => {
  if (textareaValue.value.trim() === '') {
    Taro.showToast({
      title: '评论内容不能为空',
      icon: 'none',
    })
    return
  }
  uploadComment({
    name: end.value,
    comment: textareaValue.value,
    images: [],
  }).then((res) => {
    console.log('uploadComment:', res)
    if (res.code == '504') {
      notLogin.value = true
      return
    }
    Taro.showToast({
      title: '评论成功',
      icon: 'success',
    })
    textareaValue.value = ''
    showPopup.value = false
  }).catch((err) => {
    console.error('Error:', err)
  })
}

const onSearch = () => {
  Taro.navigateTo({
    url: '/pages/history/index/index',
  })
}

const cancel = () => {
  showInput.value = false
  inputValue.value = ''
}

const end = ref('')
onMounted(() => {
  const instance = Taro.getCurrentInstance()
  const params = instance?.router?.params || {}
  end.value = params.name || ''
  console.log('收到参数 end:', end.value)

  Taro.getSystemInfo({
    success: (res) => {
      const query = Taro.createSelectorQuery()
      query.select('.place-card').boundingClientRect()
      query.exec((rects) => {
        const placeCardHeight = rects[0]?.height || 0
        scrollViewHeight.value = res.windowHeight - placeCardHeight
      })
    }
  })

  collectJudgement({
    name: end.value,
  }).then((res) => {
    console.log('collectJudgement:', res)
    if (res.code == '504') {
      notLogin.value = true
      return
    }
    else if (res.data) {
      isCollect.value = true
    } else {
      isCollect.value = false
    }
  }).catch((err) => {
    console.error('Error:', err)
    isCollect.value = false
  })

  getComment({
    name: end.value,
  }).then((res) => {
    console.log('getComment:', res)
    if (res.code == '504') {
      notLogin.value = true
      return
    }
    if (res.data.comments) {
      comments.value = res.data.comments.map(comment => comment.description)
    }
    else {
      comments.value = []
    }
})
  .catch((err) => {
    console.error('Error:', err)
    comments.value = []
  })
})

const confirm = () => {
  showInput.value = false
  console.log('选择的地址:', cascaderValue.value[2])
  Taro.navigateTo({
    url: `/pages/navigation/index/index?start=${cascaderValue.value[2]}&end=${end.value}`,
  })
}

const onClickComment = () => {
  if (notLogin.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
    })
    return
  }
  showPopup.value = true
}

const handlePrev = () => {
  swiperRef.value?.prev()
}
const handleNext = () => {
  swiperRef.value?.next()
}

const hideFn = () => {
  showPreview.value = false
}

const showFn = (index) => {
  showPreview.value = true
}

const swiperOnChange = (index) => {
  currentIndex.value = index
}

const onCollect = () => {
  if (notLogin.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
    })
    return
  }
  if (isCollect.value) {
    deleteCollection({
      name: end.value
    }).then((res) => {
      console.log('deleteCollection:', res)
      if (res.code == '504') {
        notLogin.value = true
        return
      }
    }).catch((err) => {
      console.error('Error:', err)
    })
    Taro.showToast({
      title: '已取消收藏',
      icon: 'none',
    })
  } else {
    uploadCollection({
      name: end.value,
    }).then((res) => {
      console.log('uploadCollection:', res)
      if (res.code == '504') {
        notLogin.value = true
        return
      }
    }).catch((err) => {
      console.error('Error:', err)
    })
    Taro.showToast({
      title: '收藏成功',
      icon: 'success',
    })
  }
  isCollect.value = !isCollect.value

}
</script>

<style lang="scss">
@import './index'; // 如果你写在外部文件中</style>