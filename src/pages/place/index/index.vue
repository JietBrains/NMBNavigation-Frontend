<template>
  <nut-image-preview :show="showPreview" :images="swiperList" :init-no="currentIndex" @close="hideFn" />
  <nut-image-preview :show="showUserPicture" :images="showedPicture" @close="showUserPicture = false" />
  <view class="container">
    <nut-searchbar disabled="true" @click="onSearch">
      <template #rightin>
        <Search2 />
      </template>
    </nut-searchbar>

    <scroll-view scroll-y="true" class="scroll-area">
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
        <view class="section-title">用户评论（{{ comments.length }}）</view>
        <view class="comment-list">
          <view class="comment-item" v-for="(item, index) in comments" :key="index">
            <image class="avatar" :src="item.avatar" mode="aspectFill" />
            <view class="comment-content">
              <view class="comment-header">
                <text class="username">{{ item.user }}</text>
                <text class="time">{{ item.time }}</text>
              </view>
              <text class="comment-text">{{ item.description }}</text>
              <view class="image-list" v-if="item.images.length">
                <image v-if="item.images" :src="item.images" class="comment-image" mode="aspectFill"
                  @tap="toShowPicture(item)" />
              </view>
            </view>
          </view>
        </view>
      </view>

    </scroll-view>

    <view v-if="showInput" class="modal-mask">
      <view class="modal-content">
        <nut-cell title="请选择您的当前地址" :desc="cascaderValue.toString() || '当前地址'" @click="cascaderVisible = true" />
        <view class="modal-buttons">
          <nut-button @click="cancel">取消</nut-button>
          <nut-button type="primary" @click="confirm">确认</nut-button>
        </view>
      </view>
    </view>

    <nut-fixed-nav v-model:visible="fixedNavvisible"
      :position="{ top: 'calc(25% - 30px)', transform: 'translateY(-50%)' }" type="right" :nav-list="navList"
      @selected="onSelected">
      <template #btn>
        <MoreX color="#fff" />
        <span class="text">更多</span>
      </template>
    </nut-fixed-nav>
    <nut-fixed-nav :visible="false" :position="{ top: 'calc(25% + 30px)', transform: 'translateY(-50%)' }" type="right"
      @click="navigateToPlace">
      <template #btn>
        <Find color="#fff" />
        <span class="text">导航</span>
      </template>
    </nut-fixed-nav>
    <nut-popup v-model:visible="showPopup" position="bottom" @close="closePopup">
      <nut-textarea v-model="formData.description" :limit-show="true" :max-length="25" placeholder="请输入评论" />
      <nut-uploader name="images" :data="formData" :maximize="1024 * 1024 * 5" maximum="1"
        url="https://backend.jietbrains.top/comment/upload" :auto-upload="false" ref="uploadRef" :headers="header"
        @oversize="onOversize" @success="onUploadSuccess" @failure="onUploadFailure" @change="handleFileChange"
        @delete="handleFileDelete"></nut-uploader>
      <br />
      <view class="popup-buttons">
        <nut-button type="primary" size='normal' @click="OnCommitComment">提交</nut-button>
      </view>
    </nut-popup>


    <nut-cascader v-model:visible="cascaderVisible" v-model="cascaderValue" title="请选择您的当前位置"
      :options="options"></nut-cascader>
  </view>
  <Tabbar></Tabbar>
</template>

<script setup>
import './index.scss'
import Taro, { useRouter, nextTick } from "@tarojs/taro";
import { onMounted, ref } from "vue";
import photo from '/src/assets/A1.jpg'
import collectIcon from 'src/assets/icons/收藏.png'
import hasCollectIcon from 'src/assets/icons/收藏 (已收藏).png'
import message from 'src/assets/icons/聊天.png'
import navigationIcon from 'src/assets/icons/导航.png'
import { Message, Left, Right, Search2, MoreX, Find } from '@nutui/icons-vue-taro'
import building from 'src/assets/building.json'
import { collectJudgement, uploadCollection, deleteCollection, getComment, uploadComment, searchPhotos, checkLogin } from 'src/utils/api.ts'
import Tabbar from '../../../components/Tabbar.vue'
import { Uploader } from '@nutui/nutui-taro';

const imgList = ref()
const uploadRef = ref(null);
const swiperList = ref()
const showInput = ref(false)
const showPopup = ref(false)
const textareaValue = ref('')
const cascaderVisible = ref(false)
const swiperRef = ref()
const options = ref(building)
const cascaderValue = ref([])
const showPreview = ref(false)
const showUserPicture = ref(false)
const currentIndex = ref(0)
const isCollect = ref(false)
const hasLogin = ref(false)
const comments = ref([]);
const fixedNavvisible = ref(false)
const navList = ref([])
const end = ref('')
const fileNumber = ref(0)
const showedPicture = ref([{ src: 'https://api.dicebear.com/7.x/bottts/png?seed=43' }])
const header = ref({
  'Content-Type': 'multipart/form-data',
  'Authorization': Taro.getStorageSync('token') || ''
})
const navListWithCollect = ref([
  {
    id: 1,
    text: '评论',
    icon: message,
  },
  {
    id: 2,
    text: '收藏',
    icon: hasCollectIcon,
  }
])

const navListWithoutCollect = ref([
  {
    id: 1,
    text: '评论',
    icon: message,
  },
  {
    id: 2,
    text: '收藏',
    icon: collectIcon,
  }
])

const navigateToPlace = () => {
  showInput.value = true
}

const formData = ref({
  name: '',
  description: ''
});

const OnCommitComment = () => {
  if (!hasLogin.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
    })
    return
  }
  if (!formData.value.description) {
    Taro.showToast({
      title: '评论内容不能为空',
      icon: 'none',
    })
    return
  }
  formData.value.name = end.value
  if (fileNumber.value === 0) {
    uploadComment({
      name: formData.value.name,
      description: formData.value.description
    }).then((res) => {
      console.log('uploadComment:', res)
      if (res.code == 200) {
        Taro.showToast({
          title: '评论提交成功',
          icon: 'success',
        });
        showPopup.value = false;
        nextTick(() => {
          formData.value.description = '';
          uploadRef.value.clearUploadQueue();
        });
        // 刷新评论列表
        getComment({
          name: end.value
        }).then((res) => {
          console.log('getComment:', res)
          if (res.code == 200) {
            if (res.data.comments) {
              comments.value = res.data.comments
              comments.value.forEach((item) => {
                item.time = item.time.substring(0, 10)
              })
            } else {
              comments.value = []
            }
            console.log('comments:', comments.value)
          }
        }).catch((err) => {
          console.error('Error:', err)
          comments.value = []
        })
      } else {
        Taro.showToast({
          title: '评论提交失败',
          icon: 'none',
        });
      }
    }).catch((err) => {
      console.error('Error:', err)
      Taro.showToast({
        title: '评论提交失败',
        icon: 'none',
      });
    });
  }
  else {
    uploadRef.value.submit()
  }
}

const onSearch = () => {
  Taro.navigateBack({
    delta: 1  // 默认就是1，不传也是返回一层
  })
}

const cancel = () => {
  showInput.value = false
}

onMounted(() => {
  checkLogin().then((res) => {
    console.log('checkLogin:', res)
    if (res.code === 200) {
      hasLogin.value = true
      console.log('已登录，用户信息:', res.data)
    } else {
      hasLogin.value = false
      console.log('未登录或登录状态已过期')
      console.log(hasLogin.value)
    }
  }).catch(err => {
    console.error('检查登录状态失败:', err)
    hasLogin.value = false
  })
  const instance = Taro.getCurrentInstance()
  const params = (instance && instance.router && instance.router.params) || {};
  end.value = params.name || ''
  console.log('收到参数 end:', end.value)
  console.log('hasLogin:', hasLogin.value)
  searchPhotos({
    name: end.value,
  }).then((res) => {
    console.log('searchPhotos:', res)
    if (res.code == 200) {
      imgList.value = [res.data.floor]
      console.log('imgList:', imgList.value)
      swiperList.value = imgList.value.map(url => ({ src: url }))
      console.log('swiperList:', swiperList.value)
    } else {
      imgList.value = [photo]
      swiperList.value = imgList.value.map(url => ({ src: url }))
    }
  }).catch((err) => {
    console.error('Error:', err)
    imgList.value = [photo]
    swiperList.value = imgList.value.map(url => ({ src: url }))
  })
  console.log(hasLogin.value)
  if (!hasLogin.value) {
    console.log("here!!!")
    navList.value = navListWithoutCollect.value
    isCollect.value = false
    comments.value = []
  } else {
    console.log("here!!!!!!")
    collectJudgement({
      name: end.value,
    }).then((res) => {
      console.log('collectJudgement:', res)
      if (res.code == 200) {
        if (res.data) {
          isCollect.value = true
          navList.value = navListWithCollect.value
        } else {
          isCollect.value = false
          navList.value = navListWithoutCollect.value
        }
      }
    }).catch((err) => {
      console.error('Error:', err)
      isCollect.value = false
    })
  }

  getComment({
    name: end.value,
  }).then((res) => {
    console.log('name', end.value)
    console.log('getComment:', res)
    if (res.code == 200) {
      if (res.data.comments) {
        comments.value = res.data.comments
        comments.value.forEach((item) => {
          item.time = item.time.substring(0, 10)
        })
      } else {
        comments.value = []
      }
      console.log('comments:', comments.value)
    }
  }).catch((err) => {
    console.error('Error:', err)
    comments.value = []
  })
  // comments.value = [
  //   {
  //     user: '',
  //     description: '这是一条带图片的评论',
  //     time: '2025-05-03',
  //     avatar: '',
  //     images: "http://8.140.200.27:5000/images/d9599d16-d9eb-4781-8d06-8a7f031532ca.png" // 新增图片数组
  //   },
  //   {
  //     user: '测试用户2',
  //     description: '无图片评论',
  //     time: '2023-04-29',
  //     avatar: 'https://api.dicebear.com/7.x/bottts/png?seed=43',
  //     images:  ""// 空数组表示无图片
  //   }
  // ]
})

const confirm = () => {
  showInput.value = false
  console.log('选择的地址:', cascaderValue.value[2])
  Taro.navigateTo({
    url: `/pages/navigation/index/index?start=${cascaderValue.value[2]}&end=${end.value}`,
  })
}

const onClickComment = () => {
  if (!hasLogin.value) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none',
    })
    return
  }
  showPopup.value = true
}

const handlePrev = () => {
  swiperRef.value && swiperRef.value.prev()
}
const handleNext = () => {
  swiperRef.value && swiperRef.value.next()
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

const closePopup = () => {
  showPopup.value = false
  nextTick(() => {
    formData.value.description = ''
    uploadRef.value.clearUploadQueue();
  })
}

const onCollect = () => {
  if (!hasLogin.value) {
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
      if (!hasLogin.value) {
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

const onSelected = ({ item: item, $event: Event }) => {
  console.log('onSelected:', item)
  if (item.id == 1) {
    onClickComment()
  } else if (item.id == 2) {
    onCollect()
    if (isCollect.value) {
      navList.value = navListWithCollect.value
    } else {
      navList.value = navListWithoutCollect.value
    }
  }
}

const onOversize = (file) => {
  Taro.showToast({
    title: `文件 ${file.name} 超过5MB限制大小`,
    icon: 'none',
  });
}

const onUploadSuccess = () => {
  Taro.showToast({
    title: '评论提交成功',
    icon: 'success',
  });
  showPopup.value = false;
  nextTick(() => {
    formData.value.description = '';
    uploadRef.value.clearUploadQueue();
  });
  // 刷新评论列表
  getComment({
    name: end.value
  }).then((res) => {
    console.log('getComment:', res)
    if (res.code == 200) {
      if (res.data.comments) {
        comments.value = res.data.comments
        comments.value.forEach((item) => {
          item.time = item.time.substring(0, 10)
        })
      } else {
        comments.value = []
      }
      console.log('comments:', comments.value)
    }
  }).catch((err) => {
    console.error('Error:', err)
    comments.value = []
  })
}

const onUploadFailure = (file) => {
  Taro.showToast({
    title: `文件上传失败`,
    icon: 'none',
  });
}

const handleFileChange = (files) => {
  fileNumber.value = files.fileList.length; // 获取文件数量
  console.log('文件数量:', files.fileList.length); // 直接访问 length 属性
}

const handleFileDelete = (file) => {
  fileNumber.value -= 1; // 删除文件时减少数量
  console.log('删除文件后数量:', fileNumber.value);
}

const toShowPicture = (item) => {
  showedPicture.value[0] = { src: item.images || 'https://api.dicebear.com/7.x/bottts/png?seed=43' };
  showUserPicture.value = true;
}
</script>

<style lang="scss">
@import './index'; // 如果你写在外部文件中</style>
