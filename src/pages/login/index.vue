<template>
  <view class="login-container">
    <!-- 用户信息卡片 -->
    <nut-cell-group class="user-card">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatarUrl" mode="aspectFill" :class="{ 'avatar-animate': false }" />
        <view class="user-detail">
          <text class="nickname">{{ userInfo.nickName }}</text>
          <nut-button type="primary" size="small" @tap='showPopup = true' class="login-btn">
            更新用户头像昵称
          </nut-button>
        </view>
      </view>
    </nut-cell-group>

    <!-- 导航按钮组 -->
    <view class="nav-section">
      <nut-cell-group>
        <nut-cell title="🧭 首页" is-link @click="Taro.reLaunch({url: '/pages/map/index/index'})" class="nav-item" />
        <nut-cell title="⭐ 收藏页面" is-link @click="Taro.reLaunch({url: '/pages/collect/index/index'})" class="nav-item" />
        <nut-cell title="🔍 搜索页面" is-link @click="Taro.reLaunch({url: '/pages/history/index/index'})" class="nav-item" />
        <nut-cell title="📝 反馈页面" is-link @click="Taro.navigateTo({url: '/pages/feedback/index/index'})" class="nav-item" />
      </nut-cell-group>
    </view>

    <Tabbar :count="3"></Tabbar>
  </view>
  <nut-popup v-model:visible="showPopup" position="bottom" class="login-popup" @close="closePopup">
    <view class="popup-title">填写头像昵称信息</view>
    <button open-type="chooseAvatar" class="avatar-wrapper" @chooseavatar="onChooseAvatar">
      <image class="avatar1" :src="avatarUrl"></image>
    </button>
    <nut-cell>
      <input v-model="nickname" type="nickname" class="weui-input" placeholder="请输入昵称"/>
    </nut-cell>
    <nut-button type='primary' size='large' class="confirm-btn" @tap="updateUserInfo"> 确定 </nut-button>
  </nut-popup>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import Tabbar from 'src/components/Tabbar.vue'
import { getUserInfo, updateInfo } from 'src/utils/api'

interface SimpleUserInfo {
  avatarUrl: string
  nickName: string
}

const userInfo = reactive<SimpleUserInfo>({
  avatarUrl: '',
  nickName: '',
})

const showPopup = ref(false)
const avatarUrl = ref('')
const nickname = ref('')

onMounted(async () => {
  let tempNickname = Taro.getStorageSync('nickName')
  let tempAvatar = Taro.getStorageSync('avatar')
  console.log('临时昵称:', tempNickname)
  console.log('临时头像:', tempAvatar)
  if (!tempNickname || !tempAvatar) {
    let getInfoRes = await getUserInfo()
    if (getInfoRes.code === 200) {
      userInfo.avatarUrl = getInfoRes.data.avatar
      userInfo.nickName = getInfoRes.data.nickname
      avatarUrl.value = userInfo.avatarUrl
      nickname.value = userInfo.nickName
      Taro.setStorageSync('nickName', userInfo.nickName)
      Taro.setStorageSync('avatar', userInfo.avatarUrl)
      console.log('获取用户信息成功:', userInfo)
    } else {
      console.error('获取用户信息失败:', getInfoRes)
    }
  } else {
    userInfo.avatarUrl = tempAvatar
    userInfo.nickName = tempNickname
    avatarUrl.value = userInfo.avatarUrl
    nickname.value = userInfo.nickName
    console.log('从缓存获取用户信息:', userInfo)
  }
})

const onChooseAvatar = (e: any) => {
  console.log('选择头像:', e)
  if (e.detail.avatarUrl) {
    avatarUrl.value = e.detail.avatarUrl
  }
}

const closePopup = () => {
  console.log('关闭弹窗')
  console.log('选择的头像:', avatarUrl.value)
  console.log('输入的昵称:', nickname.value)
  avatarUrl.value = userInfo.avatarUrl // 重置头像
  nickname.value = userInfo.nickName // 重置昵称
  showPopup.value = false
}

const updateUserInfo = () => {
  console.log('nickname.length:', nickname.value.length)
  if (avatarUrl.value === userInfo.avatarUrl && nickname.value === userInfo.nickName) {
    Taro.showToast({
      title: '未作出修改',
      icon: 'none',
      duration: 2000
    })
    return
  } else if (nickname.value.length < 2 || nickname.value.length > 15) {
    Taro.showToast({
      title: '昵称长度应在2-15个字符之间',
      icon: 'none',
      duration: 2000
    })
    return
  }
  else if (avatarUrl.value === userInfo.avatarUrl) { // 对应未修改头像的情况
    updateInfo({ nickName: nickname.value }).then((res) => {
      if (res.code === 200) {
        Taro.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000
        })
        userInfo.nickName = nickname.value
        nickname.value = userInfo.nickName
        Taro.setStorageSync('nickName', userInfo.nickName)
        showPopup.value = false
      } else {
        Taro.showToast({
          title: '更新失败',
          icon: 'none',
          duration: 2000
        })
      }
    }).catch((err) => {
      console.error('更新失败:', err)
      Taro.showToast({
        title: '更新失败',
        icon: 'none',
        duration: 2000
      })
    })
  } else {
    Taro.uploadFile({
      url: 'https://backend.jietbrains.top/user/updateInfo?nickName=' + nickname.value, // 替换为你的上传接口
      filePath: avatarUrl.value,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': Taro.getStorageSync('token') || 'unknown',
      },
      success: (res) => {
        console.log('上传成功:', res)
        // TODO: 处理上传成功后的逻辑
        console.log('上传结果:', res.data)
        if (typeof res.data === 'string') {
          res.data = JSON.parse(res.data)
        }
        if (res.data.code !== 200) {
          Taro.showToast({
            title: '更新失败',
            icon: 'none',
            duration: 2000
          })
          return
        } else {
          Taro.showToast({
            title: '更新成功',
            icon: 'success',
            duration: 2000
          })
          userInfo.avatarUrl = res.data.data.avatar
          userInfo.nickName = nickname.value
          avatarUrl.value = userInfo.avatarUrl
          nickname.value = userInfo.nickName
          Taro.setStorageSync('nickName', userInfo.nickName)
          Taro.setStorageSync('avatar', userInfo.avatarUrl)
          showPopup.value = false
        }
      },
      fail: (err) => {
        console.error('上传失败:', err)
        Taro.showToast({
          title: '更新失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
    )
  }
}
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 20px;
}

.user-card {
  margin-bottom: 24px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #bce4ee 0%, #86d88a 100%);
  min-height: 180px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 6px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  object-fit: cover;
}

.avatar-animate {
  animation: avatarPop 0.5s ease;
}

@keyframes avatarPop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.user-detail {
  margin-left: 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nickname {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 16px;
  display: block;
  letter-spacing: 1px;
}

.login-btn {
  background: #fff !important;
  color: #4CAF50 !important;
  border: none !important;
  font-weight: 600;
  padding: 16px 40px;
  border-radius: 32px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  font-size: 20px;
  margin-top: 16px;
  width: fit-content;
  min-width: 180px;
  text-align: center;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.nav-section {
  margin-top: 20px;
}

.nav-item {
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

// 自定义 NutUI 组件样式
:deep(.nut-cell) {
  padding: 16px !important;
  font-size: 16px !important;
}

:deep(.nut-cell__title) {
  font-weight: 500 !important;
}

:deep(.nut-cell__value) {
  color: #999 !important;
}

.login-popup {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px; // 增加整个弹出层的内边距

  .popup-title {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px; // 与头像之间的间距
  }

  .avatar-wrapper {
    padding: 0;
    width: 120px !important;
    height: 120px !important;
  }

  // 头像样式调整
  .avatar1 {
    width: 120px;
    height: 120px;
    margin: 0 auto; // 头像居中
    display: block;
  }

  .input-container {
    padding: 10px 0; // 垂直间距

    :deep(.nut-cell) {
      padding: 0; // 移除cell默认内边距
    }
  }

  .custom-input {
    width: 100%;
    padding: 20px 15px;
    font-size: 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
    box-sizing: border-box;
  }

  .btn-container {
    display: flex;
    justify-content: center;
    padding: 10px 0 20px;

    .confirm-btn {
      width: 80%;
      height: 48px;
      font-size: 16px;
      border-radius: 24px;
      background: #07c160;
      border: none;
    }
  }
}

.weui-input {
  flex: 1;
  font-size: 30px;
  padding: 8px;
  border: none;
  background: transparent;
}
</style>