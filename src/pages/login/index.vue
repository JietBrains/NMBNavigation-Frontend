<template>
  <view class="login-container">
    <!-- 用户信息卡片 -->
    <nut-cell-group class="user-card">
      <view class="user-info">
        <image class="avatar" :src="hasUserInfo ? userInfo.avatarUrl : defaultAvatar" mode="aspectFill"
          :class="{ 'avatar-animate': hasUserInfo }" />
        <view class="user-detail">
          <text v-if="hasUserInfo" class="nickname">{{ userInfo.nickName }}</text>
          <nut-button v-else type="primary" size="small" @tap="getUserProfile" class="login-btn">
            点击登录
          </nut-button>
        </view>
      </view>
    </nut-cell-group>

    <!-- 导航按钮组 -->
    <view class="nav-section">
      <nut-cell-group>
        <nut-cell title="🧭 首页" is-link @click="goTo('/pages/map/index/index')" class="nav-item" />
        <nut-cell title="⭐ 收藏页面" is-link @click="goTo('/pages/collect/index/index')" class="nav-item" />
        <nut-cell title="🔍 搜索页面" is-link @click="goTo('/pages/history/index/index')" class="nav-item" />
        <nut-cell title="📝 反馈页面" is-link @click="goTo('/pages/feedback/index/index')" class="nav-item" />
      </nut-cell-group>
    </view>

    <Tabbar :count="3"></Tabbar>
  </view>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import Tabbar from 'src/components/Tabbar.vue'
import { login } from 'src/utils/api'

interface SimpleUserInfo {
  avatarUrl: string
  nickName: string
}

const userInfo = reactive<SimpleUserInfo>({
  avatarUrl: '',
  nickName: '',
})

const hasUserInfo = ref(false)
const defaultAvatar = 'https://cdn.jsdelivr.net/gh/hjzts/imgs/img202505010233338.png'

interface UserInfo {
  avatarUrl: string
  city: string
  country: string
  gender: number
  language: string
  nickName: string
  province: string
}

interface UserProfile {
  cloudID: string
  encryptedData: string
  errMsg: string
  iv: string
  rawData: string
  signature: string
  userInfo: UserInfo
}

const userProfile = reactive<UserProfile>({
  cloudID: '',
  encryptedData: '',
  errMsg: '',
  iv: '',
  rawData: '',
  signature: '',
  userInfo: {
    avatarUrl: '',
    city: '',
    country: '',
    gender: 0,
    language: '',
    nickName: '',
    province: ''
  }
})
const username = ref('')
const password = ref('')

interface LoginResponse {
  code: number
  data: {
    token: string
  }
}

const getUserProfile = () => {
  Taro.getUserProfile({
    desc: '用于完善会员信息',
    success: async (res) => {
      try {
        let loginRes = await Taro.login()
        console.log('微信登录成功:', loginRes)
        
        const res2 = await login({
          'username': username.value,
          'password': password.value,
          'nickname': userProfile.userInfo.nickName,
          'avatarurl': userProfile.userInfo.avatarUrl
        }) as LoginResponse

        console.log('res:', res2)
        if (res2.code === 200) {
          Taro.setStorageSync('token', res2.data.token)
          Taro.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          Taro.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
        }
      } catch (error) {
        console.error('登录失败:', error)
      }

      Object.assign(userInfo, res.userInfo)
      hasUserInfo.value = true
      // 显示登录成功提示
      Taro.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000
      })
    },
    fail: () => {
      Taro.showToast({
        title: '登录失败',
        icon: 'error',
        duration: 2000
      })
    }
  })
}

const goTo = (url: string) => {
  console.log(url)
  Taro.navigateTo({ url: url })
  // Taro.reLaunch({ url: url })
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
</style>